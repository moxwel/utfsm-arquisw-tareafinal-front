"use client";
import React from 'react';
import { MessageSquare, Bot, UserCircle } from 'lucide-react';

interface SidebarProps {
  onSelectView: (view: 'channels' | 'bots') => void;
  activeView: 'channels' | 'bots' | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectView, activeView }) => {
  return (
    <div className="flex flex-col items-center w-20 h-screen py-4 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => onSelectView('channels')}
          className={`p-3 rounded-lg ${
            activeView === 'channels'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Canales"
        >
          <MessageSquare size={24} />
        </button>
        <button
          onClick={() => onSelectView('bots')}
          className={`p-3 rounded-lg ${
            activeView === 'bots'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          title="Bots"
        >
          <Bot size={24} />
        </button>
      </div>
      <div className="mt-auto">
        <button
          className="p-3 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Usuario"
        >
          <UserCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
