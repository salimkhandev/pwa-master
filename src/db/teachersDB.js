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
    const teacher = [
        {
            "className": "Class 6",
            "section_name": "A",
            "teacher_name": "Zohaib",
            "profile_pic_url": "https://tincbebbtpaavhpdxetz.supabase.co/storage/v1/object/public/ghss-profile-pics/users/146/profile.jpg"
        },
        {
            "className": "Class 6",
            "section_name": "B",
            "teacher_name": "Bilal",
            "profile_pic_url": "https://tincbebbtpaavhpdxetz.supabase.co/storage/v1/object/public/ghss-profile-pics/users/127/profile.jpg"
        },
    ]
    return saveToIndexedDB(STORE_NAME, teachers); // Correctly call saveToIndexedDB
};
