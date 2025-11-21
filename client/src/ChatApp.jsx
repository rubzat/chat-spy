
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, Shield, Copy, Check, PhoneIncoming, Phone, X, Loader2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Connect to backend
const socket = io('http://localhost:3001');

export default function ChatApp() {
    const [view, setView] = useState('IDLE'); // IDLE, REQUESTING, INCOMING, CHAT
    const [myPin, setMyPin] = useState(null);
    const [targetPin, setTargetPin] = useState('');
    const [incomingPin, setIncomingPin] = useState('');
    const [activeChatPin, setActiveChatPin] = useState('');

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('connect', () => console.log('Connected'));

        socket.on('pin_assigned', (pin) => setMyPin(pin));

        // --- Request Flow ---
        socket.on('incoming_request', ({ fromPin }) => {
            if (view === 'IDLE') {
                setIncomingPin(fromPin);
                setView('INCOMING');
            } else {
                // Auto-reject if busy (handled by server mostly, but good safety)
                socket.emit('reject_chat', fromPin);
            }
        });

        socket.on('chat_started', ({ withPin }) => {
            setActiveChatPin(withPin);
            setView('CHAT');
            setMessages([]); // Clear previous chat
            setError('');
        });

        socket.on('chat_rejected', () => {
            setView('IDLE');
            setError('Solicitud rechazada o usuario ocupado.');
            setTimeout(() => setError(''), 3000);
        });

        socket.on('chat_ended', () => {
            setView('IDLE');
            setActiveChatPin('');
            setMessages([]);
            alert('El chat ha finalizado.');
        });

        // --- Messaging ---
        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: 'received' }]);
        });

        socket.on('message_sent', (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: 'sent' }]);
        });

        socket.on('error', (msg) => {
            setError(msg);
            setTimeout(() => setError(''), 3000);
            if (view === 'REQUESTING') setView('IDLE');
        });

        socket.on('message_expired', (msgId) => {
            setMessages((prev) => prev.filter((m) => m.id !== msgId));
        });

        return () => {
            socket.off('connect');
            socket.off('pin_assigned');
            socket.off('incoming_request');
            socket.off('chat_started');
            socket.off('chat_rejected');
            socket.off('chat_ended');
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('error');
            socket.off('message_expired');
        };
    }, [view]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Actions ---

    const handleConnect = (e) => {
        e.preventDefault();
        if (!targetPin || targetPin.length !== 6) {
            setError('Ingresa un PIN válido de 6 dígitos.');
            return;
        }
        if (targetPin === myPin) {
            setError('No puedes llamarte a ti mismo.');
            return;
        }
        socket.emit('request_chat', targetPin);
        setView('REQUESTING');
    };

    const acceptChat = () => {
        socket.emit('accept_chat', incomingPin);
    };

    const rejectChat = () => {
        socket.emit('reject_chat', incomingPin);
        setView('IDLE');
        setIncomingPin('');
    };

    const endChat = () => {
        socket.emit('end_chat');
        setView('IDLE');
        setActiveChatPin('');
        setMessages([]);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit('send_message', message);
        setMessage('');
    };

    const copyPin = () => {
        if (myPin) {
            navigator.clipboard.writeText(myPin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // --- Renders ---

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4 font-sans text-white relative overflow-hidden">

            {/* Header (Always visible unless in chat maybe? No, keep it) */}
            <div className="glass-panel mb-4 p-4 flex flex-col items-center justify-center relative z-10">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Shield size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Mi Identidad</span>
                </div>
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-lg">
                        {myPin || '...'}
                    </h1>
                    <button onClick={copyPin} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-slate-400" />}
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
                        className="absolute top-20 left-0 right-0 mx-auto w-max z-50 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VIEW: IDLE */}
            {view === 'IDLE' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col justify-center items-center"
                >
                    <div className="w-full max-w-xs">
                        <label className="block text-slate-400 text-sm mb-2 text-center">CONECTAR CON AGENTE</label>
                        <form onSubmit={handleConnect} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="000000"
                                value={targetPin}
                                onChange={(e) => setTargetPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center text-3xl tracking-[0.5em] font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold tracking-wider transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            >
                                <Phone size={20} />
                                INICIAR ENLACE
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {/* VIEW: REQUESTING */}
            {view === 'REQUESTING' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col justify-center items-center text-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 size={64} className="text-emerald-400 animate-spin relative z-10" />
                    </div>
                    <h2 className="mt-8 text-2xl font-bold">Solicitando Enlace...</h2>
                    <p className="text-slate-400 mt-2">Esperando respuesta de {targetPin}</p>
                    <button
                        onClick={() => setView('IDLE')}
                        className="mt-8 px-6 py-2 border border-slate-700 rounded-full text-slate-400 hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                </motion.div>
            )}

            {/* VIEW: INCOMING */}
            {view === 'INCOMING' && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div className="glass-panel w-full max-w-sm p-8 text-center border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <PhoneIncoming size={40} className="text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Solicitud Entrante</h2>
                        <p className="text-slate-300 mb-8">El agente <span className="font-mono font-bold text-white">{incomingPin}</span> quiere establecer conexión segura.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={rejectChat}
                                className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} /> Rechazar
                            </button>
                            <button
                                onClick={acceptChat}
                                className="py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            >
                                <Phone size={18} /> Aceptar
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* VIEW: CHAT */}
            {view === 'CHAT' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    {/* Chat Header */}
                    <div className="flex items-center justify-between px-2 py-2 border-b border-white/5 mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-400">Conectado con: <span className="font-mono text-white font-bold">{activeChatPin}</span></span>
                        </div>
                        <button
                            onClick={endChat}
                            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            title="Finalizar Chat"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 1 } }}
                                    className={`flex flex-col ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl border ${msg.type === 'sent'
                                                ? 'bg-emerald-500/20 border-emerald-500/30 text-white rounded-tr-sm'
                                                : 'bg-slate-800/80 border-slate-700 text-white rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="text-base leading-relaxed break-words font-medium">{msg.content}</p>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                                        <span className="animate-pulse bg-red-500/50 w-1.5 h-1.5 rounded-full"></span>
                                        1m
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="relative mt-auto">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Mensaje seguro..."
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-4 pl-5 pr-14 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="absolute right-2 top-2 bottom-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg transition-all text-white"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
}

