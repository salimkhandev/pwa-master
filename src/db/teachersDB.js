import { getFromIndexedDB, saveToIndexedDB } from "./indexedDB";

const STORE_NAME = "teachers";

// ✅ Get teachers from IndexedDB
export const getTeachersFromDB = async () => getFromIndexedDB(STORE_NAME);

// ✅ Save teachers to IndexedDB
export const saveTeachersToDB = async (teachers) => {
    try {
        await saveToIndexedDB(STORE_NAME, teachers);
    } catch (error) {
        console.error("Error saving teachers to IndexedDB:", error);
    }
};

// ✅ Clear and update teachers in IndexedDB
export const updateTeachersDB = async (teachers) => {
   
    return saveToIndexedDB(STORE_NAME, teachers); // Correctly call saveToIndexedDB
};
