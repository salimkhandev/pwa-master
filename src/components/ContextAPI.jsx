import { createContext, useContext,useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';


const Context = createContext();

export const ContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const onlinePathsOnly = ['/call','/message','/contact'];
    // window.location.pathname use this
    const pathname = useLocation().pathname;    
    const isOnline = onlinePathsOnly.includes(pathname);


    useEffect(() => {
        if (isOnline && !navigator.onLine) {
            navigate("/offline");
        }
    }, [isOnline, navigate, pathname]);
   

    return (
        <Context.Provider value={{isOnline }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};