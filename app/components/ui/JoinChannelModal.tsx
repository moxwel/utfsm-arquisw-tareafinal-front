"use client";

import { useState } from 'react';
import { joinChannel } from '../../lib/api';
import type { User } from '../../lib/types';

interface JoinChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onChannelJoined: () => void;
}

const JoinChannelModal: React.FC<JoinChannelModalProps> = ({ isOpen, onClose, currentUser, onChannelJoined }) => {
  const [channelId, setChannelId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId.trim() || !currentUser) {
      setError('El ID del canal no puede estar vacío.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await joinChannel({ channel_id: channelId, user_id: currentUser.id });
      onChannelJoined();
      setChannelId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al unirse al canal. Verifica el ID.');
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unirse a un Canal por ID</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="channelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID del Canal
            </label>
            <input
              id="channelId"
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="Pega el ID del canal aquí"
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
              {isLoading ? 'Uniéndose...' : 'Unirse al Canal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinChannelModal;