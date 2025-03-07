import { initDB } from "./indexedDB";

// ✅ Get all records from any store
export const getFromDB = async (storeName) => {
    const db = await initDB();
    return db.getAll(storeName);
};

// ✅ Save multiple records to any store
export const saveToDB = async (storeName, data) => {
    try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        data.forEach((item) => store.put(item));
        await tx.done;
    } catch (error) {
        console.error("Error saving data to IndexedDB:", error);
    }
};

// ✅ Clear and update store
export const updateDB = async (storeName, data) => {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    store.clear(); // Remove old data
    data.forEach((item) => store.put(item));

    return tx.done;
};
