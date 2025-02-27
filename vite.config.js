import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: "/public/service-worker.js",
      filename: "service-worker.js",
      manifest: false, // Use the existing manifest.json from public directory
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
});