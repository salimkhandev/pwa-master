import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Service Worker Registration
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("🚀 Service Worker registered successfully");
        
        // Check for updates
        registration.onupdatefound = () => {
            const newSW = registration.installing;
            if (newSW) {
                console.log("🔄 New Service Worker found, installing...");
                
                newSW.onstatechange = () => {
                    if (newSW.state === "installed") {
                        if (navigator.serviceWorker.controller) {
                            console.log("🆕 New content is available!");
                            
                            // Show update notification
                            const updateNotification = document.createElement('div');
                            updateNotification.style.cssText = `
                                position: fixed;
                                bottom: 20px;
                                right: 20px;
                                background: #4CAF50;
                                color: white;
                                padding: 16px 24px;
                                border-radius: 8px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                z-index: 9999;
                                font-family: system-ui;
                            `;
                            
                            updateNotification.innerHTML = `
                                <span>🎉 New update available!</span>
                                <button onclick="window.location.reload()" style="
                                    background: white;
                                    color: #4CAF50;
                                    border: none;
                                    padding: 8px 16px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-weight: 500;
                                ">Refresh</button>
                            `;
                            
                            document.body.appendChild(updateNotification);
                        } else {
                            console.log("✨ Content is now cached for offline use");
                        }
                    }
                };
            }
        };
    }).catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
    });

    // Log when the service worker becomes active
    navigator.serviceWorker.ready.then(() => {
        console.log("✅ Service Worker is active and ready!");
    });
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
