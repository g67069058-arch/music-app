'use client';

import { useState, useEffect } from 'react';
import { useLibraryStore } from '@/store';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { NowPlayingBar } from '@/components/player/NowPlayingBar';
import { ExpandedPlayer } from '@/components/player/ExpandedPlayer';
import { BottomNav } from '@/components/ui/BottomNav';
import { HomeView } from '@/components/library/HomeView';
import { SearchView } from '@/components/library/SearchView';
import { LibraryView, FavoritesView } from '@/components/library/LibraryView';
import { QueueView } from '@/components/library/QueueView';
import { usePlayerStore } from '@/store';
import { InstallPrompt } from '@/components/ui/InstallPrompt';

export default function App() {
  const { activeView } = useLibraryStore();
  const { currentTrack } = usePlayerStore();
  const [expanded, setExpanded] = useState(false);

  // Initialize audio engine at top level - single instance
  useAudioEngine();

  // Close expanded player when track changes to nothing
  useEffect(() => {
    if (!currentTrack) setExpanded(false);
  }, [currentTrack]);

  // Prevent body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const renderView = () => {
    switch (activeView) {
      case 'home':     return <HomeView />;
      case 'search':   return <SearchView />;
      case 'library':  return <LibraryView />;
      case 'favorites': return <FavoritesView />;
      case 'queue':    return <QueueView />;
      default:         return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 relative" style={{ background: '#060608' }}>
      {/* Ambient mesh background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(26,255,140,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(180,79,255,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 50%, rgba(255,60,172,0.02) 0%, transparent 40%)
          `,
        }}
      />

      {/* Main scrollable content */}
      <main className="relative overflow-y-auto h-screen page-enter">
        {renderView()}
      </main>

      {/* Fixed bottom UI */}
      {currentTrack && (
        <NowPlayingBar onExpand={() => setExpanded(true)} />
      )}
      <BottomNav />

      {/* Full-screen expanded player */}
      {expanded && (
        <ExpandedPlayer onClose={() => setExpanded(false)} />
      )}

      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}
