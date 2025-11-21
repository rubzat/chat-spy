import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock } from 'lucide-react';

export default function ChatRoom({ socket, pin, role }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('new_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('message_expired', (messageId) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        });

        return () => {
            socket.off('new_message');
            socket.off('message_expired');
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        socket.emit('send_message', newMessage);
        setNewMessage('');
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Spy Chat <span style={{ opacity: 0.5 }}>#{pin}</span></h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                    <Clock size={16} />
                    <span>1m auto-delete</span>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg) => {
                    const isMe = msg.senderId === socket.id;
                    return (
                        <div
                            key={msg.id}
                            className={`message-bubble ${isMe ? 'message-sent' : 'message-received'}`}
                        >
                            {msg.content}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    autoFocus
                />
                <button type="submit" className="btn" style={{ width: 'auto', padding: '12px' }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
