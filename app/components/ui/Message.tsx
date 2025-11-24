"use client";
import React from 'react';

interface MessageProps {
  text: string;
  isSender: boolean;
  author: string; // Prop añadida
}

const Message: React.FC<MessageProps> = ({ text, isSender, author }) => {
  const messageClass = isSender
    ? 'bg-blue-500 text-white'
    : 'bg-gray-300 text-black';
  const alignmentClass = isSender ? 'items-end' : 'items-start';

  return (
    <div className={`flex flex-col min-w-0 ${alignmentClass}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-1">
        {author}
      </p>
      <div
        className={`rounded-2xl px-3 py-2 max-w-[75%] ${messageClass} break-words whitespace-pre-wrap`}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
