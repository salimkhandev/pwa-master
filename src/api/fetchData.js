import { getFromIndexedDB, saveToIndexedDB } from "../db/indexedDB";
import { compareData } from "../utils/compareData";

export const fetchData = async (setCustDetails) => {
    const localData = await getFromIndexedDB();

    if (localData.length > 0) {
        setCustDetails(localData); // Serve cached data
    }

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const newData = await response.json();

        if (compareData(localData, newData)) {
            setCustDetails(newData);
            await saveToIndexedDB(newData); // Update IndexedDB only if data changed
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
