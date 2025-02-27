import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
            console.log("🚀 Service Worker registered successfully");
            console.log("📍 Scope:", registration.scope);
            
            registration.addEventListener('updatefound', () => {
                console.log("🔄 New Service Worker update found!");
            });
        })
        .catch((error) => {
            console.error("❌ Service Worker registration failed:", error);
        });

    navigator.serviceWorker.ready.then(() => {
        console.log("✅ Service Worker is active and ready!");
    });
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
