import React, { useState } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations } from './translations';

function App() {
  const [lang, setLang] = useState('es');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'es' : 'en');
  };

  const t = translations[lang];

  return (
    <div className="app">
      <LanguageSwitcher currentLang={lang} toggleLang={toggleLang} />
      <Hero t={t.hero} />
      <HowItWorks t={t.howItWorks} />
      <Features t={t.features} />
      <Footer t={t.footer} />
    </div>
  );
}

export default App;
