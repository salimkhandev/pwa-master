const CACHE_NAME = 'vite-react-cache-v1';
const FILES_TO_CACHE = [
  '/@react-refresh',
  '/@vite/client',
  '/about',
  '/contact',
  '/node_modules/.vite/deps/chunk-3ISELJEO.js?v=c83a27b1',
  '/node_modules/.vite/deps/chunk-6LRINAN2.js?v=c83a27b1', 
  '/node_modules/.vite/deps/react-dom_client.js?v=c83a27b1',
  '/node_modules/.vite/deps/react-router-dom.js?v=c83a27b1',    
  '/node_modules/.vite/deps/react.js?v=c83a27b1',
  '/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c83a27b1',
  '/node_modules/vite/dist/client/env.mjs',
  '/src/App.css',
  '/src/App.jsx',
  '/src/components/About.jsx',
  '/src/components/Contact.jsx',
  '/src/components/Home.jsx',
  '/src/index.css',
  '/src/main.jsx',
  '/vite.svg',
  '/manifest.json',
  '/icons-pwa/android-chrome-192x192.png',
  '/icons-pwa/android-chrome-512x512.png',
  '/icons-pwa/apple-touch-icon.png',
  '/icons-pwa/favicon-32x32.png',
  '/icons-pwa/favicon-16x16.png',
  '/icons-pwa/favicon.ico',
  '/screenshots/desktop.png',
  '/screenshots/mobile.png'
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('Cache opened');
            // Cache files one by one to handle failures gracefully
            for (const file of FILES_TO_CACHE) {
                try {
                    await cache.add(new Request(file, { cache: 'reload' }));
                    console.log('Cached:', file);
                } catch (error) {
                    console.warn('Failed to cache:', file, error);
                }
            }
        })
    );
    self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event: Network first, then cache
self.addEventListener('fetch', (event) => {
    // Only handle same-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response
                const responseToCache = response.clone();

                // Only cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Only cache same-origin responses
                            if (event.request.url.startsWith(self.location.origin)) {
                                cache.put(event.request, responseToCache);
                                console.log('Cached:😂', event.request.url);
                            }
                        });
                }

                return response;
            })
            .catch(() => {
                // If network fails, try to get from cache
                return caches.match(event.request);
            })
    );
});
