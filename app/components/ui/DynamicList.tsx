// app/components/ui/DynamicList.tsx
"use client";
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ListItem {
  id: string | number;
  name: string;
}

interface DynamicListProps {
  title: string;
  items: ListItem[];
  onItemClick: (id: string | number) => void;
  onBack?: () => void;
  selectedId?: string | number | null;
  titleClassName?: string; // Prop añadida
}

const DynamicList: React.FC<DynamicListProps> = ({ title, items, onItemClick, onBack, selectedId, titleClassName }) => {
  return (
    <div className="h-full w-full border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
      {/* Se aplica la clase aquí */}
      <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${titleClassName || ''}`}>
        {onBack && (
          <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronLeft size={20} />
          </button>
        )}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800 ${
              item.id === selectedId ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <p className="font-medium truncate">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicList;