import React from 'react';
import { motion } from 'framer-motion';
import { Hash, UserPlus, MessageSquare } from 'lucide-react';

const iconMap = [
    <Hash size={32} />,
    <UserPlus size={32} />,
    <MessageSquare size={32} />
];

const HowItWorks = ({ t }) => {
    return (
        <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{t.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{t.subtitle}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    {t.steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                                background: 'var(--bg-secondary)',
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: '1px solid #222',
                                flexDirection: index % 2 !== 0 ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '1.5rem',
                                borderRadius: '50%',
                                color: 'var(--accent-primary)',
                                flexShrink: 0
                            }}>
                                {iconMap[index]}
                            </div>
                            <div style={{ textAlign: index % 2 !== 0 ? 'right' : 'left' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--accent-secondary)', marginRight: '0.5rem' }}>0{index + 1}.</span>
                                    {step.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
