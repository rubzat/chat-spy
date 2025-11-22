
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Shield, Copy, Check, Share2, MessageCircle, PhoneIncoming, X, Menu, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';

// Connect to backend
const socket = io('https://chat-spy.onrender.com');

export default function ChatApp() {
    const [myPin, setMyPin] = useState(null);
    const [chats, setChats] = useState([]); // Array of { roomId, withPin, messages[], myPin }
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [view, setView] = useState('LIST'); // LIST, NEW_CHAT, INCOMING_REQUEST
    const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile sidebar toggle

    // New chat state
    const [targetPin, setTargetPin] = useState('');
    const [incomingPin, setIncomingPin] = useState('');
    const [waitingResponse, setWaitingResponse] = useState(false); // Waiting for chat acceptance

    // UI state
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [savedContacts, setSavedContacts] = useState([]);
    const [showContacts, setShowContacts] = useState(false);
    const [pinStatuses, setPinStatuses] = useState({}); // { pin: online }

    // Load saved data on mount
    useEffect(() => {
        const savedPin = localStorage.getItem('chatSpyPin');
        if (savedPin) {
            setMyPin(savedPin);
            console.log('PIN restaurado:', savedPin);
        }

        const contacts = localStorage.getItem('chatSpyContacts');
        if (contacts) {
            setSavedContacts(JSON.parse(contacts));
        }

        // Check URL for PIN parameter
        const path = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);

        const pathPin = path.replace('/', '').trim();
        if (pathPin && /^\d{6}$/.test(pathPin)) {
            setTargetPin(pathPin);
            setView('NEW_CHAT');
            console.log('PIN detectado en URL:', pathPin);
            // Auto-request chat after a short delay to ensure socket is connected
            setTimeout(() => {
                console.log('Auto-iniciando chat con PIN:', pathPin);
                socket.emit('request_chat', pathPin);
            }, 1000);
        } else if (urlParams.has('pin')) {
            const queryPin = urlParams.get('pin');
            if (queryPin && /^\d{6}$/.test(queryPin)) {
                setTargetPin(queryPin);
                setView('NEW_CHAT');
                console.log('PIN detectado en query:', queryPin);
                // Auto-request chat after a short delay
                setTimeout(() => {
                    console.log('Auto-iniciando chat con PIN:', queryPin);
                    socket.emit('request_chat', queryPin);
                }, 1000);
            }
        }
    }, []);

    // Socket event listeners
    useEffect(() => {
        socket.on('pin_assigned', (pin) => {
            setMyPin(pin);
            localStorage.setItem('chatSpyPin', pin);
            console.log('PIN asignado:', pin);
        });

        socket.on('incoming_request', ({ fromPin }) => {
            setIncomingPin(fromPin);
            setView('INCOMING_REQUEST');
        });

        socket.on('chat_created', ({ roomId, withPin }) => {
            // Add new chat
            setChats(prev => [...prev, {
                roomId,
                withPin,
                messages: [],
                myPin
            }]);
            setActiveRoomId(roomId);
            setView('LIST');
            setTargetPin('');
            setIncomingPin('');
            setWaitingResponse(false); // Clear waiting state
        });

        socket.on('chat_rejected', () => {
            setError('Solicitud rechazada.');
            setTimeout(() => setError(''), 3000);
            setView('LIST');
            setWaitingResponse(false); // Clear waiting state
        });

        socket.on('receive_message', ({ roomId, message }) => {
            setChats(prev => prev.map(chat =>
                chat.roomId === roomId
                    ? { ...chat, messages: [...chat.messages, { ...message, read: chat.roomId === activeRoomId }] }
                    : chat
            ));
        });

        socket.on('message_sent', ({ roomId, message }) => {
            setChats(prev => prev.map(chat =>
                chat.roomId === roomId
                    ? { ...chat, messages: [...chat.messages, { ...message, type: 'sent' }] }
                    : chat
            ));
        });

        socket.on('message_expired', ({ roomId, messageId }) => {
            setChats(prev => prev.map(chat =>
                chat.roomId === roomId
                    ? { ...chat, messages: chat.messages.filter(m => m.id !== messageId) }
                    : chat
            ));
        });

        socket.on('chat_closed', ({ roomId }) => {
            setChats(prev => prev.filter(chat => chat.roomId !== roomId));
            if (activeRoomId === roomId) {
                setActiveRoomId(null);
            }
            alert('El chat ha sido cerrado.');
        });

        socket.on('error', (msg) => {
            setError(msg);
            setTimeout(() => setError(''), 3000);
        });

        socket.on('messages_cleared', ({ roomId }) => {
            setChats(prev => prev.map(chat =>
                chat.roomId === roomId
                    ? { ...chat, messages: [] }
                    : chat
            ));
        });

        socket.on('pin_status', ({ pin, online }) => {
            setPinStatuses(prev => ({ ...prev, [pin]: online }));
        });

        return () => {
            socket.off('pin_assigned');
            socket.off('incoming_request');
            socket.off('chat_created');
            socket.off('chat_rejected');
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('message_expired');
            socket.off('chat_closed');
            socket.off('error');
        };
    }, [activeRoomId, myPin]);

    // Mark messages as read when switching chats
    useEffect(() => {
        if (activeRoomId) {
            setChats(prev => prev.map(chat =>
                chat.roomId === activeRoomId
                    ? { ...chat, messages: chat.messages.map(m => ({ ...m, read: true })) }
                    : chat
            ));
        }
    }, [activeRoomId]);

    // Actions
    const handleRequestChat = (e) => {
        e.preventDefault();
        if (!targetPin || targetPin.length !== 6) {
            setError('Ingresa un PIN válido de 6 dígitos.');
            return;
        }
        socket.emit('request_chat', targetPin);
        setWaitingResponse(true); // Set waiting state
        setView('WAITING'); // Change to waiting view
    };

    const handleAcceptChat = () => {
        socket.emit('accept_chat', incomingPin);
    };

    const handleRejectChat = () => {
        socket.emit('reject_chat', incomingPin);
        setIncomingPin('');
        setView('LIST');
    };

    const handleSendMessage = (roomId, text) => {
        socket.emit('send_message', { roomId, text });
    };

    const handleCloseChat = (roomId) => {
        if (confirm('¿Cerrar esta conversación?')) {
            socket.emit('close_chat', roomId);
        }
    };

    const handleSelectChat = (roomId) => {
        setActiveRoomId(roomId);
    };

    const handleNewChat = () => {
        setView('NEW_CHAT');
        setTargetPin('');
    };

    const handleClearMessages = (roomId) => {
        // Clear messages locally
        setChats(prev => prev.map(chat =>
            chat.roomId === roomId
                ? { ...chat, messages: [] }
                : chat
        ));
        // Optionally emit to server to sync with other user
        socket.emit('clear_messages', roomId);
    };

    // Contact management
    const saveContact = (pin, name = '') => {
        const contactName = name || prompt('Nombre para este contacto:') || `Contacto ${pin}`;
        const newContact = { pin, name: contactName, savedAt: Date.now() };
        const updatedContacts = [...savedContacts.filter(c => c.pin !== pin), newContact];
        setSavedContacts(updatedContacts);
        localStorage.setItem('chatSpyContacts', JSON.stringify(updatedContacts));
    };

    const deleteContact = (pin) => {
        const updatedContacts = savedContacts.filter(c => c.pin !== pin);
        setSavedContacts(updatedContacts);
        localStorage.setItem('chatSpyContacts', JSON.stringify(updatedContacts));
    };

    const isContactSaved = (pin) => {
        return savedContacts.some(c => c.pin === pin);
    };

    // Share functions
    const copyPin = () => {
        if (myPin) {
            navigator.clipboard.writeText(myPin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const sharePin = async () => {
        if (!myPin) return;
        const deepLink = `${window.location.origin}/${myPin}`;
        const shareText = `🕵️ Conéctate conmigo en Chat Spy!\n\nMi PIN: ${myPin}\n\nEnlace directo: ${deepLink}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'Mi PIN de Chat Spy', text: shareText });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    navigator.clipboard.writeText(shareText);
                    alert('PIN copiado al portapapeles!');
                }
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('PIN copiado al portapapeles!');
        }
    };

    const shareWhatsApp = () => {
        if (!myPin) return;
        const deepLink = `${window.location.origin}/${myPin}`;
        const message = `🕵️ Conéctate conmigo en Chat Spy!\n\nMi PIN: *${myPin}*\n\nEnlace directo: ${deepLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Get active chat
    const activeChat = chats.find(c => c.roomId === activeRoomId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
            {/* Header */}
            <div className="glass-panel mb-0 p-4 flex items-center justify-between relative z-10 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <Shield size={24} className="text-emerald-400" />
                    <div>
                        <h1 className="text-2xl font-mono font-bold tracking-wider">{myPin || '...'}</h1>
                        <span className="text-xs text-slate-400">Mi PIN</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={copyPin} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Copiar PIN">
                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-slate-400" />}
                    </button>
                    <button onClick={shareWhatsApp} className="p-2 hover:bg-green-600/20 rounded-full transition-colors" title="Compartir por WhatsApp">
                        <MessageCircle size={20} className="text-green-400" />
                    </button>
                    <button onClick={sharePin} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Compartir">
                        <Share2 size={20} className="text-blue-400" />
                    </button>
                </div>
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-20 left-0 right-0 mx-auto w-max z-50 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm shadow-lg"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Menu Overlay */}
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setShowMobileMenu(false)}
                    />
                )}

                {/* Chat List Sidebar - Mobile Drawer / Desktop Fixed */}
                <motion.div
                    initial={false}
                    animate={{
                        x: showMobileMenu || window.innerWidth >= 768 ? 0 : -320
                    }}
                    className="fixed md:relative z-50 md:z-auto h-full"
                >
                    <ChatList
                        chats={chats}
                        activeRoomId={activeRoomId}
                        onSelectChat={(roomId) => {
                            handleSelectChat(roomId);
                            setShowMobileMenu(false);
                        }}
                        onCloseChat={handleCloseChat}
                        onNewChat={() => {
                            handleNewChat();
                            setShowMobileMenu(false);
                        }}
                        savedContacts={savedContacts}
                    />
                </motion.div>

                {/* Main View */}
                <div className="flex-1 flex flex-col">
                    {/* Mobile Header - Show when chat is active */}
                    {activeChat && (
                        <div className="md:hidden flex items-center gap-3 p-4 bg-slate-900/50 border-b border-slate-700">
                            <button
                                onClick={() => {
                                    setActiveRoomId(null);
                                    setShowMobileMenu(true);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="flex-1">
                                <div className="font-medium">PIN: {activeChat.withPin}</div>
                                <div className="text-xs text-slate-400">{activeChat.messages.length} mensajes</div>
                            </div>
                        </div>
                    )}

                    {/* Hamburger Menu Button - Mobile Only */}
                    {!activeChat && view === 'LIST' && (
                        <div className="md:hidden p-4">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    )}

                    {view === 'NEW_CHAT' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col justify-center items-center p-4 md:p-8"
                        >
                            <div className="w-full max-w-md">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Nuevo Chat</h2>
                                <form onSubmit={handleRequestChat} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        value={targetPin}
                                        onChange={(e) => setTargetPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center text-2xl md:text-3xl tracking-[0.5em] font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-4 md:py-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={20} />
                                        INICIAR CHAT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('LIST')}
                                        className="w-full py-3 md:py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </form>

                                {/* Saved Contacts */}
                                {savedContacts.length > 0 && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setShowContacts(!showContacts)}
                                            className="w-full text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mb-3"
                                        >
                                            <Shield size={16} />
                                            Contactos Guardados ({savedContacts.length})
                                            <span className="text-xs">{showContacts ? '▲' : '▼'}</span>
                                        </button>
                                        <AnimatePresence>
                                            {showContacts && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="space-y-2"
                                                >
                                                    {savedContacts.map((contact) => (
                                                        <div
                                                            key={contact.pin}
                                                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm truncate">{contact.name}</div>
                                                                <div className="font-mono text-xs text-slate-400">{contact.pin}</div>
                                                            </div>
                                                            <div className="flex gap-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => {
                                                                        setTargetPin(contact.pin);
                                                                        setShowContacts(false);
                                                                    }}
                                                                    className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                                                                >
                                                                    <MessageCircle size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteContact(contact.pin)}
                                                                    className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {view === 'WAITING' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col justify-center items-center p-4 md:p-8"
                        >
                            <div className="relative">
                                <MessageCircle size={48} className="md:hidden text-emerald-400 mb-4 animate-pulse" />
                                <MessageCircle size={64} className="hidden md:block text-emerald-400 mb-4 animate-pulse" />
                                <div className="absolute inset-0 animate-ping">
                                    <MessageCircle size={48} className="md:hidden text-emerald-400/30" />
                                    <MessageCircle size={64} className="hidden md:block text-emerald-400/30" />
                                </div>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">Esperando Respuesta...</h2>
                            <p className="text-slate-400 mb-6 text-center">
                                Solicitud enviada a PIN: <span className="font-mono text-white text-lg md:text-xl">{targetPin}</span>
                            </p>
                            <p className="text-sm text-slate-500 text-center max-w-sm">
                                Esperando a que el usuario acepte tu solicitud de chat
                            </p>
                            <button
                                onClick={() => {
                                    setView('LIST');
                                    setWaitingResponse(false);
                                    setTargetPin('');
                                }}
                                className="mt-6 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                        </motion.div>
                    )}

                    {view === 'INCOMING_REQUEST' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col justify-center items-center p-4 md:p-8"
                        >
                            <PhoneIncoming size={48} className="md:hidden text-emerald-400 mb-4 animate-pulse" />
                            <PhoneIncoming size={64} className="hidden md:block text-emerald-400 mb-4 animate-pulse" />
                            <h2 className="text-xl md:text-2xl font-bold mb-2">Solicitud de Chat</h2>
                            <p className="text-slate-400 mb-6">PIN: <span className="font-mono text-white text-lg md:text-xl">{incomingPin}</span></p>
                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-sm">
                                <button
                                    onClick={handleAcceptChat}
                                    className="flex-1 px-6 md:px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors"
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={handleRejectChat}
                                    className="flex-1 px-6 md:px-8 py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {view === 'LIST' && activeChat && (
                        <ChatView
                            chat={activeChat}
                            onSendMessage={handleSendMessage}
                            onCloseChat={handleCloseChat}
                            onSaveContact={saveContact}
                            isContactSaved={isContactSaved}
                            onClearMessages={handleClearMessages}
                        />
                    )}

                    {view === 'LIST' && !activeChat && chats.length === 0 && (
                        <div className="flex-1 flex flex-col justify-center items-center text-slate-400 p-4">
                            <MessageCircle size={48} className="md:hidden mb-4 opacity-30" />
                            <MessageCircle size={64} className="hidden md:block mb-4 opacity-30" />
                            <p className="text-base md:text-lg">No hay conversaciones activas</p>
                            <p className="text-sm mt-2">Inicia un nuevo chat para comenzar</p>
                        </div>
                    )}

                    {view === 'LIST' && !activeChat && chats.length > 0 && (
                        <div className="flex-1 flex flex-col justify-center items-center text-slate-400 p-4">
                            <MessageCircle size={48} className="md:hidden mb-4 opacity-30" />
                            <MessageCircle size={64} className="hidden md:block mb-4 opacity-30" />
                            <p className="text-base md:text-lg">Selecciona una conversación</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
