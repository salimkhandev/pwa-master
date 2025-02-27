import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

// 🔹 Precache assets generated during build

precacheAndRoute(self.__WB_MANIFEST || []);

// 🔹 Cache static assets (CSS, JS, Fonts)
registerRoute(
    ({ request }) => ["style", "script", "font"].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            })
        ]
    })
);

// 🔹 Cache images
registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
        cacheName: "images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            })
        ]
    })
);

// 🔹 Handle navigation routes
registerRoute(
    ({ url }) => {
        // Don't cache the contact page
        if (url.pathname === '/contact') {
            return false;
        }
        // Cache other navigation routes (home, about, etc.)
        return url.pathname === '/' || 
               url.pathname === '/about' || 
               url.pathname.startsWith('/home');
    },
    new StaleWhileRevalidate({
        cacheName: "pages",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            })
        ]
    })
);

// 🔹 Contact page - Always network
registerRoute(
    ({ url }) => url.pathname === '/contact',
    new NetworkOnly()
);

// 🔹 Activate new SW immediately (skip waiting)
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete old caches if needed
                        if (cacheName.startsWith('workbox-') || 
                            cacheName.startsWith('static-resources') || 
                            cacheName.startsWith('images') || 
                            cacheName.startsWith('pages')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});
