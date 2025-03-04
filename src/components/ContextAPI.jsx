import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsOnline } from 'react-use-is-online';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    // const { isOnline, isOffline, error } = useIsOnline();
    const [isOnline,setOnline]=useState(false)
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
        //write code req to check fetch google online or offline
        const res=await fetch('https://www.google.com')
        if(res.status===200){
            setOnline(true)
        }else{
            setOnline(false)
        }
        

        window.addEventListener('online',()=>{
            setOnline(true)
        })
        window.addEventListener('offline',()=>{
            setOnline(false)
        })
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
