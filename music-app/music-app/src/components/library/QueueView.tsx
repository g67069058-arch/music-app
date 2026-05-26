'use client';

import Image from 'next/image';
import { X, GripVertical, Play, Trash2 } from 'lucide-react';
import { usePlayerStore } from '@/store';
import { formatTime, cn } from '@/lib/utils';
import { Equalizer } from '@/components/ui/Equalizer';
import { Track } from '@/types';

export function QueueView() {
  const {
    queue, currentTrack, isPlaying, history,
    removeFromQueue, playTrack, reorderQueue,
  } = usePlayerStore();

  return (
    <div className="px-4 pb-32">
      {/* Now Playing */}
      {currentTrack && (
        <section className="mb-8">
          <h2 className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-3">
            Now Playing
          </h2>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent-primary/10 border border-accent-primary/20">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={currentTrack.coverArt} alt={currentTrack.album} fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-accent-primary truncate">{currentTrack.title}</p>
              <p className="text-sm text-ink-300 truncate">{currentTrack.artist}</p>
            </div>
            <Equalizer isPlaying={isPlaying} color="#1aff8c" />
          </div>
        </section>
      )}

      {/* Queue */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-ink-300 uppercase tracking-widest font-semibold">
            Next Up ({queue.length})
          </h2>
          {queue.length > 0 && (
            <button
              onClick={() => usePlayerStore.setState({ queue: [] })}
              className="text-xs text-ink-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <div className="text-center py-12 text-ink-300">
            <p className="text-sm">Queue is empty</p>
            <p className="text-xs mt-1">Add tracks to keep the music going</p>
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map((track, index) => (
              <QueueItem
                key={`${track.id}-${index}`}
                track={track}
                index={index}
                onRemove={() => removeFromQueue(track.id)}
                onPlay={() => playTrack(track)}
              />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {history.length > 0 && (
        <section>
          <h2 className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-3">
            History
          </h2>
          <div className="space-y-1 opacity-60">
            {history.slice(0, 10).map((track, index) => (
              <div
                key={`hist-${track.id}-${index}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
                onClick={() => playTrack(track)}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={track.coverArt} alt="" fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{track.title}</p>
                  <p className="text-xs text-ink-300 truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-ink-400 tabular-nums">{formatTime(track.duration)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface QueueItemProps {
  track: Track;
  index: number;
  onRemove: () => void;
  onPlay: () => void;
}

function QueueItem({ track, index, onRemove, onPlay }: QueueItemProps) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all animate-fade-in">
      <GripVertical size={16} className="text-ink-600 flex-shrink-0 cursor-grab" />

      <div
        className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={onPlay}
      >
        <Image src={track.coverArt} alt="" fill className="object-cover" sizes="40px" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <Play size={14} className="fill-white text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onPlay}>
        <p className="text-sm font-medium text-white truncate">{track.title}</p>
        <p className="text-xs text-ink-300 truncate">{track.artist}</p>
      </div>

      <span className="text-xs text-ink-400 tabular-nums flex-shrink-0">{formatTime(track.duration)}</span>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-white/10 text-ink-300 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
