import { createContext, useContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [value, setValue] = useState(100);

    return (
        <Context.Provider value={{ value, setValue }}>
            {children}
        </Context.Provider>
    );
};

export const useContextAPI = () => {
    return useContext(Context);
};