'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  ChevronDown, Heart, MoreHorizontal,
  SkipBack, SkipForward, Play, Pause,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, ListMusic
} from 'lucide-react';
import { usePlayerStore, useLibraryStore } from '@/store';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { formatTime, cn } from '@/lib/utils';
import { Equalizer } from '@/components/ui/Equalizer';

interface ExpandedPlayerProps {
  onClose: () => void;
}

export function ExpandedPlayer({ onClose }: ExpandedPlayerProps) {
  const {
    currentTrack, isPlaying, volume, isMuted,
    shuffle, repeat, progress, currentTime, duration,
    setIsPlaying, setVolume, toggleShuffle, toggleRepeat,
    toggleMute, playNext, playPrevious,
  } = usePlayerStore();
  const { toggleFavorite, isFavorite, setActiveView } = useLibraryStore();
  const { seek } = useAudioEngine();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const favorited = currentTrack ? isFavorite(currentTrack.id) : false;

  const handleProgressInteraction = useCallback((clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, pct)));
  }, [seek]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleProgressInteraction(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleProgressInteraction(e.touches[0].clientX);
  };

  if (!currentTrack) return null;

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-slide-up" style={{ background: 'rgba(6,6,8,0.98)' }}>
      {/* Dynamic color bg from album art */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at top, rgba(26,255,140,0.3) 0%, transparent 60%),
                       radial-gradient(ellipse at bottom, rgba(180,79,255,0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col h-full px-6 pt-safe-top">
        {/* Header */}
        <div className="flex items-center justify-between py-4 pt-10">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all"
          >
            <ChevronDown size={24} className="text-white" />
          </button>
          <div className="text-center">
            <p className="text-xs text-ink-300 uppercase tracking-widest font-medium">Now Playing</p>
            <p className="text-sm text-white font-medium mt-0.5 truncate max-w-[180px]">
              {currentTrack.album}
            </p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all">
            <MoreHorizontal size={22} className="text-white" />
          </button>
        </div>

        {/* Album art - main focal point */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div
            className={cn(
              'relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500',
              isPlaying ? 'w-72 h-72 md:w-80 md:h-80' : 'w-60 h-60 md:w-72 md:h-72',
            )}
            style={{
              boxShadow: isPlaying
                ? '0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(26,255,140,0.15)'
                : '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            <Image
              src={currentTrack.coverArt}
              alt={currentTrack.album}
              fill
              className={cn(
                'object-cover transition-transform duration-700',
                isPlaying && 'scale-105'
              )}
              sizes="320px"
              priority
            />
            {/* Subtle overlay when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={28} className="fill-white text-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Track info + favorite */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white truncate leading-tight">
                {currentTrack.title}
              </h1>
              {isPlaying && <Equalizer isPlaying={true} className="flex-shrink-0" />}
            </div>
            <p className="text-ink-300 mt-1 truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-2 rounded-full active:scale-90 transition-all"
          >
            <Heart
              size={26}
              className={cn(
                'transition-all duration-300',
                favorited
                  ? 'fill-accent-primary text-accent-primary drop-shadow-[0_0_8px_rgba(26,255,140,0.6)]'
                  : 'text-ink-300'
              )}
            />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div
            ref={progressBarRef}
            className="relative h-1 bg-ink-700 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
            onTouchMove={handleTouchMove}
            onTouchStart={(e) => handleProgressInteraction(e.touches[0].clientX)}
          >
            <div
              className="h-full bg-accent-primary rounded-full relative"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg -mr-2" />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-ink-300 tabular-nums">{formatTime(currentTime)}</span>
            <span className="text-xs text-ink-300 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={toggleShuffle}
            className={cn(
              'p-3 rounded-full transition-all active:scale-90',
              shuffle ? 'text-accent-primary' : 'text-ink-300 hover:text-white'
            )}
          >
            <Shuffle size={22} />
          </button>

          <button
            onClick={playPrevious}
            className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all"
          >
            <SkipBack size={32} className="fill-white text-white" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              'w-18 h-18 rounded-full flex items-center justify-center transition-all active:scale-90',
              'bg-accent-primary shadow-glow-green',
            )}
            style={{ width: 72, height: 72 }}
          >
            {isPlaying
              ? <Pause size={32} className="fill-black text-black" />
              : <Play size={32} className="fill-black text-black ml-1" />
            }
          </button>

          <button
            onClick={playNext}
            className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all"
          >
            <SkipForward size={32} className="fill-white text-white" />
          </button>

          <button
            onClick={toggleRepeat}
            className={cn(
              'p-3 rounded-full transition-all active:scale-90',
              repeat !== 'none' ? 'text-accent-primary' : 'text-ink-300 hover:text-white'
            )}
          >
            <RepeatIcon size={22} />
          </button>
        </div>

        {/* Volume + Queue */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={toggleMute} className="text-ink-300 hover:text-white transition-colors active:scale-90">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-accent-primary cursor-pointer h-1"
          />
          <button
            onClick={() => { setActiveView('queue'); onClose(); }}
            className="text-ink-300 hover:text-white transition-colors active:scale-90"
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
