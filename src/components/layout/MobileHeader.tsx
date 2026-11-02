import React from 'react';
import { Heart, Send, LogOut } from 'lucide-react';
import { InstagramLogo } from '../common/InstagramLogo';
import type { ActiveTab } from '../../types';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

interface MobileHeaderProps {
  setActiveTab: (tab: ActiveTab) => void;
  openNotifications: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  setActiveTab,
  openNotifications,
}) => {
  const { totalUnreadCount } = useChat();
  const { logout } = useAuth();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white dark:bg-black border-b border-[#dbdbdb] dark:border-[#262626]">
      <div 
        onClick={() => setActiveTab('home')}
        className="cursor-pointer"
      >
        <InstagramLogo size="sm" />
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button 
          onClick={openNotifications}
          className="relative text-[#262626] dark:text-[#f5f5f5] p-1"
          aria-label="Notificações"
        >
          <Heart className="w-6 h-6 stroke-[1.8]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff3040] rounded-full ring-2 ring-white dark:ring-black"></span>
        </button>

        {/* Direct Messages */}
        <button 
          onClick={() => setActiveTab('messages')}
          className="relative text-[#262626] dark:text-[#f5f5f5] p-1"
          aria-label="Mensagens diretas"
        >
          <Send className="w-6 h-6 stroke-[1.8]" />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ff3040] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white dark:ring-black">
              {totalUnreadCount}
            </span>
          )}
        </button>

        {/* Disconnect / Logout */}
        <button
          onClick={logout}
          className="text-[#737373] hover:text-rose-600 p-1"
          aria-label="Desconectar"
          title="Desconectar"
        >
          <LogOut className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};

