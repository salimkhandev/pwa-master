// import { getTeachersFromDB, updateTeachersDB } from "../db/teachersDB";
import { getFromIndexedDB, saveToIndexedDB } from "../db/indexedDB";

const STORE_NAME = "teachers";
const API_URL = "https://ghss-management-backend.vercel.app/TeachersList";

export const fetchTeachersFromAPI = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch teachers");

        const data = await response.json();

        // Convert JSON object to an array of objects
        const transformedArray = Object.entries(data).flatMap(([className, teachers]) =>
            teachers.map(teacher => ({ className, ...teacher }))
        );

        console.log(transformedArray, "transformedArray😒😒😒");

        return transformedArray;
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
};

const hasDataChanged = (oldData, newData) => {
    if (!oldData || oldData.length !== newData.length) return true;
    return JSON.stringify(oldData) !== JSON.stringify(newData);
};

export const getTeachers = async (setTeachers) => {
    const localData = await getFromIndexedDB(STORE_NAME);
    const newData = await fetchTeachersFromAPI();
    // console.log(newData, "newData😒😒😒");

    if (localData.length > 0) {
        setTeachers(localData);
    }


    // updateTeachersDB(newData);
    if (!newData) return localData;

    if (hasDataChanged(localData, newData)) {
        setTeachers(newData);
        await saveToIndexedDB(STORE_NAME, newData);
        return newData;
    }

    return localData;
};
