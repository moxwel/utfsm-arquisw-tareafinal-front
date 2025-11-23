"use client";
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

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
  selectedId?: string | number | null;
  isLoading?: boolean;
}

const DynamicList: React.FC<DynamicListProps> = ({ title, items, onItemClick, onBack, onAdd, selectedId, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
        {onBack ? (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9 h-9"></div> 
        )}
        <h2 className="font-bold text-lg text-center">{title}</h2>
        
        {onAdd ? (
          <button onClick={onAdd} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9 h-9"></div>
        )}
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