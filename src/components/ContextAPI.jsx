import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value,setValue] = useState('Hello World');
    const [netAvail, setNetAvail] = useState(false);
    const navigate = useNavigate();

    const onlinePathsOnly = ['/call','/message','/contact'];
    // window.location.pathname use this
    const pathname = useLocation().pathname;    
    const isOnline = onlinePathsOnly.includes(pathname);


    useEffect(() => {
        console.log('netAvail', netAvail, 'isOfflineRoute', isOnline);
        
        const checkInternet = async () => {
            try {
                const response = await fetch("https://www.google.com", { mode: "no-cors" });
                setNetAvail(true);
            } catch (error) {
                console.error('Error checking internet:', error);
                setNetAvail(false);
            }
        };

        // Initial check
        checkInternet();

        const handleOnline = () => setNetAvail(true);
        const handleOffline = () => setNetAvail(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        if (isOnline && !netAvail) {
            navigate("/offline");
        }
        
        // Cleanup event listeners
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isOnline, navigate, pathname,netAvail]);
   

    return (
        <Context.Provider value={{isOnline ,value,setValue}}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};