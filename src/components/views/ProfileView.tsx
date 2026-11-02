import React, { useState } from 'react';
import { 
  Settings, 
  Grid, 
  Bookmark, 
  Film, 
  UserCheck, 
  Link as LinkIcon, 
  Heart, 
  MessageCircle,
  Plus,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import type { Post } from '../../types';

interface ProfileViewProps {
  openEditModal: () => void;
  onPostClick: (post: Post) => void;
  openCreateModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  openEditModal,
  onPostClick,
  openCreateModal,
}) => {
  const { user, logout } = useAuth();
  const { posts, savedPosts } = usePosts();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');

  const userPosts = posts.filter((p) => p.userId === user?.id || p.user.username === user?.username);

  const highlights = [
    { id: 'h1', title: 'Setup 💻', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80' },
    { id: 'h2', title: 'Viagens ✈️', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80' },
    { id: 'h3', title: 'Projetos 🚀', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80' },
    { id: 'h4', title: 'Café ☕', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80' },
  ];

  const displayedPosts = activeTab === 'saved' ? savedPosts : userPosts;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
      {/* 1. Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-10">
        {/* Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full p-[3px] story-ring">
            <div className="w-full h-full bg-white dark:bg-black rounded-full p-[2px]">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={user?.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-normal text-[#262626] dark:text-[#f5f5f5]">
                {user?.username}
              </h2>
              {user?.isVerified && (
                <CheckCircle2 className="w-4 h-4 fill-[#0095f6] text-white" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openEditModal}
                className="px-4 py-1.5 bg-[#efefef] dark:bg-[#262626] hover:bg-[#dbdbdb] dark:hover:bg-[#333] text-xs font-semibold rounded-lg transition-colors text-[#262626] dark:text-[#f5f5f5]"
              >
                Editar perfil
              </button>
              <button
                onClick={openEditModal}
                className="px-4 py-1.5 bg-[#efefef] dark:bg-[#262626] hover:bg-[#dbdbdb] dark:hover:bg-[#333] text-xs font-semibold rounded-lg transition-colors text-[#262626] dark:text-[#f5f5f5]"
              >
                Ver arquivo
              </button>
              <button
                onClick={logout}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                title="Desconectar do Instagram"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
              <button
                onClick={openEditModal}
                className="p-1.5 hover:opacity-70 text-[#262626] dark:text-[#f5f5f5]"
                aria-label="Configurações"
              >
                <Settings className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center md:justify-start gap-8 text-sm">
            <div>
              <span className="font-semibold text-[#262626] dark:text-[#f5f5f5]">
                {userPosts.length}
              </span>{' '}
              <span className="text-[#737373]">publicações</span>
            </div>
            <div>
              <span className="font-semibold text-[#262626] dark:text-[#f5f5f5]">
                {user?.followersCount.toLocaleString('pt-BR')}
              </span>{' '}
              <span className="text-[#737373]">seguidores</span>
            </div>
            <div>
              <span className="font-semibold text-[#262626] dark:text-[#f5f5f5]">
                {user?.followingCount.toLocaleString('pt-BR')}
              </span>{' '}
              <span className="text-[#737373]">seguindo</span>
            </div>
          </div>

          {/* Bio & Links */}
          <div className="text-xs space-y-1">
            <span className="font-semibold block text-[#262626] dark:text-[#f5f5f5]">
              {user?.fullName}
            </span>
            <p className="whitespace-pre-line text-[#262626] dark:text-[#f5f5f5] leading-relaxed">
              {user?.bio}
            </p>
            {user?.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#00376b] dark:text-sky-400 hover:underline pt-0.5"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{user.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Story Highlights Tray */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-8 mb-4 border-b border-[#efefef] dark:border-[#262626]">
        {highlights.map((hl) => (
          <div key={hl.id} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group">
            <div className="w-16 h-16 rounded-full p-[2px] border border-[#dbdbdb] dark:border-[#333] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-black rounded-full p-[2px]">
                <img
                  src={hl.image}
                  alt={hl.title}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5]">
              {hl.title}
            </span>
          </div>
        ))}

        {/* Add Highlight Circle */}
        <div 
          onClick={openCreateModal}
          className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group"
        >
          <div className="w-16 h-16 rounded-full border border-dashed border-[#dbdbdb] dark:border-neutral-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 text-[#737373]" />
          </div>
          <span className="text-xs font-semibold text-[#737373]">Novo</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex justify-center gap-12 text-xs font-semibold tracking-wider text-[#737373] mb-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-t transition-colors ${
            activeTab === 'posts'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent hover:text-black dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>PUBLICAÇÕES</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 border-t transition-colors ${
            activeTab === 'reels'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent hover:text-black dark:hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>REELS</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 border-t transition-colors ${
            activeTab === 'saved'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent hover:text-black dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>SALVOS</span>
        </button>

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 py-3 border-t transition-colors ${
            activeTab === 'tagged'
              ? 'border-black dark:border-white text-black dark:text-white'
              : 'border-transparent hover:text-black dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>MARCADOS</span>
        </button>
      </div>

      {/* 4. Posts Grid */}
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-6">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-neutral-200 dark:bg-neutral-800"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${post.filter || ''}`}
              />

              {/* Hover overlay with likes/comments */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#dbdbdb] dark:border-[#333] flex items-center justify-center mx-auto text-[#737373]">
            {activeTab === 'saved' ? <Bookmark className="w-8 h-8" /> : <Grid className="w-8 h-8" />}
          </div>
          <h4 className="text-lg font-bold">
            {activeTab === 'saved' ? 'Nenhuma publicação salva' : 'Compartilhar fotos'}
          </h4>
          <p className="text-xs text-[#737373] max-w-xs mx-auto">
            {activeTab === 'saved'
              ? 'Quando você salvar publicações de outros usuários, elas aparecerão aqui.'
              : 'Quando você compartilhar fotos, elas aparecerão no seu perfil.'}
          </p>
          {activeTab !== 'saved' && (
            <button
              onClick={openCreateModal}
              className="text-xs font-semibold text-[#0095f6] hover:underline"
            >
              Compartilhe sua primeira foto
            </button>
          )}
        </div>
      )}
    </div>
  );
};
