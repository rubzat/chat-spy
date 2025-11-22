import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import ChatApp from './ChatApp';

function App() {
    // const [showApp, setShowApp] = useState(false);

    // if (!showApp) {
    //     return <LandingPage onStart={() => setShowApp(true)} />;
    // }

    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Disable common screenshot keyboard shortcuts
        const handleKeyDown = (e) => {
            // Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5 (Mac)
            // Print Screen, Alt+Print Screen (Windows)
            if (
                (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
                e.key === 'PrintScreen'
            ) {
                e.preventDefault();
                alert('⚠️ Screenshots están deshabilitados por seguridad');
                return false;
            }

            // Disable DevTools shortcuts
            if (
                (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) || // Cmd+Option+I
                (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) || // Ctrl+Shift+I
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return <ChatApp />;
}

export default App;
