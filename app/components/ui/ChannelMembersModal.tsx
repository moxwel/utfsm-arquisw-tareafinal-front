"use client";

import type { ChannelMember } from '../../lib/types'; // <-- 

interface ChannelMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ChannelMember[];
  isLoading: boolean;
}

const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({ isOpen, onClose, members, isLoading }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm h-96 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Miembros del Canal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Cargando miembros...</div>
          ) : (
            <ul className="space-y-3">
              {members.map(member => (
                <li key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{member.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelMembersModal;