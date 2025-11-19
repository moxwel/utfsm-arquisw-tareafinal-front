import type { Channel, Bot, Message, User } from './lib/types';

export const channels: Omit<Channel, 'threads'>[] = [
  {
    id: 'c1',
    name: 'Anuncios Generales',
  },
  {
    id: 'c2',
    name: 'Proyectos de Taller',
  },
];

export const threadsByChannel: { [key: string]: { id: string; name: string }[] } = {
  c1: [
    { id: 't1', name: 'Próximas Pruebas' },
    { id: 't2', name: 'Eventos de la Carrera' },
  ],
  c2: [
    { id: 't3', name: 'Ayuda con el Proyecto 1' },
  ],
};

export const bots: Bot[] = [
  { id: 'b1', name: 'Bot de Notas', avatarUrl: 'https://i.pravatar.cc/150?u=bot1' },
  { id: 'b2', name: 'Bot de Horarios', avatarUrl: 'https://i.pravatar.cc/150?u=bot2' },
];

export const messages: { [key: string]: Omit<Message, 'id' | 'timestamp' | 'isSender'>[] } = {
  t1: [
    { author: 'Profesor X', text: 'Recuerden que la prueba de Cálculo es este viernes.', authorAvatarUrl: 'https://i.pravatar.cc/150?u=profesorx' },
  ],
  t2: [
    { author: 'Centro de Alumnos', text: '¡No se pierdan la feria de software el próximo mes!', authorAvatarUrl: 'https://i.pravatar.cc/150?u=ccaa' },
  ],
  t3: [
    { author: 'Compañero', text: '¿Alguien sabe cómo configurar Docker para el proyecto?', authorAvatarUrl: 'https://i.pravatar.cc/150?u=companero' },
    { author: 'Tú', text: 'Yo te puedo ayudar con eso.' },
  ],
  b1: [
    { author: 'Bot de Notas', text: 'Hola, soy el Bot de Notas. ¿En qué te puedo ayudar?', authorAvatarUrl: 'https://i.pravatar.cc/150?u=bot1' },
  ],
  b2: [
    { author: 'Bot de Horarios', text: 'Consulta aquí los horarios de tus clases.', authorAvatarUrl: 'https://i.pravatar.cc/150?u=bot2' },
  ],
};

export const currentUser: User = {
  id: 'user-123',
  name: 'Mi Usuario',
  avatarUrl: 'https://i.pravatar.cc/150?u=me',
};
