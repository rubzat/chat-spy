import React from 'react';
import { MessageCircle, X, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatList({ chats, activeRoomId, onSelectChat, onCloseChat, onNewChat, savedContacts }) {
    const getUnreadCount = (chat) => {
        return chat.messages.filter(m => !m.read && m.sender !== chat.myPin).length;
    };

    const getLastMessage = (chat) => {
        if (chat.messages.length === 0) return 'Sin mensajes';
        const last = chat.messages[chat.messages.length - 1];
        return last.text.substring(0, 30) + (last.text.length > 30 ? '...' : '');
    };

    const getSavedContactName = (pin) => {
        const contact = savedContacts.find(c => c.pin === pin);
        return contact ? contact.name : null;
    };

    return (
        <div className="w-80 bg-slate-900/50 border-r border-slate-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-lg font-bold text-white mb-3">Conversaciones</h2>
                <button
                    onClick={onNewChat}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <MessageCircle size={18} />
                    Nuevo Chat
                </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No hay conversaciones activas</p>
                        <p className="text-xs mt-1">Inicia un nuevo chat</p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const unread = getUnreadCount(chat);
                        const isActive = chat.roomId === activeRoomId;
                        const contactName = getSavedContactName(chat.withPin);

                        return (
                            <motion.div
                                key={chat.roomId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 border-b border-slate-700/50 cursor-pointer transition-colors relative group ${isActive ? 'bg-emerald-900/20 border-l-4 border-l-emerald-500' : 'hover:bg-slate-800/50'
                                    }`}
                                onClick={() => onSelectChat(chat.roomId)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {contactName && (
                                                <Shield size={14} className="text-emerald-400 flex-shrink-0" />
                                            )}
                                            <span className="font-medium text-white truncate">
                                                {contactName || `PIN: ${chat.withPin}`}
                                            </span>
                                        </div>
                                        {!contactName && (
                                            <div className="text-xs text-slate-500 font-mono mb-1">{chat.withPin}</div>
                                        )}
                                        <p className="text-sm text-slate-400 truncate">{getLastMessage(chat)}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-2">
                                        {unread > 0 && (
                                            <span className="bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {unread}
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCloseChat(chat.roomId);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-400 rounded transition-all"
                                            title="Cerrar chat"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
