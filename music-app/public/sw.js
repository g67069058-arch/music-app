// Soundwave Service Worker
// Handles background audio playback, caching, and media notifications

const CACHE_NAME = 'soundwave-v1';
const AUDIO_CACHE = 'soundwave-audio-v1';

// Assets to precache for offline
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== AUDIO_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Audio files: cache-first for performance, network fallback
  if (
    request.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.ogg') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.m4a')
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return cached || new Response('Audio unavailable offline', { status: 503 });
        }
      })
    );
    return;
  }

  // Images: stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        });
        return cached || networkPromise;
      })
    );
    return;
  }

  // Everything else: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Keep service worker alive during audio playback
// This prevents Android from killing it
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'PING') {
    event.source?.postMessage('PONG');
  }
});
