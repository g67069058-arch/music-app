'use client';

import { Heart, Music } from 'lucide-react';
import { useLibraryStore } from '@/store';
import { TrackRow } from '@/components/library/TrackCard';
import { PlaylistRow } from '@/components/library/PlaylistCard';
import { SAMPLE_TRACKS } from '@/lib/musicData';

export function LibraryView() {
  const { playlists, setActiveView } = useLibraryStore();

  return (
    <div className="px-4 pb-36 pt-6">
      <h1 className="text-3xl font-bold text-white mb-6">Your Library</h1>

      <section className="mb-8">
        <h2 className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-3">
          Playlists
        </h2>
        <div className="space-y-1">
          {playlists.map((playlist) => (
            <PlaylistRow key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-3">
          All Tracks
        </h2>
        <div className="space-y-1">
          {SAMPLE_TRACKS.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              showIndex
              queue={SAMPLE_TRACKS}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export function FavoritesView() {
  const { favorites } = useLibraryStore();
  const favoriteTracks = SAMPLE_TRACKS.filter((t) => favorites.includes(t.id));

  return (
    <div className="px-4 pb-36 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-accent-primary/20 rounded-2xl flex items-center justify-center">
          <Heart size={22} className="text-accent-primary fill-accent-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Favorites</h1>
          <p className="text-sm text-ink-300">{favoriteTracks.length} tracks</p>
        </div>
      </div>

      {favoriteTracks.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="text-ink-700 mx-auto mb-4" />
          <p className="text-ink-300 text-sm">No favorites yet</p>
          <p className="text-ink-500 text-xs mt-1">Tap the heart icon on any track to save it</p>
        </div>
      ) : (
        <div className="space-y-1">
          {favoriteTracks.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              showIndex
              queue={favoriteTracks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
