import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track, Playlist, RepeatMode } from '@/types';
import { SAMPLE_TRACKS, SAMPLE_PLAYLISTS } from '@/lib/musicData';

interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  shuffle: boolean;
  repeat: RepeatMode;
  isMuted: boolean;

  // Actions
  setCurrentTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  reorderQueue: (from: number, to: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playTrack: (track: Track, queue?: Track[]) => void;
}

interface LibraryStore {
  tracks: Track[];
  playlists: Playlist[];
  favorites: string[];
  recentlyPlayed: Track[];
  searchQuery: string;
  activeView: 'home' | 'search' | 'library' | 'queue' | 'favorites';

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveView: (view: LibraryStore['activeView']) => void;
  toggleFavorite: (trackId: string) => void;
  addRecentlyPlayed: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  createPlaylist: (name: string, description?: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  history: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  currentTime: 0,
  shuffle: false,
  repeat: 'none',
  isMuted: false,

  setCurrentTrack: (track) => set({ currentTrack: track }),
  setQueue: (tracks) => set({ queue: tracks }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (trackId) =>
    set((state) => ({ queue: state.queue.filter((t) => t.id !== trackId) })),
  reorderQueue: (from, to) =>
    set((state) => {
      const newQueue = [...state.queue];
      const [removed] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, removed);
      return { queue: newQueue };
    }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () =>
    set((state) => {
      const modes: RepeatMode[] = ['none', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeat);
      return { repeat: modes[(currentIdx + 1) % modes.length] };
    }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  playNext: () => {
    const { queue, currentTrack, shuffle, repeat, history } = get();
    if (repeat === 'one' && currentTrack) {
      set({ currentTime: 0, progress: 0, isPlaying: true });
      return;
    }
    if (queue.length === 0) {
      if (repeat === 'all' && history.length > 0) {
        const track = history[0];
        set({ currentTrack: track, history: [], isPlaying: true, currentTime: 0 });
      } else {
        set({ isPlaying: false });
      }
      return;
    }
    let nextIdx = 0;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    }
    const nextTrack = queue[nextIdx];
    const newQueue = queue.filter((_, i) => i !== nextIdx);
    set({
      currentTrack: nextTrack,
      queue: newQueue,
      history: currentTrack ? [currentTrack, ...history].slice(0, 50) : history,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
    });
  },

  playPrevious: () => {
    const { history, currentTrack, queue } = get();
    if (history.length === 0) {
      set({ currentTime: 0, progress: 0 });
      return;
    }
    const prevTrack = history[0];
    const newHistory = history.slice(1);
    set({
      currentTrack: prevTrack,
      history: newHistory,
      queue: currentTrack ? [currentTrack, ...queue] : queue,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
    });
  },

  playTrack: (track, newQueue) => {
    const { currentTrack, queue } = get();
    const updatedHistory = currentTrack
      ? [currentTrack, ...get().history].slice(0, 50)
      : get().history;

    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
      history: updatedHistory,
      queue: newQueue !== undefined
        ? newQueue.filter((t) => t.id !== track.id)
        : queue,
    });
  },
}));

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      tracks: SAMPLE_TRACKS,
      playlists: SAMPLE_PLAYLISTS,
      favorites: [],
      recentlyPlayed: [],
      searchQuery: '',
      activeView: 'home',

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveView: (activeView) => set({ activeView }),

      toggleFavorite: (trackId) =>
        set((state) => ({
          favorites: state.favorites.includes(trackId)
            ? state.favorites.filter((id) => id !== trackId)
            : [...state.favorites, trackId],
        })),

      addRecentlyPlayed: (track) =>
        set((state) => ({
          recentlyPlayed: [
            track,
            ...state.recentlyPlayed.filter((t) => t.id !== track.id),
          ].slice(0, 20),
        })),

      isFavorite: (trackId) => get().favorites.includes(trackId),

      createPlaylist: (name, description) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: `playlist-${Date.now()}`,
              name,
              description,
              coverArt: SAMPLE_TRACKS[0].coverArt,
              tracks: [],
              createdAt: new Date(),
            },
          ],
        })),

      addToPlaylist: (playlistId, track) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId && !p.tracks.find((t) => t.id === track.id)
              ? { ...p, tracks: [...p.tracks, track] }
              : p
          ),
        })),
    }),
    {
      name: 'soundwave-library',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyPlayed: state.recentlyPlayed,
        playlists: state.playlists,
      }),
    }
  )
);
