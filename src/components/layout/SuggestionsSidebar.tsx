import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { ActiveTab, User } from '../../types';
import { supabase } from '../../lib/supabase';

interface SuggestionsSidebarProps {
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: () => void;
}

export const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({
  setActiveTab,
  openAuthModal,
}) => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;

    const fetchSuggestions = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(5);

        if (!error && data) {
          const mapped: User[] = data.map((p) => ({
            id: p.id,
            username: p.username,
            fullName: p.full_name || p.username,
            avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            bio: p.bio,
            isVerified: p.is_verified,
            followersCount: p.followers_count || 0,
            followingCount: p.following_count || 0,
          }));
          setSuggestedUsers(mapped);
        }
      } catch (err) {
        console.error('Error fetching suggested users:', err);
      }
    };

    fetchSuggestions();
  }, [user]);

  const toggleFollow = async (targetId: string) => {
    if (!user) return;

    const willFollow = !followingMap[targetId];
    setFollowingMap((prev) => ({
      ...prev,
      [targetId]: willFollow,
    }));

    try {
      if (willFollow) {
        await supabase.from('follows').insert({
          follower_id: user.id,
          following_id: targetId,
        });
      } else {
        await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId);
      }
    } catch (err) {
      console.error('Error toggling follow in Supabase:', err);
    }
  };

  return (
    <div className="hidden lg:block w-[320px] xl:w-[380px] pl-8 pt-8">
      {/* Current User Row */}
      <div className="flex items-center justify-between mb-6">
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.username}
            className="w-11 h-11 rounded-full object-cover border border-[#dbdbdb] dark:border-[#262626]"
          />
          <div className="text-left">
            <span className="block text-sm font-semibold text-[#262626] dark:text-[#f5f5f5] group-hover:underline">
              {user?.username}
            </span>
            <span className="block text-xs text-[#737373] truncate max-w-[170px]">
              {user?.fullName}
            </span>
          </div>
        </div>

        <button
          onClick={openAuthModal}
          className="text-xs font-semibold text-[#0095f6] hover:text-rose-500 transition-colors"
          title="Desconectar e voltar para o login"
        >
          Desconectar
        </button>
      </div>

      {/* Suggestions Section Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#737373]">
          Sugestões para você
        </span>
        <button className="text-xs font-semibold text-[#262626] dark:text-neutral-300 hover:text-[#737373]">
          Ver tudo
        </button>
      </div>

      {/* Suggested Users List from Supabase */}
      <div className="space-y-3.5 mb-8">
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((sUser) => {
            const isFollowing = !!followingMap[sUser.id];

            return (
              <div key={sUser.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={sUser.avatarUrl}
                    alt={sUser.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] hover:underline cursor-pointer">
                        {sUser.username}
                      </span>
                      {sUser.isVerified && (
                        <span className="text-[#0095f6] text-[11px]">●</span>
                      )}
                    </div>
                    <span className="block text-[11px] text-[#737373]">
                      Usuário do Supabase
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(sUser.id)}
                  className={`text-xs font-semibold transition-colors ${
                    isFollowing
                      ? 'text-[#262626] dark:text-[#f5f5f5] hover:text-[#737373]'
                      : 'text-[#0095f6] hover:text-[#00376b] dark:hover:text-sky-400'
                  }`}
                >
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-[#737373] py-2">
            Nenhum outro perfil registrado no Supabase ainda.
          </div>
        )}
      </div>

      {/* Instagram Footer Links */}
      <footer className="text-[11px] text-[#c7c7c7] dark:text-[#555] space-y-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">Sobre</a> •
          <a href="#" className="hover:underline">Ajuda</a> •
          <a href="#" className="hover:underline">Imprensa</a> •
          <a href="#" className="hover:underline">API</a> •
          <a href="#" className="hover:underline">Carreiras</a> •
          <a href="#" className="hover:underline">Privacidade</a> •
          <a href="#" className="hover:underline">Termos</a> •
          <a href="#" className="hover:underline">Localizações</a> •
          <a href="#" className="hover:underline">Idioma</a> •
          <a href="#" className="hover:underline">Meta Verified</a>
        </div>
        <p className="font-semibold uppercase tracking-wider text-[10px]">
          © 2026 INSTAGRAM FROM META
        </p>
      </footer>
    </div>
  );
};
