import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [isOnline, setOnline] = useState(navigator.onLine);
    console.log("isOnline:", isOnline);

    const [value, setValue] = useState("Hello World");
    const navigate = useNavigate();

    const onlinePathsOnly = ["/call", "/message", "/contact"];
    const pathname = useLocation().pathname;
    const isOfflineRestrictedPage = onlinePathsOnly.includes(pathname);

    useEffect(() => {
        const checkNetwork = async () => {
            try {
                const res = await fetch('https://www.google.com', { method: 'HEAD' });
                if (res.ok) {
                    setOnline(true);
                } else {
                    setOnline(false);
                }
            } catch (error) {
                console.error('Network check failed:', error);
                setOnline(false);
            }
        };

        checkNetwork();

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (!isOnline && isOfflineRestrictedPage) {
            if (pathname !== "/offline") {
                navigate("/offline");
            }
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [navigate, pathname, isOfflineRestrictedPage,isOnline]);

    return (
        <Context.Provider value={{ isOnline, value, setValue }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};
