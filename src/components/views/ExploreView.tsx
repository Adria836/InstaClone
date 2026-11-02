import React from 'react';
import { Heart, MessageCircle, Compass } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import type { Post } from '../../types';

interface ExploreViewProps {
  onItemClick: (post: Post) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onItemClick }) => {
  const { posts } = usePosts();

  if (posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 space-y-3">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#dbdbdb] dark:border-[#333] flex items-center justify-center mx-auto text-[#737373]">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold">Nenhuma publicação para explorar</h3>
        <p className="text-xs text-[#737373]">
          As fotos publicadas no Supabase aparecerão aqui na grade do Explorar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 md:px-6">
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {posts.map((post, index) => {
          const isTall = index % 5 === 1;

          return (
            <div
              key={post.id}
              onClick={() => onItemClick(post)}
              className={`relative group cursor-pointer overflow-hidden rounded-sm md:rounded-lg bg-neutral-200 dark:bg-neutral-800 ${
                isTall ? 'row-span-2' : 'aspect-square'
              }`}
            >
              <img
                src={post.imageUrl}
                alt={post.caption || 'Explorar'}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${post.filter || ''}`}
                loading="lazy"
              />

              {/* Hover Overlay with Stats */}
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
          );
        })}
      </div>
    </div>
  );
};
