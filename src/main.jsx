import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register service worker
async function registerSW() {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                type: 'module'
            });
            
            // console.log("🚀 Service Worker registered successfully");
            // console.log("📍 Scope:", registration.scope);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                // console.log("🔄 New Service Worker state:", newWorker.state);
                
                newWorker.addEventListener('statechange', () => {
                    // console.log("👷 Service Worker state changed:", newWorker.state);
                });
            });

            await navigator.serviceWorker.ready;
            // console.log("✅ Service Worker is active and ready!");
            
        } catch (error) {
            console.error("❌ Service Worker registration failed:", error);
        }
    }
}

registerSW();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
