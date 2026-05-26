export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  src: string; // direct audio URL
  coverArt: string;
  genre?: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt: string;
  tracks: Track[];
  createdAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number; // 0-1
  duration: number;
  currentTime: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  isMuted: boolean;
}

export interface LibraryState {
  tracks: Track[];
  playlists: Playlist[];
  favorites: Set<string>;
  recentlyPlayed: Track[];
  searchQuery: string;
  activeView: 'home' | 'search' | 'library' | 'queue' | 'favorites';
}

export type RepeatMode = 'none' | 'one' | 'all';
