'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useLibraryStore } from '@/store';
import { TrackRow } from '@/components/library/TrackCard';
import { SAMPLE_TRACKS } from '@/lib/musicData';

const GENRES = ['Lo-Fi', 'Jazz', 'Electronic', 'Ambient', 'House', 'Synthwave', 'Indie', 'Soul', 'Acoustic'];

export function SearchView() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SAMPLE_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre?.toLowerCase().includes(q)
    );
  }, [query]);

  const genreResults = (genre: string) =>
    SAMPLE_TRACKS.filter((t) => t.genre === genre);

  return (
    <div className="px-4 pb-36 pt-6">
      <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artists, songs, podcasts"
          className="w-full bg-ink-800 text-white placeholder-ink-300 pl-11 pr-11 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all text-sm"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim() ? (
        <div>
          <p className="text-xs text-ink-300 uppercase tracking-widest font-semibold mb-3">
            {results.length} Results
          </p>
          {results.length === 0 ? (
            <div className="text-center py-16 text-ink-300">
              <p className="text-sm">No results for "{query}"</p>
              <p className="text-xs mt-1">Try a different search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((track, i) => (
                <TrackRow key={track.id} track={track} index={i} queue={results} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-base font-bold text-white mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 gap-3">
            {GENRES.map((genre, i) => {
              const colors = [
                'from-neon-green/30 to-neon-green/5',
                'from-neon-purple/30 to-neon-purple/5',
                'from-neon-pink/30 to-neon-pink/5',
                'from-neon-blue/30 to-neon-blue/5',
                'from-neon-orange/30 to-neon-orange/5',
                'from-neon-cyan/30 to-neon-cyan/5',
                'from-neon-green/20 to-neon-purple/10',
                'from-neon-pink/20 to-neon-orange/10',
                'from-neon-blue/20 to-neon-cyan/10',
              ];
              const borderColors = [
                'border-neon-green/20', 'border-neon-purple/20', 'border-neon-pink/20',
                'border-neon-blue/20', 'border-neon-orange/20', 'border-neon-cyan/20',
                'border-neon-green/15', 'border-neon-pink/15', 'border-neon-blue/15',
              ];
              const tracks = genreResults(genre);
              return (
                <button
                  key={genre}
                  onClick={() => setQuery(genre)}
                  className={`relative overflow-hidden rounded-2xl p-4 text-left bg-gradient-to-br ${colors[i % colors.length]} border ${borderColors[i % borderColors.length]} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
                >
                  <p className="font-bold text-white">{genre}</p>
                  <p className="text-xs text-ink-300 mt-0.5">{tracks.length} tracks</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
