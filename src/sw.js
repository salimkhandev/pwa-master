import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

// 🚫 Disabled precaching for custom control
//precacheAndRoute(self.__WB_MANIFEST || []);

// 📞 Contact Route Strategy
registerRoute(
    ({ url }) => {
        const pathname = url.pathname.toLowerCase();
        console.log('📞 Contact Route Check:', pathname);
        // Match both the page and its assets
        const isContact = pathname.includes('contact') || 
                         pathname.includes('/assets/contact-');
        if (isContact) {
            console.log('🚫 Contact route detected - Using Network Only');
        }
        return isContact;
    },
    new NetworkOnly()
);

// 🖼️ Image Caching Strategy
registerRoute(
    ({ request }) => {
        const isImage = request.destination === "image";
        if (isImage) {
            console.log('🖼️ Image request detected:', request.url);
        }
        return isImage;
    },
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

// 📦 Static Assets Strategy
registerRoute(
    ({ request, url }) => {
        const pathname = url.pathname.toLowerCase();
        console.log('📦 Static Asset Check:', pathname);
        
        // Don't cache contact-related files
        if (pathname.includes('contact')) {
            console.log('⏭️ Skipping contact asset:', pathname);
            return false;
        }
        
        const isStatic = ["style", "script", "font"].includes(request.destination);
        if (isStatic) {
            console.log('💾 Caching static asset:', pathname);
        }
        return isStatic;
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

// 🧭 Navigation Routes Strategy
registerRoute(
    ({ url }) => {
        const pathname = url.pathname.toLowerCase();
        console.log('🧭 Navigation Check:', pathname);
        
        const isNavigationRoute = pathname === '/' || 
                                pathname.includes('about') || 
                                pathname.includes('/assets/about-') ||
                                pathname.includes('home') ||
                                pathname.includes('/assets/home-');
        
        if (isNavigationRoute) {
            console.log('🏠 Handling navigation route:', pathname);
        }
        return isNavigationRoute;
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

// Service Worker Lifecycle Events
self.addEventListener("install", () => {
    console.log('🚀 Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log('🧹 Service Worker activating...');
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                console.log('🗑️ Cleaning old caches:', cacheNames);
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('workbox-') || 
                            cacheName.startsWith('static-resources') || 
                            cacheName.startsWith('images') || 
                            cacheName.startsWith('pages')) {
                            console.log('🗑️ Deleting cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim().then(() => {
                console.log('👑 Service Worker now controlling all clients');
            })
        ])
    );
});
