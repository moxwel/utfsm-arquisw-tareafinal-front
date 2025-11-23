// app/lib/api.ts
import { channels, bots, currentUser } from '../data';
import type { Channel, Bot, User, RegisterUserData, LoginUserData, LoginResponse, UpdateUserData } from './types';


// Simula un retardo de red
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Registrar Usuario
 */
export const registerUser = async (userData: RegisterUserData): Promise<User> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL?.replace(/\/$/, "");

  // console log que indica a qué URL se está conectando
  console.log("Conectando a:", API_GATEWAY_URL);

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/usuarios/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {

      const errorText = await response.text();
      console.error("Respuesta de error no-JSON del servidor:", errorText);
      try {

        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      } catch (e) {

        throw new Error(`El servidor respondió con un error ${response.status} no esperado. Revisa la consola del navegador para ver la respuesta completa.`);
      }
    }

    return response.json();
  } catch (error) {
    console.error("Error en registerUser:", error);
    throw error;
  }
};

/**
 * Iniciar Sesion
 */
export const loginUser = async (loginData: LoginUserData): Promise<LoginResponse> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // manejo de errores
      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((d: any) => d.msg).join(', ')
        : errorData.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};

/**
 * Obtener Usuario Actual
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    console.log("No se encontró token de acceso. El usuario no está autenticado.");
    return null; // Sin token
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/usuarios/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Si el token es inválido o expiró, el servidor podría devolver 401 o 403
      if (response.status === 401 || response.status === 403) {
        console.error("Token inválido o expirado. Se requiere iniciar sesión de nuevo.");
        // Se borra el token para evitar bucles de error
        localStorage.removeItem('access_token');
        return null;
      }
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((d: any) => d.msg).join(', ')
        : errorData.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error en getCurrentUser:", error);
    throw error;
  }
};

/**
 * Actualizar Usuario Actual
 */
export const updateUser = async (userData: UpdateUserData): Promise<User> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/usuarios/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token');
        throw new Error("Token inválido o expirado. Por favor, inicie sesión de nuevo.");
      }
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((d: any) => d.msg).join(', ')
        : errorData.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};
