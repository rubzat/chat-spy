import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';

const Hero = ({ t }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate particles only on client side
        const newParticles = [...Array(20)].map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            color: i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'
        }));
        setParticles(newParticles);
    }, []);
    return (
        <section className="hero section-padding" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Logo with floating animation */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
                    >
                        <img
                            src="/chatspy-logo.png"
                            alt="ChatSpy Logo"
                            style={{
                                width: '120px',
                                height: '120px',
                                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.6))',
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
                    >
                        <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem 1rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <Sparkles size={16} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t.badge}</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}
                    >
                        {t.titleLine1} <br />
                        <span className="gradient-text">{t.titleLine2}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}
                    >
                        {t.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <a href="https://chat-spy-xmh4.vercel.app/" target="_blank" rel="noopener noreferrer">
                            <button className="btn-primary btn-pulse" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                                {t.ctaPrimary}
                            </button>
                        </a>
                        <a href="#features" style={{ textDecoration: 'none' }}>
                            <button className="btn-secondary" style={{ background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)', padding: '1rem 2.5rem', borderRadius: '9999px', fontSize: '1.125rem', fontWeight: '600', transition: 'all 0.3s ease' }}>
                                {t.ctaSecondary}
                            </button>
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Animated Background Particles */}
            <div className="particles">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        initial={{
                            x: `${particle.x}vw`,
                            y: `${particle.y}vh`,
                            opacity: 0
                        }}
                        animate={{
                            y: [`${particle.y}vh`, `${particle.y - 10}vh`],
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: particle.color,
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            zIndex: -1
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Background Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(0,0,0,0) 70%)',
                    zIndex: -2,
                    pointerEvents: 'none'
                }}
            />
        </section>
    );
};

export default Hero;
