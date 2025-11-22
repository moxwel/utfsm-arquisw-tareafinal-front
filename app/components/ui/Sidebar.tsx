"use client";
import React from 'react';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import type { User as UserType } from '../../lib/types';

interface SidebarProps {
  currentUser: UserType | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  // se usa como placeholder el primer caracter del username
  const userInitial = currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col w-20 h-screen items-center py-4 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Placeholder para el logo de la app */}
      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-8">
        C
      </div>
      
      
      <div className="flex-1"></div>

      {/* Footer con información del usuario */}
      <div className="p-2">
        <div className="flex flex-col items-center gap-4">
          <Link href="/profile" title="Mi Perfil">
            {/* Placeholder del avatar*/}
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl font-bold" title={currentUser?.full_name || 'Usuario'}>
              {userInitial}
            </div>
          </Link>
          
          <button onClick={handleLogout} title="Cerrar Sesión" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <LogOut className="w-6 h-6 text-red-500 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
