import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatView({ chat, onSendMessage, onCloseChat, onSaveContact, isContactSaved, onClearMessages }) {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.messages]);

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

        onSendMessage(chat.roomId, message);
        setMessage('');
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
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] md:max-w-[70%] px-3 md:px-4 py-2 md:py-3 rounded-2xl ${isSent
                                        ? 'bg-emerald-600 text-white rounded-br-sm'
                                        : 'bg-slate-700 text-white rounded-bl-sm'
                                        }`}
                                >
                                    <p className="break-words text-sm md:text-base">{msg.text}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-white/5 bg-slate-900/50">
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
