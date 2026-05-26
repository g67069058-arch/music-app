'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX,
  Heart, ChevronDown, ListMusic, Maximize2
} from 'lucide-react';
import { usePlayerStore, useLibraryStore } from '@/store';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { formatTime, cn } from '@/lib/utils';
import { Equalizer } from '@/components/ui/Equalizer';

interface NowPlayingBarProps {
  onExpand: () => void;
}

export function NowPlayingBar({ onExpand }: NowPlayingBarProps) {
  const {
    currentTrack, isPlaying, volume, isMuted,
    shuffle, repeat, progress, currentTime, duration,
    setIsPlaying, setVolume, toggleShuffle, toggleRepeat,
    toggleMute, playNext, playPrevious,
  } = usePlayerStore();
  const { toggleFavorite, isFavorite, setActiveView } = useLibraryStore();
  const { seek } = useAudioEngine();
  const progressBarRef = useRef<HTMLDivElement>(null);

  const favorited = currentTrack ? isFavorite(currentTrack.id) : false;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, pct)));
  }, [seek]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  if (!currentTrack) return null;

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
      {/* Glassmorphism bar */}
      <div className="relative mx-2 mb-2 md:mx-0 md:mb-0 rounded-2xl md:rounded-none overflow-hidden">
        {/* Blurred bg */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(13,13,20,0.92) 0%, rgba(26,255,140,0.04) 100%)`,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        />

        {/* Progress bar - thin at top */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 right-0 h-0.5 cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          <div className="h-full bg-ink-700" />
          <div
            className="absolute top-0 left-0 h-full bg-accent-primary transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="relative flex items-center gap-3 px-4 py-3">
          {/* Album art - tap to expand */}
          <button
            onClick={onExpand}
            className="flex-shrink-0 relative w-12 h-12 rounded-xl overflow-hidden shadow-lg active:scale-95 transition-transform"
          >
            <Image
              src={currentTrack.coverArt}
              alt={currentTrack.album}
              fill
              className="object-cover"
              sizes="48px"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Equalizer isPlaying={true} className="h-3" />
              </div>
            )}
          </button>

          {/* Track info */}
          <button onClick={onExpand} className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-white text-sm truncate leading-tight">
              {currentTrack.title}
            </p>
            <p className="text-xs text-ink-300 truncate leading-tight mt-0.5">
              {currentTrack.artist}
            </p>
          </button>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all"
            >
              <Heart
                size={18}
                className={favorited ? 'fill-accent-primary text-accent-primary' : 'text-ink-300'}
              />
            </button>

            <button
              onClick={() => playPrevious()}
              className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all"
            >
              <SkipBack size={20} className="text-white fill-white" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center shadow-glow-green active:scale-90 transition-all"
            >
              {isPlaying
                ? <Pause size={18} className="fill-black text-black" />
                : <Play size={18} className="fill-black text-black ml-0.5" />
              }
            </button>

            <button
              onClick={() => playNext()}
              className="p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all"
            >
              <SkipForward size={20} className="text-white fill-white" />
            </button>
          </div>
        </div>

        {/* Desktop: extended controls */}
        <div className="hidden md:flex items-center gap-4 px-6 pb-3">
          {/* Left: time */}
          <span className="text-xs text-ink-300 tabular-nums w-10">{formatTime(currentTime)}</span>

          {/* Progress */}
          <div
            ref={progressBarRef}
            className="flex-1 h-1 bg-ink-700 rounded-full cursor-pointer group/bar relative"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-accent-primary rounded-full relative"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right: time */}
          <span className="text-xs text-ink-300 tabular-nums w-10 text-right">{formatTime(duration)}</span>

          {/* Extra controls */}
          <button onClick={toggleShuffle} className={cn('p-1.5 rounded-full hover:bg-white/10 transition-all', shuffle ? 'text-accent-primary' : 'text-ink-300')}>
            <Shuffle size={16} />
          </button>
          <button onClick={toggleRepeat} className={cn('p-1.5 rounded-full hover:bg-white/10 transition-all', repeat !== 'none' ? 'text-accent-primary' : 'text-ink-300')}>
            <RepeatIcon size={16} />
          </button>

          {/* Volume */}
          <button onClick={toggleMute} className="p-1.5 rounded-full hover:bg-white/10 text-ink-300 hover:text-white transition-all">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-accent-primary cursor-pointer"
          />

          {/* Queue */}
          <button
            onClick={() => setActiveView('queue')}
            className="p-1.5 rounded-full hover:bg-white/10 text-ink-300 hover:text-white transition-all"
          >
            <ListMusic size={16} />
          </button>

          {/* Expand */}
          <button
            onClick={onExpand}
            className="p-1.5 rounded-full hover:bg-white/10 text-ink-300 hover:text-white transition-all"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
