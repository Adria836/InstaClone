import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';

interface StoriesBarProps {
  openCreateStoryModal: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ openCreateStoryModal }) => {
  const { stories, setActiveStoryIndex } = usePosts();
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-xl py-4 mb-4 select-none">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white dark:bg-neutral-800 rounded-full shadow-md items-center justify-center z-10 text-neutral-700 dark:text-neutral-200 hover:scale-105 transition-transform"
        aria-label="Voltar stories"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Stories Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar px-4 scroll-smooth"
      >
        {/* Current User Story / Add Story */}
        <div 
          onClick={openCreateStoryModal}
          className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group"
        >
          <div className="relative">
            <div className="w-[66px] h-[66px] rounded-full p-[2px] border-2 border-dashed border-[#dbdbdb] dark:border-neutral-700 group-hover:border-[#0095f6] transition-colors flex items-center justify-center">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt="Seu story"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0095f6] text-white rounded-full flex items-center justify-center border-2 border-white dark:border-black group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-xs text-[#262626] dark:text-[#f5f5f5] truncate max-w-[72px]">
            Seu story
          </span>
        </div>

        {/* Other Users' Stories */}
        {stories.map((story, index) => {
          const isViewed = story.viewed;

          return (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group"
            >
              <div
                className={`w-[66px] h-[66px] rounded-full p-[2.5px] transition-transform group-hover:scale-105 ${
                  isViewed ? 'story-ring-viewed' : 'story-ring'
                }`}
              >
                <div className="w-full h-full bg-white dark:bg-black rounded-full p-[2px]">
                  <img
                    src={story.user.avatarUrl}
                    alt={story.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-[#262626] dark:text-[#f5f5f5] truncate max-w-[74px]">
                {story.user.username}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white dark:bg-neutral-800 rounded-full shadow-md items-center justify-center z-10 text-neutral-700 dark:text-neutral-200 hover:scale-105 transition-transform"
        aria-label="Avançar stories"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
