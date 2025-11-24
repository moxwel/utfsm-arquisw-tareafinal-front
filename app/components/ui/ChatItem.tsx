import React from 'react';
import Avatar from './Avatar';

interface ChatItemProps {
  contact: string;
  message: string;
  avatar: string;
  isSender: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ contact, message, avatar, isSender, onClick }) => {
  return (
    <div className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" onClick={onClick}>
      <Avatar src={avatar} alt={contact} />
      <div className="ml-4">
        <h3 className="font-semibold text-black dark:text-white">{contact}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSender && 'Tú: '}{message}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
