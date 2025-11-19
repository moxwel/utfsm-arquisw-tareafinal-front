// app/lib/api.ts
import { channels, bots, currentUser } from '../data';
import type { Channel, Bot, User } from './types';

// Simula un retardo de red
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * API MOCK - Canales
 * Esta función simula la obtención de todos los canales.
 * EL EQUIPO DE BACKEND deberá reemplazar esto con una llamada fetch a la API real.
 * Ejemplo:
 * 
 * export const getChannels = async (): Promise<Channel[]> => {
 *   const response = await fetch('https://your-api.com/channels');
 *   if (!response.ok) {
 *     throw new Error('Failed to fetch channels');
 *   }
 *   return response.json();
 * };
 */
export const getChannels = async (): Promise<Channel[]> => {
  console.log("API MOCK: Obteniendo canales...");
  await sleep(500); // Simular carga
  return Promise.resolve(channels);
};

/**
 * API MOCK - Bots
 * Esta función simula la obtención de todos los bots.
 * EL EQUIPO DE BACKEND deberá reemplazar esto con una llamada fetch a la API real.
 */
export const getBots = async (): Promise<Bot[]> => {
  console.log("API MOCK: Obteniendo bots...");
  await sleep(500);
  return Promise.resolve(bots);
};

/**
 * API MOCK - Usuario Actual
 * Esta función simula la obtención del usuario que ha iniciado sesión.
 * EL EQUIPO DE BACKEND deberá reemplazar esto con la lógica de autenticación real.
 */
export const getCurrentUser = async (): Promise<User> => {
    console.log("API MOCK: Obteniendo usuario actual...");
    await sleep(100);
    return Promise.resolve(currentUser);
};

/**
 * API MOCK - Enviar Mensaje
 * Esta función simula el envío de un mensaje.
 * EL EQUIPO DE BACKEND deberá reemplazar esto con una llamada fetch a la API real.
 * Debería devolver el mensaje guardado o una confirmación.
 */
export const sendMessage = async (conversationId: string, text: string): Promise<any> => {
    console.log(`API MOCK: Enviando mensaje "${text}" a la conversación ${conversationId}`);
    await sleep(300);
    // En una API real, aquí harías un POST y la API se encargaría de la persistencia.
    // El frontend NO debería mutar los datos directamente.
    return Promise.resolve({ success: true });
}
