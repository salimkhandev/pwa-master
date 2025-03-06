import { useState, useEffect } from "react";
import { getFromIndexedDB, saveToIndexedDB } from "../db/indexedDB";
import { compareData } from "../utils/compareData";

export const useIndexedDBData = (apiUrl) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAndSync = async () => {
            const localData = await getFromIndexedDB();

            if (localData.length > 0) {
                setData(localData);
            }

            try {
                const response = await fetch(apiUrl);
                const newData = await response.json();

                if (compareData(localData, newData)) {
                    setData(newData);
                    await saveToIndexedDB(newData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAndSync();
    }, [apiUrl]);

    return data;
};
