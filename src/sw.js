import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

// 🔹 Precache assets generated during build

//precacheAndRoute(self.__WB_MANIFEST || []);

// Contact pages and assets - Always network (MUST BE FIRST)
registerRoute(
    ({ url, request }) => {
        const pathname = url.pathname.toLowerCase();
        // Match both the page and its assets
        return pathname.includes('contact') || 
               pathname.includes('/assets/contact-');
    },
    new NetworkOnly()
);

// Cache images
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

// Cache static assets (CSS, JS, Fonts) EXCEPT contact
registerRoute(
    ({ request, url }) => {
        const pathname = url.pathname.toLowerCase();
        // Don't cache contact-related files
        if (pathname.includes('contact')) {
            return false;
        }
        // Cache other static assets
        return ["style", "script", "font"].includes(request.destination);
    },
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

// Handle navigation routes EXCEPT contact
registerRoute(
    ({ url }) => {
        const pathname = url.pathname.toLowerCase();
        // Cache home, about routes and their assets
        return pathname === '/' || 
               pathname.includes('about') || 
               pathname.includes('/assets/about-') ||
               pathname.includes('home') ||
               pathname.includes('/assets/home-');
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
