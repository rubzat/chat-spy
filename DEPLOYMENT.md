# 🚀 Chat Spy - Deployment Guide

Este proyecto consta de 3 partes que se deben deployar por separado:

## 📦 Estructura del Proyecto

```
chat_spy/
├── landing/     → Landing page (Vercel)
├── client/      → Aplicación cliente (Vercel)
└── server/      → Servidor WebSocket (Render)
```

---

## 1️⃣ Deploy del Server (Render.com)

### Paso 1: Crear cuenta en Render
1. Ve a [render.com](https://render.com) y crea una cuenta
2. Conecta tu cuenta de GitHub

### Paso 2: Crear Web Service
1. Click en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `chat-spy-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Paso 3: Variables de Entorno
En la sección "Environment", agrega:
- `NODE_ENV` = `production`

### Paso 4: Deploy
1. Click en "Create Web Service"
2. **GUARDA LA URL** que te da Render (ej: `https://chat-spy-server.onrender.com`)

---

## 2️⃣ Deploy del Client (Vercel)

### Paso 1: Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Conecta tu cuenta de GitHub

### Paso 2: Importar Proyecto
1. Click en "Add New..." → "Project"
2. Selecciona tu repositorio
3. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 3: Variables de Entorno
En "Environment Variables", agrega:
- **Key**: `VITE_SERVER_URL`
- **Value**: La URL de tu server de Render (del paso 1)
- Ejemplo: `https://chat-spy-server.onrender.com`

### Paso 4: Deploy
1. Click en "Deploy"
2. **GUARDA LA URL** del cliente (ej: `https://chat-spy-client.vercel.app`)

---

## 3️⃣ Deploy del Landing (Vercel)

### Paso 1: Crear Nuevo Proyecto
1. En Vercel, click en "Add New..." → "Project"
2. Selecciona el MISMO repositorio
3. Configuración:
   - **Framework Preset**: Vite
   - **Root Directory**: `landing`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Paso 2: Deploy
1. Click en "Deploy"
2. Tu landing estará disponible en una URL como `https://chat-spy-landing.vercel.app`

---

## 4️⃣ Actualizar CORS en el Server

Después de deployar el client, necesitas actualizar el servidor:

1. Ve a tu Web Service en Render
2. En "Environment", agrega:
   - **Key**: `CORS_ORIGIN`
   - **Value**: Las URLs de tu client y landing separadas por coma
   - Ejemplo: `https://chat-spy-client.vercel.app,https://chat-spy-landing.vercel.app`

3. El servidor se redesplegará automáticamente

---

## ✅ Verificación

1. **Server**: Visita `https://tu-server.onrender.com` - deberías ver "Cannot GET /"
2. **Client**: Visita tu URL de Vercel - la app debería cargar
3. **Landing**: Visita tu URL de landing - debería mostrar la página

---

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
# Server
cd server && npm run dev

# Client  
cd client && npm run dev

# Landing
cd landing && npm run dev
```

### Build Local (para probar)
```bash
# Client
cd client && npm run build && npm run preview

# Landing
cd landing && npm run build && npm run preview
```

---

## 🐛 Troubleshooting

### El client no se conecta al server
- Verifica que `VITE_SERVER_URL` esté correctamente configurado en Vercel
- Asegúrate de que la URL del server NO tenga `/` al final
- Revisa los logs del server en Render

### CORS errors
- Verifica que `CORS_ORIGIN` en Render incluya las URLs correctas de Vercel
- Las URLs deben ser exactas (con https://)

### El server se "duerme" (plan gratis de Render)
- Es normal en el plan gratis
- El primer request después de 15 min de inactividad tardará ~30 segundos
- Considera upgradar a un plan de pago si necesitas uptime 24/7

---

## 📝 Notas Importantes

1. **Render Free Tier**: El servidor se dormirá después de 15 minutos de inactividad
2. **Vercel**: Deployments automáticos cuando haces push a GitHub
3. **Variables de Entorno**: Recuerda actualizar `VITE_SERVER_URL` si cambias la URL del server
4. **HTTPS**: Todas las plataformas proveen SSL gratis automáticamente

---

## 🔄 Re-deployment

### Vercel (Client/Landing)
- Automático con cada push a GitHub
- O manualmente desde el dashboard de Vercel

### Render (Server)
- Automático con cada push a GitHub
- O manualmente desde el dashboard de Render
