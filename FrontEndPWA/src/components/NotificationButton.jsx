import React, { useEffect, useState } from 'react';
import { sendTestNotification, subscribeToPushNotifications } from '../utils/notifications';

const NotificationButton = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkSubscription = async () => {
            if (!('Notification' in window) || !('serviceWorker' in navigator)) {
                setIsSupported(false);
                return;
            }

            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);
            } catch (err) {
                console.error('Subscription check failed:', err);
            }
        };
      
        checkSubscription();
    }, []);

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);
        try {
            await subscribeToPushNotifications();
            setIsSubscribed(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTestNotification = async () => {
        try {
            await sendTestNotification();
            console.log('Test notification sent successfully');
            testVibration();
        } catch (err) {
            setError('Failed to send test notification: ' + err.message);
        }
    };

    function testVibration() {
        if ('vibrate' in navigator) {
            // Test vibration directly
            navigator.vibrate([200, 100, 200]);
            console.log('Vibration triggered');
        } else {
            console.log('Vibration not supported');
        }
    }

    if (!isSupported) {
        return (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                Push notifications are not supported in your browser.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                    {error}
                </div>
            )}
            
            <button
            
                onClick={handleSubscribe}
                disabled={loading || isSubscribed}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isSubscribed
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : loading
                            ? 'bg-gray-100 text-gray-500 cursor-wait'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </span>
                ) : isSubscribed ? (
                    'Notifications Enabled ✓'
                ) : (
                    'Enable Notifications'
                )}
            </button>

            {isSubscribed && (
                <button
                    onClick={handleTestNotification}
                    className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
                >
                    Send Test Notification
                </button>
            )}
        </div>
    );
};

export default NotificationButton; 