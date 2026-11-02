import React from 'react';
import { StoriesBar } from '../feed/StoriesBar';
import { PostCard } from '../feed/PostCard';
import { SuggestionsSidebar } from '../layout/SuggestionsSidebar';
import { usePosts } from '../../context/PostContext';
import { Post, ActiveTab } from '../../types';
import { PlusSquare } from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
  openCreateStoryModal: () => void;
  onOptionsClick: (post: Post) => void;
  onPostClick: (post: Post) => void;
  openAuthModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  openCreateModal,
  openCreateStoryModal,
  onOptionsClick,
  onPostClick,
  openAuthModal,
}) => {
  const { posts } = usePosts();

  return (
    <div className="flex justify-center max-w-6xl mx-auto pt-4 md:pt-6 px-0 md:px-4">
      {/* Main Feed Column */}
      <div className="w-full max-w-[630px] flex-shrink-0">
        {/* Stories Tray */}
        <StoriesBar openCreateStoryModal={openCreateStoryModal} />

        {/* Posts Feed */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOptionsClick={onOptionsClick}
              onPostClick={onPostClick}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-xl p-8 space-y-3">
            <PlusSquare className="w-12 h-12 text-[#737373] mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold">Nenhuma publicação ainda</h3>
            <p className="text-xs text-[#737373]">
              Seja o primeiro a compartilhar uma foto com a comunidade!
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Criar publicação
            </button>
          </div>
        )}
      </div>

      {/* Desktop Right Rail: Suggestions & Meta Info */}
      <SuggestionsSidebar
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
      />
    </div>
  );
};
