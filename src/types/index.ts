export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  website?: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount?: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  caption: string;
  imageUrl: string;
  filter?: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  likesCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  viewed?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow';
  fromUser: User;
  post?: {
    id: string;
    imageUrl: string;
  };
  text?: string;
  createdAt: string;
  isFollowing?: boolean;
}

export type ActiveTab = 'home' | 'search' | 'explore' | 'reels' | 'messages' | 'notifications' | 'create' | 'profile';
