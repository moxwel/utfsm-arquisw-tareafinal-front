"use client";

import { useState } from 'react';
import { createThread } from '../../lib/api';
import type { CreateThreadData, Thread, User } from '../../lib/types';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  channelId: string | null;
  onThreadCreated: (newThread: Thread) => void;
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ isOpen, onClose, currentUser, channelId, onThreadCreated }) => {
  const [threadTitle, setThreadTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle.trim() || !currentUser || !channelId) {
      setError('El título del hilo no puede estar vacío.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const threadData: CreateThreadData = {
      title: threadTitle,
      created_by: currentUser.id,
      channel_id: channelId,
      meta: {}, 
    };

    try {
      const newThread = await createThread(threadData);
      onThreadCreated(newThread);
      setThreadTitle('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear el hilo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Crear Nuevo Hilo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="threadTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título del Hilo
            </label>
            <input
              id="threadTitle"
              type="text"
              value={threadTitle}
              onChange={(e) => setThreadTitle(e.target.value)}
              placeholder="Ej: Discusión sobre el despliegue"
              className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? 'Creando...' : 'Crear Hilo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadModal;