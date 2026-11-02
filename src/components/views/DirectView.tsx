import React, { useState } from 'react';
import { 
  Send, 
  Smile, 
  Heart, 
  Image as ImageIcon, 
  Mic, 
  Phone, 
  Video, 
  Info, 
  Edit, 
  Search
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export const DirectView: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    messages, 
    availableUsers,
    setActiveConversation, 
    sendMessage, 
    sendHeart,
    startConversationWithUser 
  } = useChat();
  const { user } = useAuth();

  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.participant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] my-2 md:my-5 bg-white dark:bg-black border border-[#dbdbdb] dark:border-[#262626] rounded-2xl overflow-hidden flex shadow-sm">
      {/* 1. Left Column: Conversations List */}
      <div className={`w-full md:w-[350px] border-r border-[#dbdbdb] dark:border-[#262626] flex flex-col ${
        activeConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {/* User Handle Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#efefef] dark:border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-[#262626] dark:text-[#f5f5f5]">
              {user?.username}
            </span>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-70 p-1"
            title="Nova mensagem"
          >
            <Edit className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#efefef] dark:bg-[#1a1a1a] rounded-xl text-xs">
            <Search className="w-4 h-4 text-[#737373]" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full focus:outline-none placeholder:text-[#737373]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-transparent">
          {filteredConversations.map((conv) => {
            const isSelected = activeConversation?.id === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`flex items-center gap-3.5 px-5 py-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#efefef] dark:bg-[#1a1a1a]'
                    : 'hover:bg-[#f8f9fa] dark:hover:bg-[#121212]'
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.participant.avatarUrl}
                    alt={conv.participant.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-black" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <span className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] truncate">
                    {conv.participant.username}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                    <span className="truncate max-w-[170px]">{conv.lastMessage}</span>
                    <span>•</span>
                    <span className="text-[11px]">{conv.lastMessageTime}</span>
                  </div>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#0095f6]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Column: Active Conversation */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-black ${
        !activeConversation ? 'hidden md:flex' : 'flex'
      }`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#efefef] dark:border-[#262626]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden text-xs text-[#0095f6] font-semibold mr-1"
                >
                  ← Voltar
                </button>

                <img
                  src={activeConversation.participant.avatarUrl}
                  alt={activeConversation.participant.username}
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5]">
                    {activeConversation.participant.username}
                  </span>
                  <span className="block text-[11px] text-emerald-500 font-medium">
                    Online agora
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#262626] dark:text-[#f5f5f5]">
                <button className="hover:opacity-60" title="Chamada de áudio">
                  <Phone className="w-5 h-5 stroke-[1.75]" />
                </button>
                <button className="hover:opacity-60" title="Chamada de vídeo">
                  <Video className="w-5 h-5 stroke-[1.75]" />
                </button>
                <button className="hover:opacity-60" title="Detalhes da conversa">
                  <Info className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col justify-end">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 max-w-[70%] ${
                      isMe ? 'self-end flex-row-reverse' : 'self-start'
                    }`}
                  >
                    {!isMe && (
                      <img
                        src={activeConversation.participant.avatarUrl}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}

                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#3797f0] text-white rounded-br-sm'
                          : 'bg-[#efefef] dark:bg-[#262626] text-[#262626] dark:text-[#f5f5f5] rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>

                    <span className="text-[10px] text-[#737373] pb-0.5">
                      {msg.createdAt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#efefef] dark:border-[#262626]">
              <div className="flex items-center gap-3 border border-[#dbdbdb] dark:border-[#262626] rounded-full px-4 py-2.5 bg-white dark:bg-black">
                <Smile className="w-5 h-5 text-[#737373] cursor-pointer hover:opacity-75" />

                <input
                  type="text"
                  placeholder="Mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-[#262626] dark:text-[#f5f5f5] focus:outline-none"
                />

                {inputMessage.trim() ? (
                  <button
                    type="submit"
                    className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b]"
                  >
                    Enviar
                  </button>
                ) : (
                  <div className="flex items-center gap-3 text-[#262626] dark:text-[#f5f5f5]">
                    <Mic className="w-5 h-5 stroke-[1.8] cursor-pointer hover:opacity-75" />
                    <ImageIcon className="w-5 h-5 stroke-[1.8] cursor-pointer hover:opacity-75" />
                    <button
                      type="button"
                      onClick={sendHeart}
                      className="hover:scale-110 transition-transform text-[#ff3040]"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
            <div className="w-24 h-24 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4">
              <Send className="w-12 h-12 stroke-[1.2] ml-1" />
            </div>
            <h3 className="text-xl font-normal mb-1">Suas mensagens</h3>
            <p className="text-xs text-[#737373] max-w-xs mb-6">
              Envie fotos e mensagens privadas para um amigo ou grupo com facilidade.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Enviar mensagem
            </button>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#dbdbdb] dark:border-[#333]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#efefef] dark:border-[#333]">
              <span className="text-sm font-semibold">Nova conversa</span>
              <button onClick={() => setShowNewChatModal(false)} className="text-xs font-bold text-neutral-400">
                ✕
              </button>
            </div>
            <div className="p-3 divide-y divide-[#efefef] dark:divide-[#333]">
              <span className="text-xs font-semibold text-[#737373] block mb-2 px-1">Usuários do Supabase</span>
              {availableUsers.length > 0 ? (
                availableUsers.map((su) => (
                  <div
                    key={su.id}
                    onClick={() => {
                      startConversationWithUser(su);
                      setShowNewChatModal(false);
                    }}
                    className="flex items-center gap-3 py-2.5 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                  >
                    <img src={su.avatarUrl} alt={su.username} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="block text-xs font-semibold">{su.username}</span>
                      <span className="block text-[11px] text-[#737373]">{su.fullName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-[#737373]">
                  Nenhum outro usuário cadastrado no Supabase ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
