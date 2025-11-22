import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, EyeOff, ShieldCheck, Users, Share2, UserCheck, Smartphone, Link, Trash2, Zap, UserX } from 'lucide-react';

const iconMap = [
    <Clock size={32} />,           // Self-Destructing Messages
    <ShieldCheck size={32} />,     // Simple PIN System
    <EyeOff size={32} />,          // Zero Data Storage
    <Users size={32} />,           // Multiple Conversations
    <Share2 size={32} />,          // Easy Sharing
    <UserCheck size={32} />,       // Contact Management
    <UserCheck size={32} />,       // Accept or Decline
    <Smartphone size={32} />,      // Mobile Optimized
    <Link size={32} />,            // Instant Connection
    <Trash2 size={32} />,          // Clear Anytime
    <Zap size={32} />,             // Real-Time Chat
    <UserX size={32} />            // No Registration
];

const Features = ({ t }) => {
    return (
        <section id="features" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{t.title} <span className="gradient-text">Chat Spy</span>?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{t.subtitle}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {t.items.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{ background: 'var(--bg-primary)', padding: '1.75rem', borderRadius: '1rem', border: '1px solid #222' }}
                        >
                            <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                                {iconMap[index]}
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
