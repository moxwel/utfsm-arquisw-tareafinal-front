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
  isBot?: boolean; 
};

export type Thread = {
  thread_id: string; 
  channel_id: string;
  title: string;
  created_by: string;
  meta: object;
  created_at: string;
  updated_at: string;
};

export type Channel = {
  id: string;
  name: string;
  owner_id: string;
  channel_type: "public" | "private"; // union para seguridad
  created_at: number;
  user_count: number;
};

export type ChannelUser = {
  id: string;
  joined_at: number;
};

export type ChannelMember = {
  id: string; // ID del usuario
  joined_at: number;
};

export type ChannelDetail = {
  id: string;
  name: string;
  owner_id: string;
  users: ChannelUser[];
  is_active: boolean;
  channel_type: "public" | "private";
  created_at: number;
  updated_at: number;
  deleted_at: number;
  
  threads?: Thread[]; 
};

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

export type CreateChannelData = {
  name: string;
  owner_id: string;
  channel_type: 'public' | 'private';
};

export type JoinChannelData = {
  channel_id: string;
  user_id: string;
};

export type LeaveChannelData = {
  channel_id: string;
  user_id: string;
};

export type CreateThreadData = {
  channel_id: string;
  title: string;
  created_by: string; // Cambiado de owner_id
  meta?: object;
};

export type ProgrammingBotQuestion = {
  message: string;
  question: string;
  question_id: string;
};

export type ProgrammingBotMessage = {
  message: string;
};

export type ProgrammingBotReply = {
  reply: string;
};


export type WikipediaBotMessage = {
  message: string;
};

export type WikipediaBotReply = {
  message: string;
};
