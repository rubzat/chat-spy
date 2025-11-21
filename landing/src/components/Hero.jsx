import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Hero = ({ t }) => {
    return (
        <section className="hero section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
                            <Shield size={16} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t.badge}</span>
                        </div>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        {t.titleLine1} <br />
                        <span className="gradient-text">{t.titleLine2}</span>
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        {t.description}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                            {t.ctaPrimary}
                        </button>
                        <button style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)', padding: '1rem 2.5rem', borderRadius: '9999px', fontSize: '1.125rem', fontWeight: '600' }}>
                            {t.ctaSecondary}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1, pointerEvents: 'none' }} />
        </section>
    );
};

export default Hero;
