"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getCurrentUser, getChannelsForUser, getThreadsForChannel, createChannel, createThread,
  sendToProgrammingBot, sendToWikipediaBot, leaveChannel, getChannelMembers
} from '../lib/api';
import ChannelMembersModal from '../components/ui/ChannelMembersModal';
import JoinChannelModal from '../components/ui/JoinChannelModal';
import Sidebar from '../components/ui/Sidebar';
import DynamicList from '../components/ui/DynamicList';
import ChatWindow from '../components/ui/ChatWindow';
import CreateChannelModal from '../components/ui/CreateChannelModal';
import CreateThreadModal from '../components/ui/CreateThreadModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import type { User, Message, Channel, Thread, ChannelMember } from '../lib/types';

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
  const [isJoinChannelModalOpen, setIsJoinChannelModalOpen] = useState(false);
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([]);

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

  // --- FUNCIÓN MODIFICADA ---
  const handleChannelCreated = async () => {
    if (!currentUser) return;
    try {
      // Vuelve a solicitar la lista completa de canales del usuario
      const updatedChannels = await getChannelsForUser(currentUser.id);
      // Actualiza el estado con la lista fresca del servidor
      setChannels(updatedChannels);
    } catch (error) {
      console.error("Error al recargar los canales después de la creación:", error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  };

  
  const handleChannelJoined = async () => {
    if (!currentUser) return;
    try {
      const updatedChannels = await getChannelsForUser(currentUser.id);
      setChannels(updatedChannels);
    } catch (error) {
      console.error("Error al recargar los canales después de unirse:", error);
    }
  };

  
  const handleThreadCreated = async () => {
    if (!selectedChannelId) return;
    try {
      // Vuelve a solicitar la lista completa de hilos para el canal actual
      const updatedThreads = await getThreadsForChannel(selectedChannelId);
      setThreads(updatedThreads);
    } catch (error) {
      console.error("Error al recargar los hilos después de la creación:", error);
    }
  };

  const handleLeaveChannelConfirm = async () => {
    if (!selectedChannelId || !currentUser) return;

    setIsLeaveLoading(true);
    try {
      await leaveChannel({ channel_id: selectedChannelId, user_id: currentUser.id });
      // Refrescar la lista de canales
      const updatedChannels = await getChannelsForUser(currentUser.id);
      setChannels(updatedChannels);
      // Limpiar selección
      setSelectedChannelId(null);
      setSelectedThreadId(null);
    } catch (error) {
      console.error("Error al salir del canal:", error);
      // Aquí podrías mostrar un toast o alerta de error
    } finally {
      setIsLeaveLoading(false);
      setIsLeaveModalOpen(false);
    }
  };

  // --- FUNCIÓN CORREGIDA Y SIMPLIFICADA ---
  const handleShowMembers = async () => {
    if (!selectedChannelId) return;

    setIsMembersModalOpen(true);
    setIsMembersLoading(true);
    setChannelMembers([]);

    try {
      // Solo se necesita una llamada a la API
      const members = await getChannelMembers(selectedChannelId);
      setChannelMembers(members);
    } catch (error) {
      console.error("Error al cargar los miembros del canal:", error);
    } finally {
      setIsMembersLoading(false);
    }
  };

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
        // --- LÍNEA CORREGIDA ---
        items: threads.map(t => ({ id: t.thread_id, name: t.title })),
        onItemClick: (id: string | number) => setSelectedThreadId(id as string),
        selectedId: selectedThreadId,
        onBack: () => setSelectedChannelId(null),
        isLoading: isListLoading,
        onAdd: () => setIsCreateThreadModalOpen(true),
        onShowMembers: handleShowMembers, // <-- Pasar la nueva función
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
    if (selectedThreadId) return `# ${threads.find(t => t.thread_id === selectedThreadId)?.title || 'Hilo'}`;
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
      <CreateChannelModal 
        isOpen={isCreateChannelModalOpen} 
        onClose={() => setIsCreateChannelModalOpen(false)} 
        currentUser={currentUser} 
        onChannelCreated={handleChannelCreated}
        onSwitchToJoin={() => { // <-- NUEVA PROP
          setIsCreateChannelModalOpen(false);
          setIsJoinChannelModalOpen(true);
        }}
      />
      <JoinChannelModal // <-- NUEVO COMPONENTE
        isOpen={isJoinChannelModalOpen}
        onClose={() => setIsJoinChannelModalOpen(false)}
        currentUser={currentUser}
        onChannelJoined={handleChannelJoined}
      />
      <ConfirmationModal // <-- AÑADIR EL NUEVO MODAL
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveChannelConfirm}
        title="Salir del Canal"
        message="¿Estás seguro de que quieres salir de este canal? Esta acción no se puede deshacer."
        confirmButtonText="Sí, Salir"
        isLoading={isLeaveLoading}
      />
      <ChannelMembersModal // <-- AÑADIR EL NUEVO MODAL
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={channelMembers}
        isLoading={isMembersLoading}
      />
      <CreateThreadModal 
        isOpen={isCreateThreadModalOpen} 
        onClose={() => setIsCreateThreadModalOpen(false)} 
        currentUser={currentUser} 
        channelId={selectedChannelId} 
        onThreadCreated={handleThreadCreated}
        onLeaveChannel={() => {
          setIsCreateThreadModalOpen(false);
          setIsLeaveModalOpen(true);
        }}
      />
    </div>
  );
}
