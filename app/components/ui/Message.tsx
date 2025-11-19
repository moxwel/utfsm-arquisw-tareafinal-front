import React from 'react';

interface MessageProps {
  text: string;
  isSender: boolean;
  avatarUrl?: string;
}

const Message: React.FC<MessageProps> = ({ text, isSender, avatarUrl }) => {
  const messageClass = isSender
    ? 'bg-blue-500 text-white self-end'
    : 'bg-gray-300 text-black self-start';
  const alignmentClass = isSender ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${alignmentClass} items-end gap-2 min-w-0`}>
      {!isSender && avatarUrl ? (
        <img src={avatarUrl} alt="sender avatar" className="w-8 h-8 rounded-full shrink-0" />
      ) : null}
      <div
        className={`rounded-2xl px-3 py-2 max-w-[75%] ${messageClass} break-words whitespace-pre-wrap overflow-x-hidden`}
      >
        {text}
      </div>
      {isSender && avatarUrl ? (
        <img src={avatarUrl} alt="your avatar" className="w-8 h-8 rounded-full shrink-0" />
      ) : null}
    </div>
  );
};

export default Message;
