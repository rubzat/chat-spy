import React from 'react';

const Footer = ({ t }) => {
    return (
        <footer style={{ padding: '4rem 0', borderTop: '1px solid #222' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Chat Spy</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>© {new Date().getFullYear()} Chat Spy. {t.rights}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-secondary)' }}>
                    {t.links.map((link, index) => (
                        <a key={index} href="#" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>{link}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
