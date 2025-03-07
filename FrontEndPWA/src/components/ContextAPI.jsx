import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value, setValue] = useState('❤️from contextAPI❤️');
    const [netAvail, setNetAvail] = useState();
    const navigate = useNavigate();

    const onlinePathsOnly = ["/call", "/message", "/contact"];
    
    const pathname = useLocation().pathname;
    const isOfflineRestrictedPage = onlinePathsOnly.includes(pathname);

    useEffect(() => {
        const checkInternet = () => {
            return fetch("https://api.ipify.org?format=json")
                .then(response => response.ok)
                .catch(() => false);
        };

        const detectNetwork = () => {
            return Promise.race([
                new Promise(resolve => {
                    window.addEventListener('online', () => resolve(true), { once: true });
                    window.addEventListener('offline', () => resolve(false), { once: true });
                }),
                checkInternet()
            ]);
        };

        detectNetwork().then(isOnline => {
            setNetAvail(isOnline);
            setValue(isOnline ? 'You are online🟢' : 'You are offline🔴');
            if (!isOnline && isOfflineRestrictedPage) {
                navigate("/offline");
            }
        });

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
