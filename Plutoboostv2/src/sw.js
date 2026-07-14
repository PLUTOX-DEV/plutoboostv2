// src/sw.js
/// <reference lib="webworker" />

const CACHE_NAME = 'plutoboost-v2' // Changed version to force update
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pl.png',
  '/manifest.webmanifest',
]

// Assets that should be cached but updated frequently
const DYNAMIC_ASSETS = [
  'index.html',
  'pl.png',
]

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache only essential static files
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('plutoboost-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Don't cache API requests
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Network-first strategy for HTML pages
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fetched HTML for offline use
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cached HTML if network fails
          return caches.match(request)
            .then((cached) => {
              if (cached) {
                return cached;
              }
              // If nothing is cached, return the offline page
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Cache-first with network update for static assets
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            // Return cached version immediately
            // Then update cache in background
            fetch(request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                  });
                }
              })
              .catch(() => {
                // Network failed, keep using cached version
              });
            return cached;
          }
          // If not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            });
        })
    );
    return;
  }

  // Default: Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for future offline use
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle message events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});