import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Conversation, Message, User } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  totalUnreadCount: number;
  availableUsers: User[];
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (content: string) => Promise<void>;
  sendHeart: () => Promise<void>;
  startConversationWithUser: (user: User) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  // Load available users from Supabase
  const loadUsersAndConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setMessages([]);
      return;
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (error) {
        console.error('Error loading profiles from Supabase:', error);
        return;
      }

      if (profiles) {
        const usersList: User[] = profiles.map((p) => ({
          id: p.id,
          username: p.username,
          fullName: p.full_name || p.username,
          avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          bio: p.bio,
          isVerified: p.is_verified,
          followersCount: p.followers_count || 0,
          followingCount: p.following_count || 0,
        }));

        setAvailableUsers(usersList);

        // Build conversations list for available users
        const convs: Conversation[] = usersList.map((u) => ({
          id: 'conv_' + u.id,
          participant: u,
          lastMessage: 'Iniciar conversa...',
          lastMessageTime: '',
          unreadCount: 0,
        }));

        setConversations(convs);
        if (convs.length > 0 && !activeConversation) {
          setActiveConversation(convs[0]);
        }
      }
    } catch (err) {
      console.error('Error in loadUsersAndConversations:', err);
    }
  }, [user]);

  // Load messages for active conversation from Supabase
  const loadMessages = useCallback(async () => {
    if (!user || !activeConversation) {
      setMessages([]);
      return;
    }

    try {
      const otherId = activeConversation.participant.id;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages from Supabase:', error);
        return;
      }

      if (data) {
        const formatted: Message[] = data.map((m) => ({
          id: m.id,
          senderId: m.sender_id,
          receiverId: m.receiver_id,
          content: m.content,
          createdAt: new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isRead: m.is_read,
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error('Error in loadMessages:', err);
    }
  }, [user, activeConversation]);

  useEffect(() => {
    loadUsersAndConversations();
  }, [loadUsersAndConversations]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Realtime subscription for messages in Supabase
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as any;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === activeConversation?.participant.id) ||
            (newMsg.sender_id === activeConversation?.participant.id && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMsg.id,
                senderId: newMsg.sender_id,
                receiverId: newMsg.receiver_id,
                content: newMsg.content,
                createdAt: new Date(newMsg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation]);

  const totalUnreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversation || !user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeConversation.participant.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting message in Supabase:', error);
        return;
      }

      if (data) {
        const formattedMsg: Message = {
          id: data.id,
          senderId: data.sender_id,
          receiverId: data.receiver_id,
          content: data.content,
          createdAt: new Date(data.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, formattedMsg]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const sendHeart = async () => {
    await sendMessage('❤️');
  };

  const startConversationWithUser = (targetUser: User) => {
    const existing = conversations.find((c) => c.participant.id === targetUser.id);
    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv: Conversation = {
        id: 'conv_' + targetUser.id,
        participant: targetUser,
        lastMessage: 'Conversa iniciada',
        lastMessageTime: 'Agora',
        unreadCount: 0,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        totalUnreadCount,
        availableUsers,
        setActiveConversation,
        sendMessage,
        sendHeart,
        startConversationWithUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
