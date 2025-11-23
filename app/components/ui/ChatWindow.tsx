"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Message as MessageType } from '../../lib/types';
import Avatar from './Avatar';
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
  chatName: string;
  messages: MessageType[];
  onClose?: () => void;
  onSend?: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatName, messages, onClose, onSend }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendClick = () => {
    if (inputText.trim() && onSend) {
      onSend(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClose]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-black">
      {/* Cabecera del Chat */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-bold text-lg">{chatName}</h2>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {/* --- AÑADIR LA CLASE AQUÍ --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className={`flex flex-col ${message.isSender ? 'items-end' : 'items-start'}`}>
            {/* Muestra el nombre del autor siempre */}
            <div className={`text-xs text-gray-500 dark:text-gray-400 mb-1 ${message.isSender ? 'mr-2' : 'ml-2'}`}>
              {message.author}
            </div>
            <div className={`flex items-end gap-2 w-full ${message.isSender ? 'justify-end' : 'justify-start'}`}>
              {!message.isSender && !message.isBot && <Avatar src="/placeholder-user.jpg" alt="Avatar" />}
              {message.isBot && <div className="w-8 h-8 flex-shrink-0"></div>}
              <div
                className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-lg shadow ${
                  message.isSender
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                <div className="text-xs text-right mt-1 opacity-70">{message.timestamp}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Entrada de Texto */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default ChatWindow;