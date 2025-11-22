"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Opcional: Si el usuario ya tiene un token, redirigirlo directamente al chat.
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Bienvenido a la App de Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Conéctate con tus canales y equipos.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-6 py-3 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-6 py-3 font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-indigo-300 dark:bg-indigo-900 dark:hover:bg-indigo-800"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}
