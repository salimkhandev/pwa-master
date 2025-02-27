import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";

// 🔹 Precache assets generated during build
precacheAndRoute(self.__WB_MANIFEST || []);

// 🔹 Cache API responses (NetworkFirst for dynamic data)
registerRoute(
    ({ url }) => url.origin === "https://pwa-testing-five.vercel.app",
    new StaleWhileRevalidate({
        cacheName: "api-cache",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
            }),
        ],
    })
);

// 🔹 Cache images (CacheFirst for better performance)
registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
        cacheName: "image-cache",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            }),
        ],
    })
);

// 🔹 Cache static assets (CSS, JS, Fonts)
registerRoute(
    ({ request }) => ["style", "script", "font"].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: "static-assets",
    })
);

// 🔹 Activate new SW immediately (skip waiting)
self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
    clients.claim();
});
