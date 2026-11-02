import React from 'react';
import { Home, Compass, PlusSquare, Film } from 'lucide-react';
import { ActiveTab } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MobileNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
}) => {
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-12 bg-white dark:bg-black border-t border-[#dbdbdb] dark:border-[#262626] flex items-center justify-around px-2">
      <button
        onClick={() => setActiveTab('home')}
        className={`p-2 transition-transform active:scale-90 ${
          activeTab === 'home' ? 'text-black dark:text-white' : 'text-[#737373]'
        }`}
      >
        <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      <button
        onClick={() => setActiveTab('explore')}
        className={`p-2 transition-transform active:scale-90 ${
          activeTab === 'explore' ? 'text-black dark:text-white' : 'text-[#737373]'
        }`}
      >
        <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      <button
        onClick={openCreateModal}
        className="p-2 text-[#262626] dark:text-[#f5f5f5] transition-transform active:scale-90"
      >
        <PlusSquare className="w-6 h-6 stroke-[1.8]" />
      </button>

      <button
        onClick={() => setActiveTab('reels')}
        className={`p-2 transition-transform active:scale-90 ${
          activeTab === 'reels' ? 'text-black dark:text-white' : 'text-[#737373]'
        }`}
      >
        <Film className={`w-6 h-6 ${activeTab === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className="p-1 transition-transform active:scale-90"
      >
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={user?.username || 'Perfil'}
          className={`w-6 h-6 rounded-full object-cover ${
            activeTab === 'profile' ? 'ring-2 ring-black dark:ring-white' : ''
          }`}
        />
      </button>
    </nav>
  );
};
