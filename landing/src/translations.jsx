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
                    title: 'Ephemeral Messaging',
                    description: 'Every message self-destructs after exactly one minute. No history, no regrets.'
                },
                {
                    title: 'End-to-End Encryption',
                    description: 'Your conversations are encrypted from sender to receiver. Even we can\'t read them.'
                },
                {
                    title: 'No Logs Policy',
                    description: 'We don\'t store metadata, IP addresses, or message content. Your privacy is absolute.'
                },
                {
                    title: 'PIN Protection',
                    description: 'Secure your chats with a unique PIN. Only those with the code can connect with you.'
                }
            ]
        },
        footer: {
            rights: "All rights reserved.",
            links: ["Privacy Policy", "Terms of Service", "Contact"]
        },
        howItWorks: {
            title: "How It Works",
            subtitle: "Connect instantly with total privacy.",
            steps: [
                {
                    title: "Get Your PIN",
                    description: "Upon launching the app, you receive a unique, temporary PIN."
                },
                {
                    title: "Share or Connect",
                    description: "Share your PIN with a friend, or enter their PIN to initiate a connection."
                },
                {
                    title: "Start Chatting",
                    description: "Once connected, chat freely. Messages vanish after 1 minute."
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
            ctaPrimary: "Conoce tu PIN",
            ctaSecondary: "Más Información"
        },
        features: {
            title: "¿Por qué elegir",
            subtitle: "Creado para aquellos que valoran su privacidad digital por encima de todo.",
            items: [
                {
                    title: 'Mensajería Efímera',
                    description: 'Cada mensaje se autodestruye después de exactamente un minuto. Sin historial, sin arrepentimientos.'
                },
                {
                    title: 'Cifrado de Extremo a Extremo',
                    description: 'Tus conversaciones están cifradas de remitente a destinatario. Ni siquiera nosotros podemos leerlas.'
                },
                {
                    title: 'Política de No Registros',
                    description: 'No almacenamos metadatos, direcciones IP ni contenido de mensajes. Tu privacidad es absoluta.'
                },
                {
                    title: 'Protección con PIN',
                    description: 'Asegura tus chats con un PIN único. Solo aquellos con el código pueden conectarse contigo.'
                }
            ]
        },
        footer: {
            rights: "Todos los derechos reservados.",
            links: ["Política de Privacidad", "Términos de Servicio", "Contacto"]
        },
        howItWorks: {
            title: "Cómo Funciona",
            subtitle: "Conéctate al instante con total privacidad.",
            steps: [
                {
                    title: "Obtén tu PIN",
                    description: "Al iniciar la app, recibes un PIN único y temporal."
                },
                {
                    title: "Comparte o Conecta",
                    description: "Comparte tu PIN con un amigo, o ingresa el suyo para iniciar la conexión."
                },
                {
                    title: "Empieza a Chatear",
                    description: "Una vez conectado, chatea libremente. Los mensajes desaparecen tras 1 minuto."
                }
            ]
        }
    }
};
