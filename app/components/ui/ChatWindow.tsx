"use client";
import React, { useEffect, useState, useRef } from 'react';
import Message from './Message';
import type { Message as MessageType } from '../../lib/types';

interface ChatWindowProps {
  chatName: string; // Prop para el nombre del chat
  messages: MessageType[];
  onClose?: () => void;
  onSend?: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatName, messages, onClose, onSend }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cierra el chat al presionar la tecla "Escape"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && onSend) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-black">
      {/* Cabecera del Chat */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex-1 truncate">{chatName}</h2>
      </div>

      {/* Cuerpo de Mensajes */}
      <div className="flex-1 p-4 space-y-4 overflow-x-hidden overflow-y-auto min-w-0 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="min-w-0">
            <Message
              text={msg.text}
              isSender={msg.isSender}
              author={msg.author} // Se pasa el autor
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Entrada de Texto */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent focus:outline-none"
          />
          <button onClick={handleSend} className="ml-2 text-blue-500 hover:text-blue-600 disabled:opacity-50" disabled={!inputText.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;