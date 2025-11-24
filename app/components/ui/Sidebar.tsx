"use client";
import React from 'react';
import { MessageSquare, Bot, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import type { User as UserType } from '../../lib/types';

interface SidebarProps {
  onSelectView: (view: 'channels' | 'bots') => void;
  activeView: 'channels' | 'bots' | null;
  currentUser: UserType | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectView, activeView, currentUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  const buttonClasses = "p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700";
  const activeButtonClasses = "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div className="flex flex-col w-20 h-screen items-center py-4 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      
      
      
      {/* Iconos de Navegación */}
      <div className="flex flex-col items-center gap-4 pt-4"> 
        <button 
          title="Canales"
          onClick={() => onSelectView('channels')}
          className={`${buttonClasses} ${activeView === 'channels' ? activeButtonClasses : ''}`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        <button 
          title="Bots"
          onClick={() => onSelectView('bots')}
          className={`${buttonClasses} ${activeView === 'bots' ? activeButtonClasses : ''}`}
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1"></div>

      {/* Perfil y Logout */}
      <div className="flex flex-col items-center gap-4 p-2">
        <Link href="/profile" title="Mi Perfil">
          <button className={buttonClasses}>
            <User className="w-6 h-6" />
          </button>
        </Link>
        
        <button onClick={handleLogout} title="Cerrar Sesión" className={buttonClasses}>
          <LogOut className="w-6 h-6 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
