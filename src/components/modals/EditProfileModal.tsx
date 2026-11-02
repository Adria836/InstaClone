import React, { useState } from 'react';
import { X, Camera, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      fullName: fullName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      website: website.trim(),
      avatarUrl: avatarUrl.trim(),
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#262626] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#dbdbdb] dark:border-[#363636]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#efefef] dark:border-[#363636]">
          <h3 className="text-sm font-bold text-[#262626] dark:text-[#f5f5f5]">
            Editar perfil
          </h3>
          <button onClick={onClose} className="text-[#737373] hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Avatar preview and input */}
          <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-[#efefef] dark:border-[#363636]">
            <img
              src={avatarUrl || user.avatarUrl}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
                URL da Foto de Perfil
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-2.5 py-1.5 border border-[#dbdbdb] dark:border-[#363636] rounded-lg bg-white dark:bg-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
              Nome de Usuário (@)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              className="w-full text-xs px-3 py-2 border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6] resize-none"
            />
            <span className="block text-[11px] text-[#737373] text-right">
              {bio.length}/150
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#262626] dark:text-[#f5f5f5] mb-1">
              Site / Link
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://seusite.com"
              className="w-full text-xs px-3 py-2 border border-[#dbdbdb] dark:border-[#363636] rounded-xl bg-transparent focus:outline-none focus:border-[#0095f6]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#dbdbdb] dark:border-[#363636]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#0095f6] hover:bg-[#1877f2] text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
