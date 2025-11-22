// app/lib/types.ts

export type User = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
};

export type Message = {
  id: string;
  text: string;
  isSender: boolean;
  author: string;
  timestamp: string;
};

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

export type Bot = {
  id: string;
  name: string;
  avatar: string;
};

export type RegisterUserData = {
  email: string;
  username: string;
  password: string;
  full_name: string;
};

export type LoginUserData = {
  username_or_email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UpdateUserData = {
  full_name: string;
};
