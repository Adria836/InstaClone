import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  Send, 
  Heart, 
  PlusSquare, 
  Menu, 
  Moon,
  Sun,
  LogOut,
  Bookmark
} from 'lucide-react';
import type { ActiveTab } from '../../types';
import { InstagramLogo } from '../common/InstagramLogo';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isNotifOpen: boolean;
  setIsNotifOpen: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  isSearchOpen,
  setIsSearchOpen,
  isNotifOpen,
  setIsNotifOpen,
  isDarkMode,
  setIsDarkMode,
}) => {
  const { user, logout } = useAuth();
  const { totalUnreadCount } = useChat();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isCollapsed = isSearchOpen || isNotifOpen;

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'search') {
      setIsSearchOpen(!isSearchOpen);
      setIsNotifOpen(false);
      return;
    }
    if (tab === 'notifications') {
      setIsNotifOpen(!isNotifOpen);
      setIsSearchOpen(false);
      return;
    }
    if (tab === 'create') {
      openCreateModal();
      return;
    }

    setIsSearchOpen(false);
    setIsNotifOpen(false);
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Página inicial', icon: Home },
    { id: 'search' as ActiveTab, label: 'Pesquisa', icon: Search },
    { id: 'explore' as ActiveTab, label: 'Explorar', icon: Compass },
    { id: 'reels' as ActiveTab, label: 'Reels', icon: Film },
    { 
      id: 'messages' as ActiveTab, 
      label: 'Mensagens', 
      icon: Send, 
      badge: totalUnreadCount > 0 ? totalUnreadCount : null 
    },
    { 
      id: 'notifications' as ActiveTab, 
      label: 'Notificações', 
      icon: Heart, 
      badge: 2 
    },
    { id: 'create' as ActiveTab, label: 'Criar', icon: PlusSquare },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col justify-between h-screen fixed left-0 top-0 border-r border-[#dbdbdb] dark:border-[#262626] bg-white dark:bg-black px-3 py-6 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-20 xl:w-64'
      }`}
    >
      <div>
        {/* Instagram Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer mb-8 px-3 h-10 flex items-center"
        >
          {isCollapsed ? (
            <InstagramLogo iconOnly />
          ) : (
            <>
              <div className="hidden xl:block">
                <InstagramLogo size="md" />
              </div>
              <div className="xl:hidden">
                <InstagramLogo iconOnly />
              </div>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !isSearchOpen && !isNotifOpen;
            const isDrawerActive = 
              (item.id === 'search' && isSearchOpen) || 
              (item.id === 'notifications' && isNotifOpen);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-normal transition-all duration-150 relative group ${
                  isActive || isDrawerActive
                    ? 'font-bold bg-[#f2f2f2] dark:bg-[#1e1e1e] text-black dark:text-white'
                    : 'text-[#262626] dark:text-[#f5f5f5] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
                }`}
                title={item.label}
              >
                <div className="relative flex items-center justify-center">
                  <Icon 
                    className={`w-6 h-6 transition-transform group-hover:scale-105 ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'
                    }`} 
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 bg-[#ff3040] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-white dark:border-black">
                      {item.badge}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <span className="hidden xl:inline text-[15px] truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* Profile Tab */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg text-sm transition-all duration-150 group ${
              activeTab === 'profile' && !isCollapsed
                ? 'font-bold bg-[#f2f2f2] dark:bg-[#1e1e1e]'
                : 'hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
            }`}
            title="Perfil"
          >
            <div className="relative">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.username || 'Perfil'}
                className={`w-6 h-6 rounded-full object-cover transition-transform group-hover:scale-105 ${
                  activeTab === 'profile' ? 'ring-2 ring-black dark:ring-white' : ''
                }`}
              />
            </div>
            {!isCollapsed && (
              <span className={`hidden xl:inline text-[15px] truncate ${activeTab === 'profile' ? 'font-bold' : ''}`}>
                Perfil
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="relative space-y-2">
        {/* More Menu Dropdown */}
        {showMoreMenu && (
          <div className="absolute bottom-14 left-0 w-60 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#dbdbdb] dark:border-[#333] p-1.5 z-50 text-sm animate-fade-in">
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#f2f2f2] dark:hover:bg-[#2a2a2a] text-[#262626] dark:text-[#f5f5f5]"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>Alternar modo</span>
              </div>
              <span className="text-xs text-neutral-400">{isDarkMode ? 'Escuro' : 'Claro'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f2f2f2] dark:hover:bg-[#2a2a2a] text-[#262626] dark:text-[#f5f5f5]"
            >
              <Bookmark className="w-4 h-4" />
              <span>Itens salvos</span>
            </button>

            <div className="my-1 border-t border-[#efefef] dark:border-[#2f2f2f]" />

            <button
              onClick={() => {
                logout();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
        )}

        {/* Quick Disconnect Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm text-[#737373] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all group"
          title="Desconectar da conta"
        >
          <LogOut className="w-6 h-6 stroke-[1.75px] transition-transform group-hover:scale-105" />
          {!isCollapsed && (
            <span className="hidden xl:inline text-[15px] font-medium">Desconectar</span>
          )}
        </button>

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-normal text-[#262626] dark:text-[#f5f5f5] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-all"
        >
          <Menu className="w-6 h-6 stroke-[1.75px]" />
          {!isCollapsed && (
            <span className="hidden xl:inline text-[15px]">Mais</span>
          )}
        </button>
      </div>
    </aside>
  );
};
