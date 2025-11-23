"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getCurrentUser, getChannelsForUser, getThreadsForChannel, createChannel, createThread,
  sendToProgrammingBot,
  sendToWikipediaBot
} from '../lib/api';
import type { User, Message, Channel, Thread } from '../lib/types';
import Sidebar from '../components/ui/Sidebar';
import DynamicList from '../components/ui/DynamicList';
import ChatWindow from '../components/ui/ChatWindow';
import CreateChannelModal from '../components/ui/CreateChannelModal';
import CreateThreadModal from '../components/ui/CreateThreadModal';

const PROGRAMMING_BOT_ID = '2';
const WIKIPEDIA_BOT_ID = '3';

const availableBots = [
  { id: PROGRAMMING_BOT_ID, name: 'Bot de Programación' },
  { id: WIKIPEDIA_BOT_ID, name: 'Bot de Wikipedia' },
];

export default function ChatPage() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);

  const [activeView, setActiveView] = useState<'channels' | 'bots'>('channels');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("No user");
        setCurrentUser(user);
        const userChannels = await getChannelsForUser(user.id);
        setChannels(userChannels);
      } catch (error) {
        router.push('/login');
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleChannelSelect = async (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedThreadId(null);
    setIsListLoading(true);
    setThreads([]);
    try {
      const channelThreads = await getThreadsForChannel(channelId);
      setThreads(channelThreads);
    } catch (error) {
      console.error(`Error al cargar hilos:`, error);
    } finally {
      setIsListLoading(false);
    }
  };

  const handleBotSelect = async (botId: string) => {
    setSelectedBotId(botId);
    setSelectedThreadId(null);
    setSelectedChannelId(null);

    const bot = availableBots.find(b => b.id === botId);
    if (!bot) return;

    if (messages[botId]) return;
    
    const welcomeMessage: Message = {
      id: `bot-welcome-${Date.now()}`,
      text: `Hola, soy el ${bot.name}. ¿Sobre qué quieres saber hoy?`,
      isSender: false,
      author: bot.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: true,
    };

    setMessages(prev => ({ ...prev, [botId]: [welcomeMessage] }));
  };

  const handleViewChange = (view: 'channels' | 'bots') => {
    setActiveView(view);
    setSelectedBotId(null);
    setSelectedChannelId(null);
    setSelectedThreadId(null);
  };

  const handleSend = async (text: string) => {
    const activeChatId = selectedThreadId || selectedBotId;
    if (!activeChatId || !currentUser || !text) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      isSender: true,
      author: currentUser.full_name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), userMessage] }));

    // Lógica para el Bot de Programación
    if (selectedBotId === PROGRAMMING_BOT_ID) {
      try {
        const botReply = await sendToProgrammingBot({ message: text });
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: botReply.reply,
          isSender: false,
          author: 'Bot de Programación',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };
        setMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), botMessage] }));
      } catch (error) {
        console.error("Error al contactar al bot de programación:", error);
        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          text: `Error: No se pudo obtener respuesta del bot.`,
          isSender: false,
          author: 'Sistema',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };
        setMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), errorMessage] }));
      }
    } 
    // Logica para el Bot de Wikipedia
    else if (selectedBotId === WIKIPEDIA_BOT_ID) {
      try {
        const botReply = await sendToWikipediaBot({ message: text });
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: botReply.message,
          isSender: false,
          author: 'Bot de Wikipedia',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };
        setMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), botMessage] }));
      } catch (error) {
        console.error("Error al contactar al bot de Wikipedia:", error);
        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          text: `Error: No se pudo obtener respuesta del bot.`,
          isSender: false,
          author: 'Sistema',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };
        setMessages(prev => ({ ...prev, [activeChatId]: [...(prev[activeChatId] || []), errorMessage] }));
      }
    }
  };

  const handleChannelCreated = (newChannel: Channel) => setChannels(prev => [newChannel, ...prev]);
  const handleThreadCreated = (newThread: Thread) => setThreads(prev => [newThread, ...prev]);

  const getListProps = () => {
    if (activeView === 'bots') {
      if (selectedBotId) {
        return {
          title: 'Bots',
          items: [],
          onItemClick: () => {},
          onBack: () => setSelectedBotId(null),
        };
      }
      return {
        title: 'Bots',
        items: availableBots,
        onItemClick: (id: string | number) => handleBotSelect(id as string),
        selectedId: selectedBotId,
      };
    }
    if (selectedChannelId) {
      return {
        title: channels.find(c => c.id === selectedChannelId)?.name || 'Hilos',
        items: threads.map(t => ({ ...t, name: t.title })),
        onItemClick: (id: string | number) => setSelectedThreadId(id as string),
        selectedId: selectedThreadId,
        onBack: () => setSelectedChannelId(null),
        isLoading: isListLoading,
        onAdd: () => setIsCreateThreadModalOpen(true),
      };
    }
    return {
      title: 'Canales',
      items: channels.map(c => ({ ...c, name: c.name })),
      onItemClick: (id: string | number) => handleChannelSelect(id as string),
      selectedId: selectedChannelId,
      onAdd: () => setIsCreateChannelModalOpen(true),
    };
  };

  const listProps = getListProps();
  const activeChatId = selectedThreadId || selectedBotId;
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  const getChatName = () => {
    if (selectedThreadId) return `# ${threads.find(t => t.id === selectedThreadId)?.title || 'Hilo'}`;
    if (selectedBotId) return availableBots.find(b => b.id === selectedBotId)?.name || 'Bot';
    return 'Selecciona una conversación';
  };

  if (isPageLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black">
      <Sidebar currentUser={currentUser} activeView={activeView} onSelectView={handleViewChange} />
      <div className="w-1/3 min-w-0 min-h-0 h-full overflow-hidden">
        
        <DynamicList key={listProps.title} {...listProps} />
      </div>
      {activeChatId ? (
        <div className="flex-1 min-w-0 flex">
          <ChatWindow key={activeChatId} chatName={getChatName()} messages={chatMessages} onClose={() => { setSelectedThreadId(null); setSelectedBotId(null); }} onSend={handleSend} />
        </div>
      ) : (
        <div className="flex-1 min-w-0 flex items-center justify-center text-gray-500">Selecciona una conversación</div>
      )}
      <CreateChannelModal isOpen={isCreateChannelModalOpen} onClose={() => setIsCreateChannelModalOpen(false)} currentUser={currentUser} onChannelCreated={handleChannelCreated} />
      <CreateThreadModal isOpen={isCreateThreadModalOpen} onClose={() => setIsCreateThreadModalOpen(false)} currentUser={currentUser} channelId={selectedChannelId} onThreadCreated={handleThreadCreated} />
    </div>
  );
}
