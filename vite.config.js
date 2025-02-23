import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        id: '/',
        name: 'My PWA App',
        short_name: 'PWA App',
        description: 'A Progressive Web App built with Vite and React',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: []
      },
      injectRegister: 'auto',
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: './src/sw.js',
        swDest: './dist/sw.js',
        globDirectory: './dist',
        injectionPoint: 'self.__WB_MANIFEST'
      },
      manifestFilename: 'manifest.webmanifest'
    }),
  ],
});
