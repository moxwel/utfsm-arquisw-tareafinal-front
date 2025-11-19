"use client";

import React, { useState, useMemo } from 'react';
import ChatWindow from '../components/ui/ChatWindow';
import { channels, threadsByChannel, bots, messages as messagesData, currentUser } from '../data';
import type { Message } from '../lib/types';

// Componente simple para la barra lateral
const Sidebar = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div className="w-64 min-w-64 h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
    <h1 className="text-xl font-bold mb-4">UTFSM Chat</h1>
    
    <h2 className="font-semibold mt-4 mb-2 text-gray-500 dark:text-gray-400 uppercase text-sm">Canales</h2>
    {channels.map(channel => (
      <div key={channel.id}>
        <p className="font-medium text-gray-800 dark:text-gray-200">{channel.name}</p>
        <div className="pl-4">
          {threadsByChannel[channel.id]?.map(thread => (
            <button key={thread.id} onClick={() => onSelect(thread.id)} className="block text-left w-full text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1 truncate">
              # {thread.name}
            </button>
          ))}
        </div>
      </div>
    ))}

    <h2 className="font-semibold mt-6 mb-2 text-gray-500 dark:text-gray-400 uppercase text-sm">Bots</h2>
    {bots.map(bot => (
       <button key={bot.id} onClick={() => onSelect(bot.id)} className="flex items-center gap-2 w-full text-left text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white py-1 truncate">
          <img src={bot.avatarUrl} alt={bot.name} className="w-5 h-5 rounded-full" />
          {bot.name}
        </button>
    ))}
  </div>
);

export default function ChatPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeChat = useMemo(() => {
    if (!activeId) return null;

    const allThreads = Object.values(threadsByChannel).flat();
    const thread = allThreads.find(t => t.id === activeId);
    if (thread) {
      return { type: 'thread', ...thread, avatar: undefined };
    }

    const bot = bots.find(b => b.id === activeId);
    if (bot) {
      return { type: 'bot', ...bot };
    }
    
    return null;
  }, [activeId]);

  const activeMessages = useMemo(() => {
    if (!activeId) return [];
    const rawMessages = messagesData[activeId as keyof typeof messagesData] || [];
    return rawMessages.map((msg, index) => ({
      id: `${activeId}-${index}`,
      ...msg,
      isSender: msg.author === 'Tú',
      avatarUrl: msg.author === 'Tú' ? currentUser.avatarUrl : msg.authorAvatarUrl,
    })) as (Message & { avatarUrl?: string })[];
  }, [activeId]);

  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <Sidebar onSelect={setActiveId} />
      <main className="flex-1 flex min-w-0">
        {activeChat ? (
          <ChatWindow
            key={activeId}
            chatName={activeChat.name}
            messages={activeMessages}
            onClose={() => setActiveId(null)}
            userAvatar={currentUser.avatarUrl}
            contactAvatar={activeChat.avatar}
            onSend={(text) => {
              console.log(`Sending to ${activeId}: ${text}`);
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona un canal o bot para empezar a chatear
          </div>
        )}
      </main>
    </div>
  );
}
