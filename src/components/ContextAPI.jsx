import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [isOnline, setOnline] = useState(navigator.onLine); // Initialize with current online status
    const [value, setValue] = useState("Hello World");
    const navigate = useNavigate();
    const location = useLocation();

    const onlinePathsOnly = ["/call", "/message", "/contact"];
    const isOfflineRestrictedPage = onlinePathsOnly.includes(location.pathname);

    useEffect(() => {
        const checkOnlineStatus = async () => {
            try {
                const response = await fetch('https://www.google.com', { method: 'HEAD' });
                setOnline(response.ok);
            } catch (error) {
                setOnline(false);
            }
        };

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        // Check online status initially
        checkOnlineStatus();

        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Redirect if offline and on a restricted page
        if (!isOnline && isOfflineRestrictedPage && location.pathname !== "/offline") {
            navigate("/offline");
        }

        // Cleanup event listeners
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline, isOfflineRestrictedPage, navigate, location.pathname]);

    return (
        <Context.Provider value={{ isOnline, value, setValue }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};