import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

// Add version tracking
const VERSION = '1.0.0';
console.log('🔧 Service Worker Loading... Version:', VERSION);

// Precache assets from the manifest
precacheAndRoute(self.__WB_MANIFEST);

// 📞 Contact Route Strategy
registerRoute(
    ({ url }) => {
        const pathname = url.pathname.toLowerCase();
        console.log('🔍 Checking route:', pathname);
        // Match both the page and its assets
        const isContact = pathname.includes('contact') || 
                         pathname.includes('/assets/contact-');
        if (isContact) {
            console.log('🚫 Contact route detected - Using Network Only');
        }
        return isContact;
    },
    new NetworkOnly({
        plugins: [
            {
                requestWillFetch: async ({ request }) => {
                    console.log('🌐 Network request for contact:', request.url);
                    return request;
                }
            }
        ]
    })
);

// 🖼️ Image Caching Strategy
registerRoute(
    ({ request }) => {
        const isImage = request.destination === "image";
        if (isImage) {
            console.log('🖼️ Caching image:', request.url);
        }
        return isImage;
    },
    new CacheFirst({
        cacheName: `images-${VERSION}`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }),
            {
                cacheDidUpdate: async ({ request }) => {
                    console.log('💾 Updated image cache:', request.url);
                }
            }
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
            console.log('📦 Handling static asset:', pathname);
        }
        return isStatic;
    },
    new StaleWhileRevalidate({
        cacheName: `static-resources-${VERSION}`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }),
            {
                cacheDidUpdate: async ({ request }) => {
                    console.log('🔄 Updated static cache:', request.url);
                }
            }
        ]
    })
);

// 🧭 Navigation Routes Strategy
registerRoute(
    ({ request, url }) => {
        const pathname = url.pathname.toLowerCase();
        console.log('🧭 Navigation Check:', pathname);
        
        // List of paths to exclude from caching
        const excludedPaths = [
            'contact',    // Contact page and its assets
            'api',        // If you have any API calls
            'logout',     // Example: logout route
            // Add more paths to exclude here
        ];
        
        // Check if the path contains any excluded paths
        const isExcluded = excludedPaths.some(path => pathname.includes(path));
        
        if (isExcluded) {
            console.log('⛔ Excluding from cache:', pathname);
            return false;
        }

        // For navigation requests (page loads)
        if (request.mode === 'navigate') {
            console.log('🏠 Caching navigation route:', pathname);
            return true;
        }

        // For page assets
        if (pathname.includes('/assets/')) {
            console.log('📦 Caching page asset:', pathname);
            return true;
        }

        console.log('✅ Default caching for:', pathname);
        return true;
    },
    new StaleWhileRevalidate({
        cacheName: `pages-${VERSION}`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }),
            {
                cacheDidUpdate: async ({ request }) => {
                    console.log('📄 Updated page cache:', request.url);
                }
            }
        ]
    })
);

// Service Worker Lifecycle Events
self.addEventListener("install", () => {
    console.log('🚀 Service Worker installing... Version:', VERSION);
    console.log('⏩ Skipping waiting phase...');
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log('✨ Service Worker activating... Version:', VERSION);
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches from previous versions
            caches.keys().then(cacheNames => {
                console.log('🧹 Checking for outdated caches...');
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Delete caches that don't match current version
                        if (!cacheName.includes(VERSION) && 
                            (cacheName.startsWith('workbox-') || 
                             cacheName.startsWith('static-resources') || 
                             cacheName.startsWith('images') || 
                             cacheName.startsWith('pages'))) {
                            console.log('🗑️ Deleting outdated cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim().then(() => {
                console.log('👑 Service Worker Version', VERSION, 'is now active');
            })
        ])
    );
});
