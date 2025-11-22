# 🔗 Deep Links - Chat Spy

## ¿Qué son los Deep Links?

Los deep links te permiten compartir un enlace directo que automáticamente llena el PIN del destinatario, facilitando la conexión instantánea.

## 📱 Formatos Soportados

### 1. **Path Parameter** (Recomendado)
```
https://chat-spy-xmh4.vercel.app/123456
```

### 2. **Query Parameter**
```
https://chat-spy-xmh4.vercel.app/?pin=123456
```

## ✨ Cómo Funciona

1. **Compartir tu PIN:**
   - Click en el botón de WhatsApp (verde) o Compartir (azul)
   - Se genera automáticamente un enlace directo: `https://tu-app.com/TU_PIN`

2. **Recibir un enlace:**
   - Al abrir el enlace, el PIN se llena automáticamente
   - Solo necesitas hacer click en "INICIAR CHAT"

## 🎯 Casos de Uso

### WhatsApp
```
🕵️ Conéctate conmigo en Chat Spy!

Mi PIN: 123456

Enlace directo: https://chat-spy-xmh4.vercel.app/123456
```

### Compartir en Redes Sociales
Comparte el enlace directo y tus amigos pueden conectarse con un solo click.

### QR Code
Genera un código QR con el enlace directo para compartir en persona.

## 🔧 Implementación Técnica

### Cliente (React)
- Detecta el PIN en `window.location.pathname` o `URLSearchParams`
- Auto-llena el campo `targetPin` al cargar la app
- Validación: Solo acepta PINs de 6 dígitos

### Vercel (Routing)
```json
{
  "rewrites": [
    { "source": "/:pin(\\d{6})", "destination": "/index.html" }
  ]
}
```

## 🚀 Beneficios

- ✅ **Conexión instantánea** - Un solo click
- ✅ **Menos errores** - No hay que escribir el PIN manualmente
- ✅ **Fácil de compartir** - Por WhatsApp, SMS, email, etc.
- ✅ **Mobile-friendly** - Funciona perfecto en móviles

## 📝 Ejemplo de Uso

```javascript
// El usuario comparte:
"Chatea conmigo: https://chat-spy.vercel.app/998770"

// El destinatario:
1. Abre el enlace
2. Ve el PIN 998770 ya llenado
3. Click en "INICIAR CHAT"
4. ¡Conectados!
```
