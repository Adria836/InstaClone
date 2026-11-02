import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Smile,
  CheckCircle2
} from 'lucide-react';
import { Post } from '../../types';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';

interface PostCardProps {
  post: Post;
  onOptionsClick: (post: Post) => void;
  onPostClick: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOptionsClick,
  onPostClick,
}) => {
  const { toggleLike, toggleSave, addComment } = usePosts();
  const { user } = useAuth();
  
  const [commentText, setCommentText] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLike(post.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => {
      setShowHeartAnim(false);
    }, 850);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['❤️', '🙌', '🔥', '👏', '😍', '✨', '😂', '🚀'];

  return (
    <article className="bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-xl mb-4 overflow-hidden">
      {/* 1. Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full p-[1.5px] story-ring cursor-pointer">
            <div className="w-full h-full bg-white dark:bg-black rounded-full p-[1.5px]">
              <img
                src={post.user.avatarUrl}
                alt={post.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] hover:underline cursor-pointer">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 fill-[#0095f6] text-white" />
              )}
              <span className="text-xs text-[#737373]">•</span>
              <span className="text-xs text-[#737373] font-normal">{post.createdAt}</span>
            </div>

            {post.location && (
              <span className="block text-[11px] text-[#737373] hover:underline cursor-pointer">
                {post.location}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onOptionsClick(post)}
          className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-60 p-1"
          aria-label="Opções da publicação"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Post Media with Double-Tap Animation */}
      <div 
        className="relative bg-black flex items-center justify-center select-none overflow-hidden group cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.imageUrl}
          alt={post.caption || 'Foto da publicação'}
          className={`w-full max-h-[580px] object-cover transition-transform duration-200 ${post.filter || ''}`}
          loading="lazy"
        />

        {/* Big Bouncing Heart on Double Tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-like-heart" />
          </div>
        )}
      </div>

      {/* 3. Action Buttons Bar */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => toggleLike(post.id)}
              className="transition-transform active:scale-125 focus:outline-none"
              aria-label="Curtir"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  post.isLiked
                    ? 'text-[#ff3040] fill-[#ff3040]'
                    : 'text-[#262626] dark:text-[#f5f5f5] hover:text-[#737373]'
                }`}
              />
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onPostClick(post)}
              className="text-[#262626] dark:text-[#f5f5f5] hover:text-[#737373] transition-transform active:scale-125 focus:outline-none"
              aria-label="Comentar"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link da publicação copiado para a área de transferência!');
                }
              }}
              className="text-[#262626] dark:text-[#f5f5f5] hover:text-[#737373] transition-transform active:scale-125 focus:outline-none"
              aria-label="Compartilhar publicação"
            >
              <Send className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => toggleSave(post.id)}
            className="transition-transform active:scale-125 focus:outline-none"
            aria-label="Salvar"
          >
            <Bookmark
              className={`w-6 h-6 ${
                post.isSaved
                  ? 'text-black dark:text-white fill-black dark:fill-white'
                  : 'text-[#262626] dark:text-[#f5f5f5] hover:text-[#737373]'
              }`}
            />
          </button>
        </div>

        {/* 4. Likes Counter */}
        <div className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-2 text-left">
          {post.likesCount.toLocaleString('pt-BR')} curtidas
        </div>

        {/* 5. Caption with Read More */}
        <div className="text-xs text-[#262626] dark:text-[#f5f5f5] mb-1.5 text-left leading-relaxed">
          <span className="font-semibold mr-1.5 cursor-pointer hover:underline">
            {post.user.username}
          </span>
          <span>
            {isCaptionExpanded || post.caption.length <= 110
              ? post.caption
              : `${post.caption.slice(0, 110)}...`}
          </span>
          {post.caption.length > 110 && !isCaptionExpanded && (
            <button
              onClick={() => setIsCaptionExpanded(true)}
              className="text-[#737373] ml-1 font-normal hover:underline"
            >
              mais
            </button>
          )}
        </div>

        {/* 6. Comments Summary */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => onPostClick(post)}
            className="block text-xs text-[#737373] mb-1.5 hover:underline text-left"
          >
            Ver todos os {post.commentsCount} comentários
          </button>
        )}

        {/* Display recent comments */}
        {post.comments && post.comments.slice(-2).map((c) => (
          <div key={c.id} className="text-xs text-[#262626] dark:text-[#f5f5f5] mb-1 text-left">
            <span className="font-semibold mr-1.5 cursor-pointer hover:underline">
              {c.user.username}
            </span>
            <span>{c.content}</span>
          </div>
        ))}
      </div>

      {/* 7. Inline Add Comment Input */}
      <form 
        onSubmit={handleCommentSubmit}
        className="relative border-t border-[#efefef] dark:border-[#1f1f1f] px-3.5 py-2.5 flex items-center justify-between gap-2"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-70 p-0.5"
          aria-label="Inserir emoji"
        >
          <Smile className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Emoji Quick Picker Floating Tray */}
        {showEmojiPicker && (
          <div className="absolute bottom-11 left-2 bg-white dark:bg-[#1e1e1e] border border-[#dbdbdb] dark:border-[#333] rounded-full px-2.5 py-1.5 shadow-xl flex items-center gap-1.5 z-30 animate-fade-in">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-lg hover:scale-125 transition-transform p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 bg-transparent text-xs text-[#262626] dark:text-[#f5f5f5] focus:outline-none placeholder:text-[#737373]"
        />

        <button
          type="submit"
          disabled={!commentText.trim()}
          className={`text-xs font-semibold transition-opacity ${
            commentText.trim()
              ? 'text-[#0095f6] hover:text-[#00376b] dark:hover:text-sky-300 opacity-100'
              : 'text-[#0095f6] opacity-0 pointer-events-none'
          }`}
        >
          Publicar
        </button>
      </form>
    </article>
  );
};
