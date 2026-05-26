'use client';

import Image from 'next/image';
import { Play, Music } from 'lucide-react';
import { Playlist } from '@/types';
import { usePlayerStore } from '@/store';
import { cn } from '@/lib/utils';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick?: () => void;
}

export function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  const { playTrack, setQueue } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks.length === 0) return;
    const [first, ...rest] = playlist.tracks;
    playTrack(first, rest);
  };

  return (
    <div
      className="group relative cursor-pointer flex-shrink-0 w-44"
      onClick={onClick}
    >
      <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-card mb-3">
        {playlist.tracks.length >= 4 ? (
          <div className="grid grid-cols-2 h-full">
            {playlist.tracks.slice(0, 4).map((track, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={track.coverArt}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </div>
            ))}
          </div>
        ) : (
          <Image
            src={playlist.coverArt}
            alt={playlist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="176px"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center shadow-glow-green transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          <Play size={18} className="fill-black text-black ml-0.5" />
        </button>
      </div>
      <p className="font-semibold text-sm text-white truncate">{playlist.name}</p>
      <p className="text-xs text-ink-300 mt-0.5">
        {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
      </p>
    </div>
  );
}

interface PlaylistRowProps {
  playlist: Playlist;
  onClick?: () => void;
}

export function PlaylistRow({ playlist, onClick }: PlaylistRowProps) {
  const { playTrack } = usePlayerStore();

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200 group"
      onClick={onClick}
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        {playlist.tracks.length >= 4 ? (
          <div className="grid grid-cols-2 h-full">
            {playlist.tracks.slice(0, 4).map((track, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image src={track.coverArt} alt="" fill className="object-cover" sizes="28px" />
              </div>
            ))}
          </div>
        ) : (
          <Image
            src={playlist.coverArt}
            alt={playlist.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{playlist.name}</p>
        <p className="text-xs text-ink-300 mt-0.5">
          Playlist · {playlist.tracks.length} tracks
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (playlist.tracks.length > 0) {
            const [first, ...rest] = playlist.tracks;
            playTrack(first, rest);
          }
        }}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center"
      >
        <Play size={14} className="fill-black text-black ml-0.5" />
      </button>
    </div>
  );
}
