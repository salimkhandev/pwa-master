const CACHE_NAME = 'vite-react-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    // '/src/components/Contact.jsx', // Cache the Contact component
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache opened');
            return cache.addAll(FILES_TO_CACHE);

        })
    );
});

// Fetch event: Serve from cache if available
self.addEventListener('fetch', (event) => {
    console.log('Fetch event', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            console.log('Cached response ✅', cachedResponse.url);
            return cachedResponse || fetch(event.request);
        })
    );
});
