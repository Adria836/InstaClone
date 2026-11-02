import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import type { NotificationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Query likes on user's posts
        const { data: likesData } = await supabase
          .from('likes')
          .select(`
            id,
            created_at,
            user_id,
            post_id,
            profiles:user_id (id, username, full_name, avatar_url),
            posts:post_id (id, image_url, user_id)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (likesData) {
          const mapped: NotificationItem[] = likesData
            .filter((l: any) => l.profiles && l.user_id !== user.id)
            .map((l: any) => ({
              id: l.id,
              type: 'like',
              fromUser: {
                id: l.profiles.id,
                username: l.profiles.username,
                fullName: l.profiles.full_name || l.profiles.username,
                avatarUrl: l.profiles.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                followersCount: 0,
                followingCount: 0,
              },
              post: l.posts ? { id: l.posts.id, imageUrl: l.posts.image_url } : undefined,
              createdAt: new Date(l.created_at).toLocaleDateString('pt-BR'),
            }));

          setNotifications(mapped);
        }
      } catch (err) {
        console.error('Error fetching notifications from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 md:left-20 top-0 bottom-0 w-full md:w-[380px] bg-white dark:bg-black border-r border-[#dbdbdb] dark:border-[#262626] z-40 shadow-xl flex flex-col animate-fade-in">
      <div className="p-6 border-b border-[#efefef] dark:border-[#262626] flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notificações</h2>
        <button onClick={onClose} className="text-[#737373] hover:text-black dark:hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <span className="text-xs font-bold text-[#737373] uppercase tracking-wider block px-2">
          Atividades Recentes
        </span>

        {isLoading ? (
          <div className="text-center py-10 text-xs text-[#737373]">Carregando notificações...</div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center justify-between p-2 hover:bg-[#efefef] dark:hover:bg-[#1a1a1a] rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <img
                  src={notif.fromUser.avatarUrl}
                  alt={notif.fromUser.username}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="text-xs text-left leading-snug">
                  <span className="font-semibold">{notif.fromUser.username}</span>{' '}
                  curtiu sua publicação.{' '}
                  <span className="text-[#737373] text-[11px] block mt-0.5">{notif.createdAt}</span>
                </div>
              </div>

              {notif.post && (
                <img
                  src={notif.post.imageUrl}
                  alt="Post preview"
                  className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-[#dbdbdb] dark:border-[#333]"
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 space-y-2 text-[#737373]">
            <Heart className="w-10 h-10 mx-auto stroke-[1.5] text-neutral-400" />
            <p className="text-sm font-semibold">Nenhuma notificação recente</p>
            <p className="text-xs">Quando outros usuários curtirem ou comentarem nas suas fotos, aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};
