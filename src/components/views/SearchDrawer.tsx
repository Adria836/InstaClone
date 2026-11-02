import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { User } from '../../types';
import { supabase } from '../../lib/supabase';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${query.trim()}%,full_name.ilike.%${query.trim()}%`)
          .limit(10);

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
          setResults(mapped);
        }
      } catch (err) {
        console.error('Error searching profiles in Supabase:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(searchTimer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (u: User) => {
    setRecentSearches((prev) => [u, ...prev.filter((item) => item.id !== u.id)].slice(0, 5));
    onSelectUser(u);
    onClose();
  };

  return (
    <div className="fixed left-20 top-0 bottom-0 w-[380px] bg-white dark:bg-black border-r border-[#dbdbdb] dark:border-[#262626] z-30 shadow-xl flex flex-col animate-fade-in">
      <div className="p-6 border-b border-[#efefef] dark:border-[#262626]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pesquisa</h2>
          <button onClick={onClose} className="text-[#737373] hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex items-center bg-[#efefef] dark:bg-[#1a1a1a] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-[#737373] mr-2" />
          <input
            type="text"
            placeholder="Pesquisar perfis no Supabase..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#737373]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!query ? (
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-semibold">Recentes</span>
              {recentSearches.length > 0 && (
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b]"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelect(u)}
                    className="flex items-center justify-between p-2 hover:bg-[#efefef] dark:hover:bg-[#1a1a1a] rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt={u.username} className="w-11 h-11 rounded-full object-cover" />
                      <div>
                        <span className="block text-xs font-semibold">{u.username}</span>
                        <span className="block text-[11px] text-[#737373]">{u.fullName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#737373]">
                Nenhuma pesquisa recente. Digite um nome para buscar usuários.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {isSearching ? (
              <div className="text-center py-8 text-xs text-[#737373]">Buscando...</div>
            ) : results.length > 0 ? (
              results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelect(u)}
                  className="flex items-center gap-3 p-2 hover:bg-[#efefef] dark:hover:bg-[#1a1a1a] rounded-xl cursor-pointer"
                >
                  <img src={u.avatarUrl} alt={u.username} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <span className="block text-xs font-semibold">{u.username}</span>
                    <span className="block text-[11px] text-[#737373]">{u.fullName}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[#737373]">
                Nenhum usuário encontrado no Supabase.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
