// import { getStudentsFromDB, updateStudentsDB } from "../db/studentsDB";
import { getFromIndexedDB, saveToIndexedDB } from "../db/indexedDB";
const API_URL = "https://pwa-backend-123.vercel.app/attendance";
const STORE_NAME = "students-status";
// ✅ Fetch from API
export const fetchStudentsStatusFromAPI = async () => {
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

    return oldData.some((item, index) => {
        return Object.keys(item).some((key) => item[key] !== newData[index][key]);
    });
};

// ✅ Get Students (From IndexedDB if No Change)
export const getStudentsStatus = async (setStudentsStatus) => {
    // Get local data and render immediately
    const localData = await getFromIndexedDB(STORE_NAME);
    if (localData?.length > 0) {
        setStudentsStatus(localData);
    }

    // Compare and update in the background
    Promise.resolve().then(async () => {
        try {
            const newData = await fetchStudentsStatusFromAPI();
            if (!newData) return;

            if (hasDataChanged(localData, newData)) {
                setStudentsStatus(newData);
                console.log(newData, "new data added status to students 😒😒😒");
                await saveToIndexedDB(STORE_NAME, newData);
            }
        } catch (error) {
            console.error("Background update error:", error);
        }
    });

    return localData;
};
