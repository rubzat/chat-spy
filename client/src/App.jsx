import React, { useState } from 'react';
import LandingPage from './LandingPage';
import ChatApp from './ChatApp';

function App() {
    // const [showApp, setShowApp] = useState(false);

    // if (!showApp) {
    //     return <LandingPage onStart={() => setShowApp(true)} />;
    // }

    return <ChatApp />;
}

export default App;
