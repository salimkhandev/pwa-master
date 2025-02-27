import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Service Worker Registration and Lifecycle Management
if ("serviceWorker" in navigator) {
    // Function to show update notification
    function showUpdateNotification() {
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
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
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
                transition: all 0.2s ease;
            ">Refresh</button>
            <button onclick="this.parentElement.remove()" style="
                background: transparent;
                color: white;
                border: none;
                padding: 8px;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                opacity: 0.8;
            ">×</button>
        `;
        
        document.body.appendChild(updateNotification);
    }

    navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("🚀 Service Worker registered successfully");
        
        // Check for updates
        registration.onupdatefound = () => {
            const newSW = registration.installing;
            if (newSW) {
                console.log("🔄 New Service Worker found, installing...");
                
                newSW.onstatechange = () => {
                    switch (newSW.state) {
                        case "installing":
                            console.log("⚙️ Service Worker installing...");
                            break;
                            
                        case "installed":
                            if (navigator.serviceWorker.controller) {
                                console.log("🆕 New content is available!");
                                showUpdateNotification();
                            } else {
                                console.log("✨ Content is now cached for offline use");
                            }
                            break;
                            
                        case "activating":
                            console.log("🔥 Service Worker activating...");
                            break;
                            
                        case "activated":
                            console.log("✅ Service Worker activated and controlling the page");
                            break;
                            
                        case "redundant":
                            console.log("❌ Service Worker redundant - being replaced");
                            break;
                    }
                };
            }
        };

        // Check if there's already a waiting service worker
        if (registration.waiting) {
            console.log("🔄 New Service Worker waiting to activate");
            showUpdateNotification();
        }
    }).catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
    });

    // Handle offline/online status
    window.addEventListener('online', () => {
        console.log('🌐 App is online');
        document.body.style.filter = 'none';
    });

    window.addEventListener('offline', () => {
        console.log('📴 App is offline');
        document.body.style.filter = 'grayscale(20%)';
    });
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
