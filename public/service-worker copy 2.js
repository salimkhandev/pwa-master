// Injection point for the precache manifest
self.__WB_MANIFEST


const CACHE_NAME = 'pwa-cache1';


const OFFLINE_PAGES = [
    '/public/offline.html',
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('🚀 Service Worker: Installation Started');
            // Cache files one by one to handle failures gracefully
            for (const file of OFFLINE_PAGES) {
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


self.addEventListener('fetch', (event) => {
    console.log('🚀 Service Worker: Fetch event triggered', event.request.url);

    if (
        !event.request.url.startsWith(self.location.origin) ||
        event.request.url.startsWith('chrome-extension://') ||
        event.request.method !== 'GET'
    ) {
        return;
    }

    if (event.request.url.toLowerCase().includes('/contact')) {
        console.log('❌ Not caching this page:', event.request.url);
        return fetch(event.request); // Just fetch without caching
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('✅ Serving from Cache:', event.request.url);
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                const responseToCache = response.clone();
                
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                        console.log('📥 Cached after Network Fetch:', event.request.url);
                    });
                }
                return response;
            })
            .catch((error) => {
                // Handle network errors or other fetch failures
                return new Response('', {
                    status: 302,
                    headers: {
                        'Location': '/fallback' // Replace with your error page path
                    }
                });
            })
        })
    );
});
