import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

const CACHE_NAME = 'myv1';

self.skipWaiting();
clientsClaim();

// Precache and route from Workbox manifest
precacheAndRoute(self.__WB_MANIFEST || []);

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...', event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.webmanifest'
        ]);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 