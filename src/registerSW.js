import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Show a prompt to user about new content being available
      console.log('New content available, please refresh')
    },
    onOfflineReady() {
      // Show a ready to work offline to user
      console.log('App ready to work offline')
    },
  })
} 