"use client";

import React, { useState, useEffect } from 'react';
import { channels, bots, currentUser, seedMessages } from '../data';
import type { Channel, Bot, Message } from '../lib/types';
import Sidebar from '../components/ui/Sidebar';
import DynamicList from '../components/ui/DynamicList';
import ChatWindow from '../components/ui/ChatWindow';

export default function ChatPage() {
  const [activeView, setActiveView] = useState<'channels' | 'bots' | null>('channels');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(seedMessages);

  const selectedChannel = channels.find(c => c.id.toString() === selectedChannelId);

  const handleSend = (text: string) => {
    const activeChatId = selectedThreadId || selectedBotId;
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSender: true,
      author: currentUser.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage],
    }));
  };

  const getListProps = () => {
    if (activeView === 'bots') {
      return {
        title: 'Bots',
        items: bots,
        onItemClick: (id: string | number) => {
          setSelectedBotId(id as string);
          setSelectedThreadId(null);
        },
        selectedId: selectedBotId,
        titleClassName: 'bg-purple-500 text-white',
      };
    }

    if (selectedChannel) {
      return {
        title: selectedChannel.name,
        items: selectedChannel.threads,
        onItemClick: (id: string | number) => {
          setSelectedThreadId(id as string);
          setSelectedBotId(null);
        },
        selectedId: selectedThreadId,
        onBack: () => setSelectedChannelId(null),
        titleClassName: 'bg-blue-500 text-white',
      };
    }

    return {
      title: 'Canales',
      items: channels,
      onItemClick: (id: string | number) => {
        setSelectedChannelId(id.toString());
      },
      selectedId: selectedChannelId,
      titleClassName: 'bg-green-500 text-white',
    };
  };

  const listProps = getListProps();
  const activeChatId = selectedThreadId || selectedBotId;
  const chatMessages = (activeChatId ? messages[activeChatId] : []) || [];

  const getChatName = () => {
    if (selectedThreadId) {
      for (const channel of channels) {
        const thread = channel.threads.find(t => t.id === selectedThreadId);
        if (thread) return `# ${thread.name}`;
      }
    }
    if (selectedBotId) {
      const bot = bots.find(b => b.id === selectedBotId);
      if (bot) return bot.name;
    }
    return "Chat"; // Un nombre por defecto
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar onSelectView={setActiveView} activeView={activeView} />
      <div className="w-1/3 min-w-0 min-h-0 h-full overflow-hidden">
        <DynamicList {...listProps} />
      </div>
      {activeChatId ? (
        <div className="flex-1 min-w-0 flex">
          <ChatWindow
            key={activeChatId}
            chatName={getChatName()}
            messages={chatMessages}
            onClose={() => {
              setSelectedThreadId(null);
              setSelectedBotId(null);
            }}
            onSend={handleSend}
          />
        </div>
      ) : (
        <div className="flex-1 min-w-0 flex items-center justify-center text-gray-500">
          Selecciona un hilo o un bot para empezar a chatear
        </div>
      )}
    </div>
  );
}
