import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value, setValue] = useState('Hello World');
    const [netAvail, setNetAvail] = useState();
    const navigate = useNavigate();

    const onlinePathsOnly = ["/call", "/message", "/contact"];
    const pathname = useLocation().pathname;
    const isOfflineRestrictedPage = onlinePathsOnly.includes(pathname);

    useEffect(() => {
        const handleOnline = () => setNetAvail(true);
        const handleOffline = () => setNetAvail(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const checkInternet = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                if (response.ok) {
                    console.log(response, "response");
                    setNetAvail(true);
                    return true; // Return true if online
                } else {
                    setNetAvail(false);
                    return false; // Return false if not online
                }
            } catch (err) {
                setNetAvail(false); // Internet is not available
                return false; // Return false on error
            }
        };

        checkInternet().then((isOnline) => {

                if (!isOnline && isOfflineRestrictedPage) {
                    navigate("/offline");
                }
            
        });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [navigate, pathname, isOfflineRestrictedPage]);

    return (
        <Context.Provider value={{ netAvail, value, setValue }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};
