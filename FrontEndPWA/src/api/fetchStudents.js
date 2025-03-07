// import { getStudentsFromDB, updateStudentsDB } from "../db/studentsDB";
import { getFromIndexedDB, saveToIndexedDB } from "../db/indexedDB";
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const STORE_NAME = "students";
// ✅ Fetch from API
export const fetchStudentsFromAPI = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch students");
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null; // Return null if API fails
    }
};

// ✅ Compare if data changed
const hasDataChanged = (oldData, newData) => {
    if (!oldData || oldData.length !== newData.length) return true;
    return JSON.stringify(oldData) !== JSON.stringify(newData);
};

// ✅ Get Students (From IndexedDB if No Change)
export const getStudents = async (setCustDetails) => {
    const localData = await getFromIndexedDB(STORE_NAME);
    const newData = await fetchStudentsFromAPI();
    if (localData.length > 0) {
        setCustDetails(localData);
    }

    if (!newData) return localData; // Use local data if API fails

    if (hasDataChanged(localData, newData)) {
        setCustDetails(newData);
        console.log(newData, "students from fetchStudents😒😒😒");
        await saveToIndexedDB(STORE_NAME, newData);
        return newData;
    }

    return localData;
};
