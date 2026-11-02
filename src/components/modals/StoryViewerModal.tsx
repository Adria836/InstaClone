import React, { useState, useEffect, useRef } from 'react';
import { X, Pause, Play, Heart, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import confetti from 'canvas-confetti';

export const StoryViewerModal: React.FC = () => {
  const { stories, activeStoryIndex, setActiveStoryIndex, markStoryAsViewed } = usePosts();
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const timerRef = useRef<any>(null);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStory) {
      markStoryAsViewed(activeStory.id);
      setProgress(0);
    }
  }, [activeStoryIndex]);

  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = 50; // Update every 50ms
    const step = (interval / 5000) * 100; // 5 seconds total duration

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStoryIndex, isPaused]);

  if (activeStoryIndex === null || !activeStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleSendHeart = () => {
    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff3040', '#ed4956'],
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex items-center justify-center select-none animate-fade-in">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4 text-white">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 hover:opacity-75"
          aria-label={isPaused ? 'Continuar' : 'Pausar'}
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setActiveStoryIndex(null)}
          className="p-1 hover:opacity-75"
          aria-label="Fechar story"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Navigation Arrow Left */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full items-center justify-center transition-all z-40"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Arrow Right */}
      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full items-center justify-center transition-all z-40"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Mobile Device Canvas */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[780px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((story, idx) => {
            let width = '0%';
            if (idx < activeStoryIndex) width = '100%';
            else if (idx === activeStoryIndex) width = `${progress}%`;

            return (
              <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Author Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={activeStory.user.avatarUrl}
              alt={activeStory.user.username}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
            />
            <span className="text-xs font-semibold drop-shadow-sm">
              {activeStory.user.username}
            </span>
            <span className="text-[11px] text-white/80 drop-shadow-sm">
              {activeStory.createdAt}
            </span>
          </div>
        </div>

        {/* Touch/Click Navigation Hotspots */}
        <div className="absolute inset-0 z-20 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="Voltar"
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            title="Avançar"
          />
        </div>

        {/* Media Background */}
        <img
          src={activeStory.mediaUrl}
          alt="Story content"
          className="w-full h-full object-cover"
        />

        {/* Bottom Reply Bar */}
        <div className="absolute bottom-4 left-3 right-3 z-30 flex items-center gap-3">
          <div className="flex-1 border border-white/40 bg-black/30 backdrop-blur-md rounded-full px-4 py-2.5 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Responder a ${activeStory.user.username}...`}
              className="w-full bg-transparent text-xs text-white placeholder:text-white/70 focus:outline-none"
            />
            {replyText.trim() && (
              <button
                onClick={() => {
                  alert(`Resposta enviada para ${activeStory.user.username}!`);
                  setReplyText('');
                }}
                className="text-white hover:text-sky-300"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleSendHeart}
            className="w-10 h-10 rounded-full border border-white/40 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ff3040] hover:scale-110 transition-transform"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
