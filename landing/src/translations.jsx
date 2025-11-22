import { Clock, Lock, EyeOff, ShieldCheck } from 'lucide-react';
import React from 'react';

export const translations = {
    en: {
        hero: {
            badge: "Secure & Anonymous",
            titleLine1: "Chat Freely.",
            titleLine2: "Disappear Completely.",
            description: "The ultimate secret chat app. Messages vanish after 1 minute. No logs, no traces, just pure privacy.",
            ctaPrimary: "Get the App",
            ctaSecondary: "Learn More"
        },
        features: {
            title: "Why Choose",
            subtitle: "Built for those who value their digital privacy above all else.",
            items: [
                {
                    title: 'Self-Destructing Messages',
                    description: 'Every message automatically disappears after exactly 60 seconds. No history, no screenshots, no evidence.'
                },
                {
                    title: 'Simple PIN System',
                    description: 'Get a unique 6-digit PIN when you open the app. Share it with friends to connect instantly - no signup required.'
                },
                {
                    title: 'Zero Data Storage',
                    description: 'We don\'t store messages, metadata, IP addresses, or any personal information. Your privacy is absolute.'
                },
                {
                    title: 'Multiple Conversations',
                    description: 'Chat with multiple people at once. Each conversation is separate and secure with its own unique connection.'
                },
                {
                    title: 'Easy Sharing',
                    description: 'Share your PIN via WhatsApp, copy to clipboard, or send a direct link. Connecting with friends has never been easier.'
                },
                {
                    title: 'Contact Management',
                    description: 'Save your favorite contacts for quick access. No need to ask for PINs repeatedly - just tap and connect.'
                },
                {
                    title: 'Accept or Decline',
                    description: 'You control who you chat with. Accept or reject incoming chat requests before they can message you.'
                },
                {
                    title: 'Mobile Optimized',
                    description: 'Works perfectly on any device - phone, tablet, or desktop. Responsive design that adapts to your screen.'
                },
                {
                    title: 'Instant Connection',
                    description: 'Click a shared link and connect immediately. Deep linking makes starting conversations effortless.'
                },
                {
                    title: 'Clear Anytime',
                    description: 'Want a fresh start? Clear all messages in a conversation with one tap. Both sides get a clean slate.'
                },
                {
                    title: 'Real-Time Chat',
                    description: 'Messages appear instantly with WebSocket technology. No delays, no refresh needed - just smooth conversation.'
                },
                {
                    title: 'No Registration',
                    description: 'No email, no phone number, no personal details. Open the app and start chatting in seconds.'
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            links: ["Privacy Policy", "Terms of Service", "Contact"]
        },
        howItWorks: {
            title: "How It Works",
            subtitle: "Connect instantly with total privacy in 3 simple steps.",
            steps: [
                {
                    title: "Get Your PIN",
                    description: "Open the app and instantly receive your unique 6-digit PIN. No signup, no forms, no hassle."
                },
                {
                    title: "Share or Connect",
                    description: "Share your PIN via WhatsApp, link, or copy-paste. Or enter a friend's PIN to request a chat connection."
                },
                {
                    title: "Chat Securely",
                    description: "Once connected, send messages freely. They automatically vanish after 60 seconds - no trace left behind."
                }
            ]
        }
    },
    es: {
        hero: {
            badge: "Seguro y Anónimo",
            titleLine1: "Chatea Libremente.",
            titleLine2: "Desaparece Completamente.",
            description: "La aplicación de chat secreto definitiva. Los mensajes desaparecen después de 1 minuto. Sin registros, sin rastros, solo privacidad pura.",
            ctaPrimary: "Obtener la App",
            ctaSecondary: "Más Información"
        },
        features: {
            title: "¿Por qué elegir",
            subtitle: "Creado para quienes valoran su privacidad digital por encima de todo.",
            items: [
                {
                    title: 'Mensajes que se Autodestruyen',
                    description: 'Cada mensaje desaparece automáticamente después de exactamente 60 segundos. Sin historial, sin capturas, sin evidencia.'
                },
                {
                    title: 'Sistema Simple de PIN',
                    description: 'Recibe un PIN único de 6 dígitos al abrir la app. Compártelo con amigos para conectar al instante - sin registro necesario.'
                },
                {
                    title: 'Cero Almacenamiento de Datos',
                    description: 'No guardamos mensajes, metadatos, direcciones IP ni información personal. Tu privacidad es absoluta.'
                },
                {
                    title: 'Múltiples Conversaciones',
                    description: 'Chatea con varias personas a la vez. Cada conversación es separada y segura con su propia conexión única.'
                },
                {
                    title: 'Compartir Fácilmente',
                    description: 'Comparte tu PIN por WhatsApp, copia al portapapeles o envía un enlace directo. Conectar con amigos nunca fue tan fácil.'
                },
                {
                    title: 'Gestión de Contactos',
                    description: 'Guarda tus contactos favoritos para acceso rápido. No necesitas pedir PINs repetidamente - solo toca y conecta.'
                },
                {
                    title: 'Aceptar o Rechazar',
                    description: 'Tú controlas con quién chateas. Acepta o rechaza solicitudes de chat entrantes antes de que puedan enviarte mensajes.'
                },
                {
                    title: 'Optimizado para Móviles',
                    description: 'Funciona perfectamente en cualquier dispositivo - teléfono, tablet o computadora. Diseño responsivo que se adapta a tu pantalla.'
                },
                {
                    title: 'Conexión Instantánea',
                    description: 'Haz clic en un enlace compartido y conéctate inmediatamente. Los enlaces directos hacen que iniciar conversaciones sea muy fácil.'
                },
                {
                    title: 'Borrar en Cualquier Momento',
                    description: '¿Quieres empezar de nuevo? Borra todos los mensajes de una conversación con un toque. Ambos lados obtienen un inicio limpio.'
                },
                {
                    title: 'Chat en Tiempo Real',
                    description: 'Los mensajes aparecen instantáneamente con tecnología WebSocket. Sin demoras, sin necesidad de actualizar - solo conversación fluida.'
                },
                {
                    title: 'Sin Registro',
                    description: 'Sin correo, sin número de teléfono, sin datos personales. Abre la app y empieza a chatear en segundos.'
                }
            ]
        },
        footer: {
            rights: "Todos los derechos reservados.",
            links: ["Política de Privacidad", "Términos de Servicio", "Contacto"]
        },
        howItWorks: {
            title: "Cómo Funciona",
            subtitle: "Conéctate al instante con total privacidad en 3 simples pasos.",
            steps: [
                {
                    title: "Obtén tu PIN",
                    description: "Abre la app y recibe instantáneamente tu PIN único de 6 dígitos. Sin registro, sin formularios, sin complicaciones."
                },
                {
                    title: "Comparte o Conecta",
                    description: "Comparte tu PIN por WhatsApp, enlace o copia-pega. O ingresa el PIN de un amigo para solicitar una conexión de chat."
                },
                {
                    title: "Chatea Seguro",
                    description: "Una vez conectado, envía mensajes libremente. Desaparecen automáticamente después de 60 segundos - sin dejar rastro."
                }
            ]
        }
    }
};
