import { createContext, useContext,useEffect,useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';


const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value,setValue] = useState('Hello World');
    const [netAvail, setNetAvail] = useState(navigator.onLine)
    const navigate = useNavigate();

    const onlinePathsOnly = ['/call','/message','/contact'];
    // window.location.pathname use this
    const pathname = useLocation().pathname;    
    const isOnline = onlinePathsOnly.includes(pathname);


    useEffect(() => {
        console.log('netAvail',netAvail,isOnline);
        if (isOnline &&  !netAvail){
            navigate("/offline");
        }
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