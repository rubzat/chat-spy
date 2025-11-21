import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, EyeOff, ShieldCheck } from 'lucide-react';

const iconMap = [
    <Clock size={32} />,
    <Lock size={32} />,
    <EyeOff size={32} />,
    <ShieldCheck size={32} />
];

const Features = ({ t }) => {
    return (
        <section id="features" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{t.title} <span className="gradient-text">Chat Spy</span>?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{t.subtitle}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {t.items.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid #222' }}
                        >
                            <div style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                                {iconMap[index]}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
