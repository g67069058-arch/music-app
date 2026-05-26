'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore, useLibraryStore } from '@/store';

export function useAudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeat,
    setIsPlaying,
    setProgress,
    setCurrentTime,
    setDuration,
    playNext,
    playPrevious,
  } = usePlayerStore();
  const { addRecentlyPlayed } = useLibraryStore();

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      // Critical for background playback on mobile
      audio.setAttribute('playsinline', 'true');
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented:', err);
          setIsPlaying(false);
        });
      }
    }

    addRecentlyPlayed(currentTrack);
    updateMediaSession(currentTrack);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Handle volume/mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const dur = audio.duration || 0;
      setCurrentTime(current);
      setProgress(dur > 0 ? current / dur : 0);

      // Update Media Session position state
      if ('mediaSession' in navigator && dur > 0) {
        try {
          navigator.mediaSession.setPositionState({
            duration: dur,
            playbackRate: audio.playbackRate,
            position: current,
          });
        } catch {}
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [repeat, playNext, setCurrentTime, setProgress, setDuration, setIsPlaying]);

  // Media Session API - lock screen controls
  const updateMediaSession = useCallback((track: typeof currentTrack) => {
    if (!track || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.coverArt, sizes: '96x96', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '128x128', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '192x192', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '256x256', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '384x384', type: 'image/jpeg' },
        { src: track.coverArt, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => {
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNext();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrevious();
    });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      const audio = audioRef.current;
      if (audio && details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
      }
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + (details.seekOffset || 10));
      }
    });
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
      }
    });
  }, [setIsPlaying, playNext, playPrevious]);

  // Update Media Session when track changes
  useEffect(() => {
    updateMediaSession(currentTrack);
  }, [currentTrack, updateMediaSession]);

  // Seek function
  const seek = useCallback((progress: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = progress * audio.duration;
  }, []);

  return { audioRef, seek };
}
