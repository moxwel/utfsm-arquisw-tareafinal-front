// app/lib/api.ts
import type { User, Message, Channel, ChannelDetail, RegisterUserData, LoginUserData, LoginResponse, UpdateUserData, Thread, CreateChannelData, CreateThreadData, ProgrammingBotMessage, ProgrammingBotReply, WikipediaBotMessage, WikipediaBotReply } from './types';


// Simula un retardo de red
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


//USUARIOS
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

      const errorData = await response.json();

      let errorMessage = `Error ${response.status}`;


      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((d: any) => d.msg || 'Error de validación').join(', ');
      }

      else if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      }

      throw new Error(errorMessage);
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



//CANALES
/**
 * Obtener Canales de un Usuario
 * Obtiene todos los canales en los que un usuario es miembro.
 */
export const getChannelsForUser = async (userId: string): Promise<Channel[]> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/canales/members/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
    console.error("Error en getChannelsForUser:", error);
    throw error;
  }
};

/**
 * Obtener Detalles de un Canal por ID
 * Obtiene la información detallada de un canal específico.
 */
export const getChannelById = async (channelId: string): Promise<ChannelDetail> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/canales/${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
    console.error(`Error en getChannelById para el canal ${channelId}:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo Canal
 * Realiza una petición POST para crear un nuevo canal.
 */
export const createChannel = async (channelData: CreateChannelData): Promise<ChannelDetail> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/canales/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(channelData),
    });

    if (!response.ok && response.status !== 201) {
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((d: any) => d.msg).join(', ')
        : errorData.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error en createChannel:", error);
    throw error;
  }
};

//HILOS
/**
 * Crear un nuevo Hilo
 * Realiza una petición POST para crear un nuevo hilo en un canal.
 */
export const createThread = async (threadData: CreateThreadData): Promise<Thread> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/hilos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(threadData),
    });

    if (!response.ok && response.status !== 201) {
      const errorData = await response.json();
      const errorMessage = Array.isArray(errorData.detail)
        ? errorData.detail.map((d: any) => d.msg).join(', ')
        : errorData.detail || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Error en createThread:", error);
    throw error;
  }
};

/**
 * Obtener Hilos para un Canal
 * Obtiene todos los hilos que pertenecen a un canal específico.
 */
export const getThreadsForChannel = async (channelId: string): Promise<Thread[]> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_GATEWAY_URL no está definida.");
  }

  if (!token) {
    throw new Error("No se encontró token de acceso. Se requiere iniciar sesión.");
  }

  try {

    const response = await fetch(`${API_GATEWAY_URL}/api/v1/hilos/?channel_id=${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
    console.error(`Error en getThreadsForChannel para el canal ${channelId}:`, error);
    throw error;
  }
};



// CHATBOT DE PROGRAMACIÓN
/**
 * API REAL - Enviar un mensaje al bot de programación y obtener una respuesta.
 */
export const sendToProgrammingBot = async (messageData: ProgrammingBotMessage): Promise<ProgrammingBotReply> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) throw new Error("URL de API no definida.");
  if (!token) throw new Error("Token de acceso no encontrado.");

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/chatbot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || `Error ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error en sendToProgrammingBot:", error);
    throw error;
  }
};

// CHATBOT DE WIKIPEDIA
/**
 * Enviar un mensaje al bot de Wikipedia y obtener una respuesta.
 */
export const sendToWikipediaBot = async (messageData: WikipediaBotMessage): Promise<WikipediaBotReply> => {
  const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
  const token = localStorage.getItem('access_token');

  if (!API_GATEWAY_URL) throw new Error("URL de API no definida.");
  if (!token) throw new Error("Token de acceso no encontrado.");

  try {
    const response = await fetch(`${API_GATEWAY_URL}/api/v1/wikipedia/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || `Error ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error en sendToWikipediaBot:", error);
    throw error;
  }
};
