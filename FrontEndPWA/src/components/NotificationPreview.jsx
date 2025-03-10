import React, { useState } from 'react';

const NotificationPreview = () => {
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = () => {
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 5000); // Hide after 5 seconds
    };

    return (
        <div className="p-4">
            {/* Preview Button */}
            <button
                onClick={showNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg 
                         shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                Preview Notification
            </button>

            {/* Notification Preview */}
            <div
                className={`fixed top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 
                          transform transition-all duration-300 ease-in-out
                          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            >
                <div className="p-4">
                    {/* App Icon and Title */}
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="font-semibold text-gray-800">Test Notification</h3>
                            <p className="text-xs text-gray-500">Just now</p>
                        </div>
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    {/* Notification Body */}
                    <p className="text-gray-600 text-sm">
                        This is a test notification from your PWA!
                    </p>
                    {/* Action Buttons */}
                    <div className="mt-3 flex justify-end space-x-2">
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Dismiss
                        </button>
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPreview; 