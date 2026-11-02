import React, { useState, useEffect } from 'react';
import type { ActiveTab, Post, User } from './types';
import { useAuth } from './context/AuthContext';
import { usePosts } from './context/PostContext';

import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileNavbar } from './components/layout/MobileNavbar';

import { HomeView } from './components/views/HomeView';
import { ExploreView } from './components/views/ExploreView';
import { ReelsView } from './components/views/ReelsView';
import { DirectView } from './components/views/DirectView';
import { ProfileView } from './components/views/ProfileView';
import { SearchDrawer } from './components/views/SearchDrawer';
import { NotificationsDrawer } from './components/views/NotificationsDrawer';
import { AuthView } from './components/views/AuthView';

import { CreatePostModal } from './components/modals/CreatePostModal';
import { StoryViewerModal } from './components/modals/StoryViewerModal';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { OptionsModal } from './components/modals/OptionsModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { InstagramLogo } from './components/common/InstagramLogo';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { selectedPost, setSelectedPost } = usePosts();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [optionsModalPost, setOptionsModalPost] = useState<Post | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Dark Mode Theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ig_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ig_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ig_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSelectUserFromSearch = (_targetUser: User) => {
    setActiveTab('profile');
    setIsSearchOpen(false);
  };

  // 1. Initial loading state (checking saved session)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg animate-pulse">
          <InstagramLogo iconOnly />
        </div>
        <span className="font-logo text-3xl text-neutral-800 dark:text-neutral-200">Instagram</span>
      </div>
    );
  }

  // 2. Initial screen: If not authenticated, render Login/Auth screen!
  if (!isAuthenticated) {
    return <AuthView />;
  }

  // 3. Main Authenticated Instagram App
  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#f5f5f5] flex flex-col md:flex-row transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Slide-out Drawers */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectUser={handleSelectUserFromSearch}
      />

      <NotificationsDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* Mobile Top Header */}
      <MobileHeader
        setActiveTab={setActiveTab}
        openNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main
        className={`flex-1 transition-all duration-300 pb-16 md:pb-0 ${
          isSearchOpen || isNotifOpen
            ? 'md:ml-20'
            : 'md:ml-20 xl:ml-64'
        }`}
      >
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            openCreateModal={() => setIsCreateModalOpen(true)}
            openCreateStoryModal={() => setIsCreateModalOpen(true)}
            onOptionsClick={(p) => setOptionsModalPost(p)}
            onPostClick={(p) => setSelectedPost(p)}
            openAuthModal={logout}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onItemClick={(post) => setSelectedPost(post)}
          />
        )}

        {activeTab === 'reels' && <ReelsView />}

        {activeTab === 'messages' && <DirectView />}

        {activeTab === 'profile' && (
          <ProfileView
            openEditModal={() => setIsEditProfileModalOpen(true)}
            onPostClick={(p) => setSelectedPost(p)}
            openCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <StoryViewerModal />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onOptionsClick={(p) => setOptionsModalPost(p)}
      />

      <OptionsModal
        post={optionsModalPost}
        isOpen={!!optionsModalPost}
        onClose={() => setOptionsModalPost(null)}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />
    </div>
  );
};

export default App;
