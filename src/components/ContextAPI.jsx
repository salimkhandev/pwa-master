import { createContext, useContext, useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [value, setValue] = useState(100);
    const location = useLocation();
    const onlinePathsOnly = ['/call','/message','/contact'];
    const isOnline = onlinePathsOnly.includes(location.pathname);
    useEffect(() => {
        if (isOnline && !navigator.onLine) {
            navigate('/offline');
        }
    }, [isOnline, navigate]);

    return (
        <Context.Provider value={{ value, setValue, isOnline }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};