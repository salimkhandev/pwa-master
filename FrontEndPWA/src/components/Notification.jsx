import React, { useEffect, useState } from 'react';

const Notification = ({ message, type = 'info', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 5000); // Notification will disappear after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const bgColor = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500'
    }[type];

    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out`}>
            <div className="flex items-center gap-2">
                <span>{message}</span>
                <button 
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification; 