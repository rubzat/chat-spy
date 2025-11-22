# 🛡️ Screenshot Prevention Guide

## ⚠️ Importante: Limitaciones

**No es posible bloquear completamente screenshots en aplicaciones web.** Los usuarios siempre pueden:
- Usar herramientas del sistema operativo
- Tomar fotos con otro dispositivo
- Usar software de terceros

## ✅ Medidas Implementadas

He agregado las siguientes protecciones al client:

### 1. **CSS Security**
- ❌ Selección de texto deshabilitada (`user-select: none`)
- ❌ Click derecho deshabilitado
- 🔴 Watermark invisible en screenshots (patrón diagonal)

### 2. **JavaScript Protection**
- ❌ Menú contextual (click derecho) bloqueado
- ❌ Atajos de teclado de screenshot bloqueados:
  - `Cmd+Shift+3/4/5` (Mac)
  - `Print Screen` (Windows)
- ❌ DevTools shortcuts bloqueados (`F12`, `Cmd+Option+I`)
- ⚠️ Alerta cuando se intenta screenshot

### 3. **Visual Deterrent**
- Patrón de watermark sutil que aparece en screenshots
- Hace que las capturas sean menos útiles

## 🎯 Recomendaciones Adicionales

### Para Máxima Seguridad:

1. **App Nativa Móvil** (Futuro)
   - Android: `FLAG_SECURE` bloquea screenshots completamente
   - iOS: Puede detectar y oscurecer pantalla

2. **Mensajes Más Efímeros**
   - Ya tienes 1 minuto, considera reducir a 30 segundos

3. **Advertencias al Usuario**
   - Mostrar mensaje: "No tomes screenshots de conversaciones privadas"

4. **Detección de Screen Recording** (Avanzado)
   - Detectar cambios en `document.visibilityState`
   - Detectar extensiones de grabación de pantalla

## 📱 Mejor Solución: App Nativa

Si la privacidad es crítica, considera:
- **React Native** o **Flutter** para apps móviles
- Pueden bloquear screenshots a nivel del sistema operativo
- Mucho más seguro que web

## 🔍 Verificar

Para probar las protecciones:
1. Intenta click derecho → Bloqueado
2. Intenta `Cmd+Shift+3` → Alerta
3. Toma screenshot con herramienta externa → Verás patrón watermark sutil

---

**Nota:** Estas son medidas de disuasión, no de prevención absoluta. Para privacidad real, educa a los usuarios sobre no compartir pantallas.
