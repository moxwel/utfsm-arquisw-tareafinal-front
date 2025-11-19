import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../../lib/types';

interface ChatWindowProps {
  chatName: string;
  messages: (Message & { avatarUrl?: string })[];
  onClose: () => void;
  userAvatar: string;
  contactAvatar?: string;
  onSend: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatName,
  messages,
  onClose,
  userAvatar,
  contactAvatar,
  onSend,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
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
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        {contactAvatar && <img src={contactAvatar} alt={chatName} className="w-8 h-8 rounded-full mr-3" />}
        <h2 className="text-lg font-semibold flex-1">{chatName}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 my-4 ${msg.isSender ? 'flex-row-reverse' : ''}`}>
            <img src={msg.avatarUrl} alt={msg.author} className="w-8 h-8 rounded-full" />
            <div className={`p-3 rounded-lg max-w-md ${msg.isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {!msg.isSender && <p className="font-semibold text-sm mb-1">{msg.author}</p>}
              <p>{msg.text}</p>
              <p className="text-xs mt-1 opacity-70 text-right">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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