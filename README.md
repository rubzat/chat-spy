# Chat Spy 🕵️

Una aplicación de mensajería efímera y anónima donde los mensajes desaparecen después de 1 minuto.

## 🌟 Características

- 💬 Mensajes que se autodestruyen en 60 segundos
- 🔐 Sistema de conexión basado en PIN
- 🚫 Sin logs ni historial
- 🔒 Comunicación en tiempo real con WebSockets
- 🌍 Interfaz bilingüe (Inglés/Español)

## 📁 Estructura del Proyecto

```
chat_spy/
├── landing/     # Landing page (React + Vite)
├── client/      # Aplicación cliente (React + Vite + Socket.io)
├── server/      # Servidor WebSocket (Node.js + Express + Socket.io)
└── DEPLOYMENT.md # Guía completa de deployment
```

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Instalar dependencias**
```bash
# Server
cd server && npm install

# Client
cd client && npm install

# Landing
cd landing && npm install
```

2. **Ejecutar en desarrollo**
```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev

# Terminal 3 - Landing (opcional)
cd landing && npm run dev
```

3. **Acceder a la aplicación**
- Client: http://localhost:5173
- Landing: http://localhost:5174
- Server: http://localhost:3001

## 🌐 Deployment

Ver la guía completa en [DEPLOYMENT.md](./DEPLOYMENT.md)

### Resumen rápido:
1. **Server** → Render.com (gratis)
2. **Client** → Vercel (gratis)
3. **Landing** → Vercel (gratis)

### Script de ayuda:
```bash
./deploy.sh
```

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- Socket.io Client
- Framer Motion
- Lucide Icons
- TailwindCSS

### Backend
- Node.js
- Express
- Socket.io
- UUID

## 📝 Variables de Entorno

### Client
```env
VITE_SERVER_URL=https://your-server.onrender.com
```

### Server
```env
PORT=3001
CORS_ORIGIN=https://your-client.vercel.app,https://your-landing.vercel.app
NODE_ENV=production
```

## 🔧 Scripts Disponibles

### Server
- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar con nodemon

### Client / Landing
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## 📖 Cómo Funciona

1. **Obtén tu PIN**: Al conectarte, recibes un PIN único de 6 dígitos
2. **Conecta**: Comparte tu PIN o ingresa el PIN de un amigo
3. **Chatea**: Los mensajes desaparecen automáticamente después de 1 minuto
4. **Privacidad**: Sin logs, sin historial, sin rastros

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un issue con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots (si aplica)

## 💡 Roadmap

- [ ] Notificaciones push
- [ ] Compartir archivos/imágenes
- [ ] Temas personalizables
- [ ] Modo oscuro/claro
- [ ] Aplicación móvil nativa

---

Hecho con ❤️ para la privacidad digital
