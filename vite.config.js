import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: false,
      useManifestFromFile: true,
      injectRegister: null,
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.js'
    })
  ],
})
