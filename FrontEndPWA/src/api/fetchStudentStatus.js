// import { getStudentsFromDB, updateStudentsDB } from "../db/studentsDB";
import { getFromIndexedDB, saveToIndexedDB, getOfflineAttendanceStatus } from "../db/indexedDB";
// import { useContextAPI } from '../components/ContextAPI';
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
    return JSON.stringify(oldData) !== JSON.stringify(newData); // Deep content check
};

// ✅ Get Students (From IndexedDB if No Change)
export const getStudentsStatus = async (setStudentsStatus,value) => {
    const localData = await getFromIndexedDB(STORE_NAME);
    if (localData.length > 0) {
        setStudentsStatus(localData);
    }
    const newData = await fetchStudentsStatusFromAPI();

    if (!newData) return localData; // Use local data if API fails

    getOfflineAttendanceStatus().then(async (attendanceDatas) => {
        
        // const { value } = useContextAPI();
        if (attendanceDatas.length ===0 && value) {
            
            if (hasDataChanged(localData, newData)) {
                
                setStudentsStatus(newData);
                console.log(newData, "students status 😒😒😒");
                await saveToIndexedDB(STORE_NAME, newData);
                return newData;
            }
            
            return localData;
        }})
};
