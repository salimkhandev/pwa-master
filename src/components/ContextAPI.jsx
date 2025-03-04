import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsOnline } from 'react-use-is-online';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const { isOnline, isOffline, error } = useIsOnline();
    console.log("isOnline:", isOnline);

    const [value, setValue] = useState("Hello World");
    const navigate = useNavigate();

    const onlinePathsOnly = ["/call", "/message", "/contact"];
    const pathname = useLocation().pathname;
    const isOfflineRestrictedPage = onlinePathsOnly.includes(pathname);

    useEffect(() => {
        if (!isOnline && isOfflineRestrictedPage) {
            if (pathname !== "/offline") {
                navigate("/offline"); // ✅ Prevent infinite navigation loop
            }
        }
    }, [isOnline, navigate, pathname]);

    return (
        <Context.Provider value={{ isOnline, value, setValue }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};
