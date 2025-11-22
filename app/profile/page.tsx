"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateUser } from '../lib/api';
import type { User } from '../lib/types';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setFullName(currentUser.full_name || '');
        } else {
          // Si no hay usuario, redirigir al login
          router.push('/login');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del usuario.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await updateUser({ full_name: fullName });
      setUser(updatedUser);
      setSuccessMessage('¡Nombre actualizado con éxito!');
    } catch (err: any) {
      setError(err.message || 'No se pudo actualizar el nombre.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Cargando perfil...</div>;
  }

  if (!user) {
    return null; // O un mensaje de error, aunque ya se redirige
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mi Perfil
            </h1>
            <Link href="/chat" className="text-sm text-indigo-500 hover:underline">
                &larr; Volver al Chat
            </Link>
        </div>
        
        <div className="space-y-2">
            <p><strong className="text-gray-500 dark:text-gray-400">Email:</strong> <span className="text-gray-800 dark:text-gray-200">{user.email}</span></p>
            <p><strong className="text-gray-500 dark:text-gray-400">Username:</strong> <span className="text-gray-800 dark:text-gray-200">{user.username}</span></p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre Completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {successMessage && <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>}

          <div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}