import React, { useState } from 'react';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, CheckCircle2 } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onOptionsClick: (post: Post) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onOptionsClick,
}) => {
  const { toggleLike, toggleSave, addComment } = usePosts();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  if (!post) return null;

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLike(post.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 850);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-75 p-2 z-50"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Main 2-column modal */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-[85vh] max-h-[720px]">
        {/* Left: Media Column */}
        <div 
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.imageUrl}
            alt={post.caption}
            className={`w-full h-full object-contain ${post.filter || ''}`}
          />
          {showHeartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-like-heart" />
            </div>
          )}
        </div>

        {/* Right: Comments & Info Column */}
        <div className="w-full md:w-[420px] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#dbdbdb] dark:border-[#2f2f2f] bg-white dark:bg-black">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#efefef] dark:border-[#262626]">
            <div className="flex items-center gap-3">
              <img
                src={post.user.avatarUrl}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] hover:underline cursor-pointer">
                    {post.user.username}
                  </span>
                  {post.user.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 fill-[#0095f6] text-white" />
                  )}
                </div>
                {post.location && (
                  <span className="text-[11px] text-[#737373] block">{post.location}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onOptionsClick(post)}
              className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-60"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Caption as first comment */}
            {post.caption && (
              <div className="flex items-start gap-3">
                <img
                  src={post.user.avatarUrl}
                  alt={post.user.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold mr-1.5">{post.user.username}</span>
                  <span>{post.caption}</span>
                  <div className="text-[11px] text-[#737373] mt-1">{post.createdAt}</div>
                </div>
              </div>
            )}

            {/* List of comments */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between gap-2 group">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.username}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="leading-relaxed">
                      <span className="font-semibold mr-1.5 cursor-pointer hover:underline">
                        {comment.user.username}
                      </span>
                      <span>{comment.content}</span>
                      <div className="flex items-center gap-3 text-[11px] text-[#737373] mt-1">
                        <span>{comment.createdAt}</span>
                        {comment.likesCount > 0 && <span>{comment.likesCount} curtidas</span>}
                        <button className="hover:text-black dark:hover:text-white">Responder</button>
                      </div>
                    </div>
                  </div>

                  <button className="text-[#737373] hover:text-[#ff3040] p-1 self-center">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#737373]">
                <p className="font-semibold mb-1">Ainda não há comentários.</p>
                <p className="text-[11px]">Seja o primeiro a comentar nesta publicação.</p>
              </div>
            )}
          </div>

          {/* Bottom Actions & Input */}
          <div className="border-t border-[#efefef] dark:border-[#262626] p-4 bg-white dark:bg-black">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)}>
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked
                        ? 'text-[#ff3040] fill-[#ff3040]'
                        : 'text-[#262626] dark:text-[#f5f5f5]'
                    }`}
                  />
                </button>
                <button>
                  <MessageCircle className="w-6 h-6 stroke-[1.8]" />
                </button>
                <button>
                  <Send className="w-6 h-6 stroke-[1.8]" />
                </button>
              </div>
              <button onClick={() => toggleSave(post.id)}>
                <Bookmark
                  className={`w-6 h-6 ${
                    post.isSaved ? 'fill-black dark:fill-white' : ''
                  }`}
                />
              </button>
            </div>

            <div className="text-xs font-semibold mb-1">
              {post.likesCount.toLocaleString('pt-BR')} curtidas
            </div>
            <div className="text-[10px] text-[#737373] uppercase mb-3">
              {post.createdAt}
            </div>

            {/* Comment input form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2 border-t border-[#efefef] dark:border-[#262626]">
              <Smile className="w-5 h-5 text-[#737373]" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 bg-transparent text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-xs font-semibold text-[#0095f6] disabled:opacity-0 transition-opacity"
              >
                Publicar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
