import React from 'react';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';

interface OptionsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({ post, isOpen, onClose }) => {
  const { user } = useAuth();
  const { deletePost } = usePosts();

  if (!isOpen || !post) return null;

  const isAuthor = user?.id === post.userId;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    alert('Link copiado para a área de transferência!');
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      deletePost(post.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-sm overflow-hidden text-center divide-y divide-[#efefef] dark:divide-[#363636] shadow-2xl text-sm">
        {isAuthor ? (
          <button
            onClick={handleDelete}
            className="w-full py-3.5 font-bold text-[#ed4956] hover:bg-[#f2f2f2] dark:hover:bg-[#333] transition-colors"
          >
            Excluir publicação
          </button>
        ) : (
          <button
            onClick={() => {
              alert('Denúncia enviada para análise da moderação.');
              onClose();
            }}
            className="w-full py-3.5 font-bold text-[#ed4956] hover:bg-[#f2f2f2] dark:hover:bg-[#333] transition-colors"
          >
            Denunciar
          </button>
        )}

        <button
          onClick={handleCopyLink}
          className="w-full py-3.5 text-[#262626] dark:text-[#f5f5f5] hover:bg-[#f2f2f2] dark:hover:bg-[#333] transition-colors"
        >
          Copiar link
        </button>

        <button
          onClick={() => {
            alert('Publicação compartilhada com sucesso!');
            onClose();
          }}
          className="w-full py-3.5 text-[#262626] dark:text-[#f5f5f5] hover:bg-[#f2f2f2] dark:hover:bg-[#333] transition-colors"
        >
          Compartilhar em...
        </button>

        <button
          onClick={onClose}
          className="w-full py-3.5 text-[#262626] dark:text-[#f5f5f5] hover:bg-[#f2f2f2] dark:hover:bg-[#333] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
