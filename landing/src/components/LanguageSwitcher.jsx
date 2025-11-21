import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ currentLang, toggleLang }) => {
    return (
        <button
            onClick={toggleLang}
            style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
            <Globe size={18} />
            <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{currentLang}</span>
        </button>
    );
};

export default LanguageSwitcher;
