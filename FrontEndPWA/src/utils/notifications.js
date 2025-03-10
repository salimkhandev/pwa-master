const BACKEND_URL = 'http://localhost:3000';
const PUBLIC_VAPID_KEY = 'BDAcqYXV4SuunGqlTEsfrvyUF11s43wyDYZdtAPBN1iUw3zVPr4LrJJ_bD-ibBWe6C8fAosU7XBtLjgXkA0Prr8';

export async function subscribeToPushNotifications() {
    try {
        // Check browser support
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw new Error('Push notifications are not supported');
        }

        // Register service worker first
        const registration = await registerServiceWorker();
        console.log('Push notifications❤️');

        // Request notification permission
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
            throw new Error('Notification permission denied');
        }

        // Subscribe to push notifications
        const subscription = await subscribeToPush(registration);
        console.log('Push subscription successful');

        // Save subscription to backend
        await saveSubscription(subscription);
        return subscription;

    } catch (error) {
        console.error('Subscription error:', error);
        throw error;
    }
}

async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
        
        return registration;
    } catch (error) {
        throw new Error('Service Worker registration failed: ' + error.message);
    }
}

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        throw new Error('Failed to request notification permission: ' + error.message);
    }
}

async function subscribeToPush(registration) {
    try {
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        };

        const subscription = await registration.pushManager.subscribe(subscribeOptions);
        return subscription;
    } catch (error) {
        throw new Error('Push subscription failed: ' + error.message);
    }
}

async function saveSubscription(subscription) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
        });

        if (!response.ok) {
            throw new Error('Failed to save subscription to server');
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to save subscription: ' + error.message);
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function sendTestNotification() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/notifications/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Test Notification',
                body: 'This is a test notification from your PWA ok im receiving it!'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send test notification');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending test notification:', error);
        throw error;
    }
}