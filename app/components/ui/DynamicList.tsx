"use client";
import React from 'react';
import { ArrowLeft, Plus, Users } from 'lucide-react';

interface ListItem {
  id: string | number;
  name: string;
}

interface DynamicListProps {
  title: string;
  items: ListItem[];
  onItemClick: (id: string | number) => void;
  onBack?: () => void;
  onAdd?: () => void;
  onShowMembers?: () => void;
  selectedId?: string | number | null;
  isLoading?: boolean;
}

const DynamicList: React.FC<DynamicListProps> = ({ title, items, onItemClick, onBack, onAdd, onShowMembers, selectedId, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="flex items-center w-9 h-9">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <h2 className="font-bold text-lg text-center flex-1 truncate">{title}</h2>
        
        <div className="flex items-center justify-end gap-2">
          {onShowMembers && (
            <button onClick={onShowMembers} title="Ver miembros" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <Users className="w-5 h-5" />
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Cargando...</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`px-4 py-2 cursor-pointer text-sm ${
                selectedId === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {item.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DynamicList;