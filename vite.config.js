import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            injectRegister: null, // Disable automatic registration
            strategies: 'injectManifest',
            srcDir: "src",
            filename: "sw.js",
            manifest: {
                name: "Vite React PWA",
                short_name: "React PWA",
                description: "A Progressive Web App built with Vite and React",
                start_url: "/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#000000",
                orientation: "any",
                icons: [
                    {
                        src: "/icons-pwa/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons-pwa/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons-pwa/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons-pwa/favicon-32x32.png",
                        sizes: "32x32",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons-pwa/favicon-16x16.png",
                        sizes: "16x16",
                        type: "image/png",
                        purpose: "any"
                    }
                ],
                shortcuts: [
                    {
                        name: "Home",
                        url: "/",
                        icons: [{ src: "/icons-pwa/android-chrome-192x192.png", sizes: "192x192" }]
                    },
                    {
                        name: "About",
                        url: "/about",
                        icons: [{ src: "/icons-pwa/android-chrome-192x192.png", sizes: "192x192" }]
                    },
                    {
                        name: "Contact",
                        url: "/contact",
                        icons: [{ src: "/icons-pwa/android-chrome-192x192.png", sizes: "192x192" }]
                    }
                ]
            },
            devOptions: {
                enabled: true,
                type: 'module'
            }
        }),
    ],
});
