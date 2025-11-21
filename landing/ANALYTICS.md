# Analytics Setup Guide

## Opción 1: Vercel Analytics (Recomendado) ⚡

### Instalación
```bash
cd landing
npm install @vercel/analytics
```

### Configuración
Ya está configurado en `main.jsx`. Solo necesitas:
1. Ir a Vercel Dashboard → Tu proyecto → **Analytics**
2. Click en **Enable**
3. Deploy tu código

### Ventajas
- ✅ Gratis
- ✅ Sin configuración adicional
- ✅ Privacidad-friendly
- ✅ Métricas de Web Vitals automáticas

---

## Opción 2: Google Analytics 4

### 1. Crear cuenta GA4
1. Ve a [analytics.google.com](https://analytics.google.com)
2. Crea una propiedad
3. Copia tu **Measurement ID** (formato: G-XXXXXXXXXX)

### 2. Instalar
```bash
cd landing
npm install react-ga4
```

### 3. Configurar
Crea `landing/src/analytics.js`:
```javascript
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-XXXXXXXXXX'); // Tu Measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
```

### 4. Usar en App.jsx
```javascript
import { useEffect } from 'react';
import { initGA, logPageView } from './analytics';

function App() {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);
  
  // ... resto del código
}
```

---

## Opción 3: Ambos (Recomendado para máxima información)

Puedes usar Vercel Analytics + Google Analytics simultáneamente:
- **Vercel Analytics**: Métricas técnicas y rendimiento
- **Google Analytics**: Comportamiento de usuarios y conversiones

---

## 🎯 Mi Recomendación

**Usa Vercel Analytics** porque:
1. Ya está instalado en el código
2. Solo necesitas habilitarlo en Vercel Dashboard
3. Es más simple y respeta la privacidad
4. Suficiente para empezar

Si después necesitas más datos (embudos, conversiones, etc.), agrega Google Analytics.
