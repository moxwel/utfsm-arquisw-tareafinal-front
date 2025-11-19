import type { User, Bot, Channel, Message } from './lib/types';

export const currentUser: User = {
  id: 'user-1',
  name: 'CrissFLl',
  avatarUrl: 'https://i.pravatar.cc/150?u=crissfll',
};

export const bots: Bot[] = [
  { id: 'bot-1', name: 'Ayudante Académico', avatarUrl: 'https://i.pravatar.cc/150?u=bot1' },
  { id: 'bot-2', name: 'Consejero Estudiantil', avatarUrl: 'https://i.pravatar.cc/150?u=bot2' },
  { id: 'bot-3', name: 'Bot de Noticias de la Carrera con un nombre extremadamente largo para probar el truncado de texto', avatarUrl: 'https://i.pravatar.cc/150?u=bot3' },
];

const generateChannels = (): Channel[] => {
  const channels: Channel[] = [
    {
      id: 'channel-1',
      name: 'General',
      threads: [
        { id: 'thread-1-1', name: 'Presentaciones' },
        { id: 'thread-1-2', name: 'Anuncios Importantes' },
      ],
    },
    {
      id: 'channel-2',
      name: 'Cursos',
      threads: [
        { id: 'thread-2-1', name: 'Cálculo I' },
        { id: 'thread-2-2', name: 'Programación Avanzada' },
        { id: 'thread-2-3', name: 'Bases de Datos' },
      ],
    },
    {
      id: 'channel-3',
      name: 'Proyectos',
      threads: [
        { id: 'thread-3-1', name: 'Ideas de Proyecto de Título' },
        { id: 'thread-3-2', name: 'Busco equipo' },
      ],
    },
    {
      id: 'channel-4',
      name: 'Canal de Discusión General sobre Proyectos de Arquitectura de Software y Patrones de Diseño Avanzados',
      threads: [
        { id: 'thread-4-1', name: 'Análisis Comparativo de Microservicios vs. Arquitecturas Monolíticas en Aplicaciones de Alto Tráfico y Escalabilidad Horizontal' },
        { id: 'thread-4-2', name: 'Hilo para pruebas de estrés con muchos mensajes' },
      ],
    },
  ];

  // Generar 50 canales adicionales para prueba de volumen
  for (let i = 5; i <= 54; i++) {
    const threads = [];
    // Generar 20 hilos por canal
    for (let j = 1; j <= 20; j++) {
      threads.push({
        id: `thread-${i}-${j}`,
        name: `Hilo de prueba número ${j} del canal ${i} con un nombre bastante largo para ver cómo se ajusta`,
      });
    }
    channels.push({
      id: `channel-${i}`,
      name: `Canal de Prueba Extenso N° ${i}`,
      threads: threads,
    });
  }

  return channels;
};

export const channels: Channel[] = generateChannels();

const generateMessages = (): Record<string, Message[]> => {
  const messages: Record<string, Message[]> = {
    'thread-1-1': [
      { id: 'message-1', text: '¡Hola a todos! Soy nuevo aquí.', isSender: false, author: 'Juan Perez', timestamp: '10:00 AM' },
      { id: 'message-2', text: '¡Bienvenido, Juan!', isSender: true, author: currentUser.name, timestamp: '10:01 AM' },
    ],
    'bot-1': [
      { id: 'message-3', text: 'Hola, soy el Ayudante Académico. ¿En qué puedo ayudarte?', isSender: false, author: 'Ayudante Académico', timestamp: '11:30 AM' },
    ],
  };

  // Generar 100 mensajes para el hilo de prueba de estrés
  const stressTestMessages: Message[] = [];
  const longMessage = "Este es un mensaje excepcionalmente largo diseñado para probar cómo se comporta la interfaz de usuario con grandes bloques de texto. El objetivo es verificar que el texto se ajuste correctamente dentro de su contenedor, que no desborde los límites del diseño y que la experiencia de lectura sea aceptable incluso en pantallas más pequeñas. Además, este tipo de mensajes ayuda a evaluar el rendimiento del renderizado cuando se combinan con una gran cantidad de otros mensajes en la misma vista. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  for (let i = 0; i < 100; i++) {
    const isSender = i % 3 === 0;
    stressTestMessages.push({
      id: `message-${100 + i}`,
      text: i === 50 ? longMessage : `Este es el mensaje número ${i + 1} en la prueba de estrés.`,
      isSender: isSender,
      author: isSender ? currentUser.name : `Usuario ${i % 5}`,
      timestamp: `12:${i < 10 ? '0' : ''}${i} PM`,
    });
  }
  messages['thread-4-2'] = stressTestMessages;

  return messages;
};

export const seedMessages: Record<string, Message[]> = generateMessages();