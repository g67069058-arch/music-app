'use client';

import Image from 'next/image';
import { Heart, MoreHorizontal, Play, Plus } from 'lucide-react';
import { Track } from '@/types';
import { usePlayerStore, useLibraryStore } from '@/store';
import { formatTime, cn } from '@/lib/utils';
import { Equalizer } from '@/components/ui/Equalizer';
import { SAMPLE_TRACKS } from '@/lib/musicData';

interface TrackRowProps {
  track: Track;
  index?: number;
  showIndex?: boolean;
  queue?: Track[];
  compact?: boolean;
}

export function TrackRow({ track, index, showIndex, queue, compact }: TrackRowProps) {
  const { playTrack, currentTrack, isPlaying, addToQueue } = usePlayerStore();
  const { toggleFavorite, isFavorite } = useLibraryStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const favorited = isFavorite(track.id);

  const handlePlay = () => {
    playTrack(track, queue || SAMPLE_TRACKS);
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200',
        'hover:bg-white/5',
        isCurrentTrack && 'bg-white/8',
        compact && 'py-1.5'
      )}
      onClick={handlePlay}
    >
      {/* Index / Equalizer */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {isCurrentTrack ? (
          <Equalizer isPlaying={isPlaying} />
        ) : showIndex && index !== undefined ? (
          <span className="text-sm text-ink-300 group-hover:hidden">{index + 1}</span>
        ) : null}
        <Play
          size={14}
          className={cn(
            'text-white fill-white',
            isCurrentTrack ? 'hidden' : 'hidden group-hover:block'
          )}
        />
      </div>

      {/* Cover art */}
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
        <Image
          src={track.coverArt}
          alt={track.album}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate text-sm',
          isCurrentTrack ? 'text-accent-primary' : 'text-white'
        )}>
          {track.title}
        </p>
        <p className="text-xs text-ink-300 truncate">{track.artist}</p>
      </div>

      {/* Duration + actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full',
            favorited && 'opacity-100'
          )}
        >
          <Heart
            size={15}
            className={favorited ? 'fill-accent-primary text-accent-primary' : 'text-ink-300'}
          />
        </button>
        <span className="text-xs text-ink-300 tabular-nums w-8 text-right">
          {formatTime(track.duration)}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:bg-white/10"
        >
          <Plus size={14} className="text-ink-300" />
        </button>
      </div>
    </div>
  );
}

interface TrackCardProps {
  track: Track;
  queue?: Track[];
}

export function TrackCard({ track, queue }: TrackCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const { toggleFavorite, isFavorite } = useLibraryStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const favorited = isFavorite(track.id);

  return (
    <div
      className="group relative cursor-pointer flex-shrink-0 w-40"
      onClick={() => playTrack(track, queue || SAMPLE_TRACKS)}
    >
      <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-card mb-3">
        <Image
          src={track.coverArt}
          alt={track.album}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="160px"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center shadow-glow-green transform scale-90 group-hover:scale-100 transition-transform duration-300">
            {isCurrentTrack && isPlaying ? (
              <Equalizer isPlaying={true} color="#000" className="h-5" />
            ) : (
              <Play size={20} className="fill-black text-black ml-0.5" />
            )}
          </div>
        </div>
        {/* Current track indicator */}
        {isCurrentTrack && (
          <div className="absolute bottom-2 right-2">
            <Equalizer isPlaying={isPlaying} />
          </div>
        )}
      </div>
      <p className={cn(
        'font-semibold text-sm truncate',
        isCurrentTrack ? 'text-accent-primary' : 'text-white'
      )}>
        {track.title}
      </p>
      <p className="text-xs text-ink-300 truncate">{track.artist}</p>

      {/* Favorite button */}
      <button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 bg-black/60 backdrop-blur-sm rounded-full"
        onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
      >
        <Heart
          size={14}
          className={favorited ? 'fill-accent-primary text-accent-primary' : 'text-white'}
        />
      </button>
    </div>
  );
}
