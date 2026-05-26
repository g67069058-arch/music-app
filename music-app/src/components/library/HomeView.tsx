'use client';

import { Clock, TrendingUp, Headphones } from 'lucide-react';
import { TrackCard, TrackRow } from '@/components/library/TrackCard';
import { PlaylistCard } from '@/components/library/PlaylistCard';
import { useLibraryStore } from '@/store';
import { SAMPLE_PLAYLISTS, FEATURED_TRACKS, NEW_RELEASES } from '@/lib/musicData';

export function HomeView() {
  const { recentlyPlayed } = useLibraryStore();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="px-4 pb-36 pt-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{greeting()}</h1>
        <p className="text-ink-300 mt-1">What do you want to listen to?</p>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-accent-primary" />
            <h2 className="text-base font-bold text-white">Recently Played</h2>
          </div>
          <div className="space-y-1">
            {recentlyPlayed.slice(0, 5).map((track) => (
              <TrackRow key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Playlists */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Your Playlists</h2>
          <button className="text-xs text-ink-300 hover:text-white transition-colors">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {SAMPLE_PLAYLISTS.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-accent-primary" />
          <h2 className="text-base font-bold text-white">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {FEATURED_TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} queue={FEATURED_TRACKS} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Headphones size={16} className="text-neon-purple" />
          <h2 className="text-base font-bold text-white">New Releases</h2>
        </div>
        <div className="space-y-1">
          {NEW_RELEASES.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              showIndex
              queue={NEW_RELEASES}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
