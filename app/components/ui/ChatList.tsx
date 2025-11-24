import React from 'react';

interface Chat {
  id: number;
  contact: string;
  avatar: string;
}

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: number) => void;
  messagesMap?: Record<number, { id: number; text: string; isSender: boolean }[]>;
  selectedChatId?: number | null;
}

// Safely get last message for a chat
const getLastMessage = (
  chatId: number,
  map: Record<number, { id: number; text: string; isSender: boolean }[]>
): { text: string; isSender: boolean } | null => {
  const list = map[chatId] ?? [];
  if (!list.length) return null;
  const last = list[list.length - 1];
  return { text: last.text, isSender: !!last.isSender };
};

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, messagesMap = {}, selectedChatId = null }) => {
  return (
    <div className="h-full w-full border-r border-gray-200 dark:border-gray-700 overflow-hidden min-w-0 flex flex-col min-h-0">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 min-w-0 ${
              chat.id === selectedChatId ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <img className="w-10 h-10 rounded-full" src={chat.avatar} alt={chat.contact} />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{chat.contact}</p>
              {(() => {
                const last = getLastMessage(chat.id, messagesMap);
                const prefix = last?.isSender ? 'Tú: ' : '';
                const text = last?.text ?? '';
                return (
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap min-w-0"
                    title={`${prefix}${text}`}
                  >
                    {prefix}
                    {text}
                  </p>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
