import { getFromIndexedDB, saveToIndexedDB } from "./indexedDB";

const STORE_NAME = "students";

// ✅ Get students from IndexedDB
export const getStudentsFromDB = async () => getFromIndexedDB(STORE_NAME);

// ✅ Save students to IndexedDB
export const saveStudentsToDB = async (students) => saveToIndexedDB(STORE_NAME, students);

// ✅ Clear and update students in IndexedDB
export const updateStudentsDB = async (students) => {
    return saveToIndexedDB(STORE_NAME, students);
};
