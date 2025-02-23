const CACHE_NAME = 'vite-react-cache-v6';
const FILES_TO_CACHE = [
    '/',
    '/about',
    '/contact',
    '/assets/About-YYOYwKwC.js',
    '/assets/Contact-cQmzpnLa.js',
    '/assets/Home-CM6lxlTi.js',
    '/assets/main-DlGfgnAx.css',
    '/assets/main-aZzdTF1E.js',
    '/icons-pwa/android-chrome-192x192.png',
    '/icons-pwa/android-chrome-512x512.png',
    '/icons-pwa/apple-touch-icon.png',
    '/icons-pwa/favicon-16x16.png',
    '/icons-pwa/favicon-32x32.png',
    '/icons-pwa/favicon.ico',
    '/manifest.json',
    '/screenshots/desktop.png',
    '/assets/main-DIGfgnAx.css',
    '/assets/main-DlGfgnAx.css',
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('🚀 Service Worker: Installation Started');
            // Cache files one by one to handle failures gracefully
            for (const file of FILES_TO_CACHE) {
                try {
                    await cache.add(new Request(file, { cache: 'reload' }));
                    console.log('✅ Cached Successfully:', file);
                } catch (error) {
                    console.warn('❌ Cache Failed:', file, error);
                }
            }
            console.log('🎉 Service Worker: Installation Complete');
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
                        console.log('🧹 Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log('💪 Service Worker: Activated');
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
                const responseToCache = response.clone();
                if (response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Only cache same-origin responses
                            if (event.request.url.startsWith(self.location.origin)) {
                                cache.put(event.request, responseToCache);
                                console.log('📥 Network Response Cached:', event.request.url);
                            }
                        });
                }
                console.log('🌐 Fetched from Network:', event.request.url);
                return response;
            })
            .catch(() => {
                console.log('📦 Falling back to Cache:', event.request.url);
                return caches.match(event.request);
            })
    );
});
