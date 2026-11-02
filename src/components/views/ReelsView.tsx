import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music2, 
  Volume2, 
  VolumeX,
  Film
} from 'lucide-react';
import { usePosts } from '../../context/PostContext';

export const ReelsView: React.FC = () => {
  const { posts, toggleLike, toggleSave } = usePosts();
  const [muted, setMuted] = useState(true);

  if (posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-28 px-4 space-y-3">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#dbdbdb] dark:border-[#333] flex items-center justify-center mx-auto text-[#737373]">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold">Nenhum Reel publicado</h3>
        <p className="text-xs text-[#737373]">
          Crie uma publicação para vê-la no formato imersivo vertical de Reels.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-8 max-w-lg mx-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative flex items-end gap-3 w-full max-w-[380px] h-[78vh] max-h-[700px] select-none"
        >
          {/* Reel Canvas */}
          <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl group">
            <img
              src={post.imageUrl}
              alt={post.caption || 'Reel'}
              className={`w-full h-full object-cover ${post.filter || ''}`}
            />

            {/* Sound Toggle Overlay Button */}
            <button
              onClick={() => setMuted(!muted)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors z-20 backdrop-blur-sm"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Bottom Creator Info & Audio */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-20 space-y-3 pointer-events-auto">
              <div className="flex items-center gap-3">
                <img
                  src={post.user.avatarUrl}
                  alt={post.user.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white/60"
                />
                <span className="text-xs font-semibold drop-shadow">
                  {post.user.username}
                </span>
              </div>

              <p className="text-xs text-white/95 line-clamp-2 drop-shadow">
                {post.caption}
              </p>

              {/* Audio Ticker */}
              <div className="flex items-center gap-2 text-xs text-white/90">
                <Music2 className="w-3.5 h-3.5 animate-bounce" />
                <span className="truncate max-w-[200px] text-[11px]">
                  {post.user.username} • Áudio original
                </span>
              </div>
            </div>

            {/* Dark subtle gradient at bottom for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Right Action Rail */}
          <div className="flex flex-col items-center gap-4 text-neutral-800 dark:text-neutral-100 pb-2">
            {/* Like */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleLike(post.id)}
                className="p-2 hover:opacity-75 transition-transform active:scale-125"
              >
                <Heart
                  className={`w-7 h-7 ${
                    post.isLiked ? 'text-[#ff3040] fill-[#ff3040]' : 'text-neutral-800 dark:text-white'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold">{post.likesCount}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
              <button className="p-2 hover:opacity-75 transition-transform active:scale-125">
                <MessageCircle className="w-7 h-7 stroke-[1.8]" />
              </button>
              <span className="text-xs font-semibold">{post.commentsCount}</span>
            </div>

            {/* Share */}
            <button 
              onClick={() => alert('Link copiado!')}
              className="p-2 hover:opacity-75 transition-transform active:scale-125"
            >
              <Send className="w-7 h-7 stroke-[1.8]" />
            </button>

            {/* Save */}
            <button
              onClick={() => toggleSave(post.id)}
              className="p-2 hover:opacity-75 transition-transform active:scale-125"
            >
              <Bookmark className={`w-7 h-7 stroke-[1.8] ${post.isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
