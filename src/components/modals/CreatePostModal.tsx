import React, { useState, useRef } from 'react';
import { X, ArrowLeft, Image as ImageIcon, MapPin, Smile, Sparkles, Check } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const samplePresets = [
  { name: 'Natureza', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80' },
  { name: 'Tecnologia', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80' },
  { name: 'Café & Código', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1080&auto=format&fit=crop&q=80' },
  { name: 'Arquitetura', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=80' },
];

const filterOptions = [
  { id: 'filter-normal', label: 'Normal' },
  { id: 'filter-clarendon', label: 'Clarendon' },
  { id: 'filter-gingham', label: 'Gingham' },
  { id: 'filter-juno', label: 'Juno' },
  { id: 'filter-lark', label: 'Lark' },
  { id: 'filter-vintage', label: 'Vintage' },
  { id: 'filter-grayscale', label: 'P&B' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { createPost } = usePosts();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('filter-normal');
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setSelectedImage(url);
    setStep(2);
  };

  const handleUseCustomUrl = () => {
    if (customUrl.trim().startsWith('http')) {
      setSelectedImage(customUrl.trim());
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setIsSubmitting(true);
    await createPost({
      imageUrl: selectedImage,
      caption,
      filter: selectedFilter,
      location: location.trim() || undefined,
    });
    setIsSubmitting(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedImage('');
    setCustomUrl('');
    setSelectedFilter('filter-normal');
    setCaption('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      {/* Close button outside modal */}
      <button
        onClick={resetAndClose}
        className="absolute top-5 right-5 text-white hover:opacity-75 p-2 z-50"
        aria-label="Fechar modal"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Modal Container */}
      <div className="bg-white dark:bg-[#262626] rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full max-w-2xl max-h-[85vh] transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb] dark:border-[#363636] text-sm font-semibold text-[#262626] dark:text-[#f5f5f5]">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="text-[#262626] dark:text-[#f5f5f5] hover:opacity-70 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <span>
            {step === 1 && 'Criar nova publicação'}
            {step === 2 && 'Filtros & Edição'}
            {step === 3 && 'Detalhes da publicação'}
          </span>

          {step === 1 && <div className="w-5" />}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="text-[#0095f6] hover:text-[#00376b] font-semibold text-sm"
            >
              Avançar
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-[#0095f6] hover:text-[#00376b] font-semibold text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Compartilhando...' : 'Compartilhar'}
            </button>
          )}
        </div>

        {/* Step 1: Select Media */}
        {step === 1 && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#f2f2f2] dark:bg-[#1a1a1a] flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-neutral-600 dark:text-neutral-300 stroke-[1.5]" />
            </div>

            <h3 className="text-xl font-normal text-[#262626] dark:text-[#f5f5f5] mb-2">
              Arraste fotos e vídeos aqui
            </h3>
            <p className="text-xs text-[#737373] mb-6 max-w-sm">
              Selecione um arquivo do seu computador, insira um link ou escolha uma imagem modelo abaixo.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors mb-6"
            >
              Selecionar do computador
            </button>

            {/* Custom URL Input */}
            <div className="w-full max-w-md flex items-center gap-2 mb-6">
              <input
                type="text"
                placeholder="Ou cole a URL de uma foto (https://...)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-[#dbdbdb] dark:border-[#363636] bg-transparent rounded-lg focus:outline-none focus:border-[#0095f6]"
              />
              <button
                type="button"
                onClick={handleUseCustomUrl}
                disabled={!customUrl.trim().startsWith('http')}
                className="px-3 py-2 text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 disabled:opacity-40 rounded-lg"
              >
                Carregar
              </button>
            </div>

            {/* Quick Presets */}
            <div className="w-full max-w-md text-left">
              <span className="text-xs font-semibold text-[#737373] block mb-2">
                Ou teste com fotos de exemplo:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {samplePresets.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => handleSelectPreset(preset.url)}
                    className="relative cursor-pointer group rounded-lg overflow-hidden aspect-square border border-[#dbdbdb] dark:border-[#363636]"
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-medium truncate">
                        {preset.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Filters & Adjustment */}
        {step === 2 && (
          <div className="flex flex-col md:flex-row h-[480px]">
            {/* Preview image */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Prévia"
                className={`max-h-full max-w-full object-contain ${selectedFilter}`}
              />
            </div>

            {/* Filters panel */}
            <div className="w-full md:w-60 border-t md:border-t-0 md:border-l border-[#dbdbdb] dark:border-[#363636] p-4 overflow-y-auto">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-[#737373]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Escolha o Filtro</span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
                {filterOptions.map((filter) => {
                  const isSelected = selectedFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilter(filter.id)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-[#0095f6] scale-105 shadow-md'
                            : 'border-transparent group-hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={selectedImage}
                          alt={filter.label}
                          className={`w-full h-full object-cover ${filter.id}`}
                        />
                      </div>
                      <span
                        className={`text-[11px] ${
                          isSelected
                            ? 'font-bold text-[#0095f6]'
                            : 'text-[#737373] group-hover:text-black dark:group-hover:text-white'
                        }`}
                      >
                        {filter.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details & Caption */}
        {step === 3 && (
          <div className="flex flex-col md:flex-row h-[480px]">
            {/* Image Preview */}
            <div className="hidden md:flex flex-1 bg-black items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Foto final"
                className={`max-h-full max-w-full object-contain ${selectedFilter}`}
              />
            </div>

            {/* Form details */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#dbdbdb] dark:border-[#363636] p-4 flex flex-col justify-between">
              <div>
                {/* Author row */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-[#262626] dark:text-[#f5f5f5]">
                    {user?.username}
                  </span>
                </div>

                {/* Caption input */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Escreva uma legenda..."
                  rows={5}
                  maxLength={2200}
                  className="w-full bg-transparent text-xs text-[#262626] dark:text-[#f5f5f5] focus:outline-none resize-none border-b border-[#efefef] dark:border-[#363636] pb-2 mb-3"
                />

                <div className="flex items-center justify-between text-xs text-[#737373] mb-4">
                  <Smile className="w-4 h-4 cursor-pointer hover:opacity-75" />
                  <span>{caption.length}/2.200</span>
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-2 border-b border-[#efefef] dark:border-[#363636] pb-2.5">
                  <MapPin className="w-4 h-4 text-[#737373]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Adicionar localização (ex: São Paulo, Brasil)"
                    className="flex-1 bg-transparent text-xs text-[#262626] dark:text-[#f5f5f5] focus:outline-none placeholder:text-[#737373]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Publicando...'
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Compartilhar Agora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
