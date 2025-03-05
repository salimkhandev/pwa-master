import { createContext, useContext,useEffect,useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';


const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value,setValue] = useState('Hello World');
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
    }, [online, navigate, pathname]);

    return (
        <Context.Provider value={{isOnline ,value,setValue}}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};
