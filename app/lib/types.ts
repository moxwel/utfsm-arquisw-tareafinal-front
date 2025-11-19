// app/lib/types.ts

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isSender: boolean;
  authorAvatarUrl?: string;
}

export interface Thread {
  id: string;
  name: string;
  messages: Message[];
}

export interface Channel {
  id: string;
  name: string;
  threads: { id: string; name: string }[];
}

export interface Bot {
  id: string;
  name: string;
  avatarUrl: string;
}
