import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, LogOut, Trash2, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sticker categories
const STICKERS = {
    emociones: ['😀', '😂', '😍', '😭', '😡', '🥺', '😎', '🤔', '😱', '🤗', '😴', '🤯'],
    gestos: ['👍', '👎', '👏', '🙏', '💪', '✌️', '🤝', '👋', '🤘', '👌', '✊', '🤞'],
    corazones: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '💖', '💕', '💗', '💓', '💝'],
    celebracion: ['🎉', '🎊', '🎈', '🎁', '✨', '🌟', '💫', '🔥', '⭐', '🎆', '🎇', '💥'],
    simbolos: ['✅', '❌', '⚠️', '💯', '🔥', '⭐', '💥', '💬', '👀', '🚀', '💡', '🎯']
};

export default function ChatView({ chat, onSendMessage, onCloseChat, onSaveContact, isContactSaved, onClearMessages }) {
    const [message, setMessage] = useState('');
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const stickerPickerRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.messages]);

    // Close sticker picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stickerPickerRef.current && !stickerPickerRef.current.contains(event.target)) {
                setShowStickerPicker(false);
            }
        };

        if (showStickerPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showStickerPicker]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Check for /eliminar command
        if (message.trim() === '/eliminar') {
            if (confirm('¿Eliminar todos los mensajes de este chat?')) {
                onClearMessages(chat.roomId);
            }
            setMessage('');
            return;
        }

        onSendMessage(chat.roomId, message, 'text');
        setMessage('');
    };

    const handleStickerSelect = (sticker) => {
        onSendMessage(chat.roomId, sticker, 'sticker');
        setShowStickerPicker(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-900/30">
            {/* Chat Header - Desktop Only (Mobile has separate header) */}
            <div className="hidden md:flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                        <div className="font-medium text-white">PIN: {chat.withPin}</div>
                        <div className="text-xs text-slate-400">{chat.messages.length} mensajes</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isContactSaved(chat.withPin) && (
                        <button
                            onClick={() => onSaveContact(chat.withPin)}
                            className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                            title="Guardar Contacto"
                        >
                            <Shield size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => onCloseChat(chat.roomId)}
                        className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        title="Cerrar Chat"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                <AnimatePresence>
                    {chat.messages.map((msg) => {
                        const isSent = msg.sender === chat.myPin || msg.type === 'sent';
                        const isSticker = msg.messageType === 'sticker';

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`${isSticker
                                        ? 'bg-transparent'
                                        : `max-w-[85%] md:max-w-[70%] px-3 md:px-4 py-2 md:py-3 rounded-2xl ${isSent
                                            ? 'bg-emerald-600 text-white rounded-br-sm'
                                            : 'bg-slate-700 text-white rounded-bl-sm'
                                        }`
                                        }`}
                                >
                                    {isSticker ? (
                                        <div className="text-6xl md:text-7xl leading-none">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="break-words text-sm md:text-base">{msg.text}</p>
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-white/5 bg-slate-900/50 relative">
                {/* Sticker Picker */}
                <AnimatePresence>
                    {showStickerPicker && (
                        <motion.div
                            ref={stickerPickerRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl p-3 md:p-4 shadow-2xl max-h-64 overflow-y-auto"
                        >
                            {Object.entries(STICKERS).map(([category, emojis]) => (
                                <div key={category} className="mb-3 last:mb-0">
                                    <div className="text-xs text-slate-400 mb-2 capitalize">{category}</div>
                                    <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                                        {emojis.map((emoji, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleStickerSelect(emoji)}
                                                className="text-2xl md:text-3xl hover:bg-slate-700 rounded-lg p-2 transition-colors"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 md:px-4 py-3 md:py-4 text-sm md:text-base focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                        maxLength={500}
                    />
                    <button
                        type="button"
                        onClick={() => setShowStickerPicker(!showStickerPicker)}
                        className={`px-3 md:px-4 py-3 md:py-4 ${showStickerPicker ? 'bg-emerald-600' : 'bg-slate-700'
                            } hover:bg-emerald-500 rounded-xl transition-colors flex items-center gap-2`}
                        title="Stickers"
                    >
                        <Smile size={18} className="md:hidden" />
                        <Smile size={20} className="hidden md:block" />
                    </button>
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="px-4 md:px-6 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Send size={18} className="md:hidden" />
                        <Send size={20} className="hidden md:block" />
                    </button>
                </div>
            </form>
        </div>
    );
}
