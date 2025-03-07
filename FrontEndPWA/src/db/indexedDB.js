import { openDB } from 'idb';

// ✅ Initialize IndexedDB
export const initDB = async () => {
    return openDB('myDatabase', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('teachers')) {
                db.createObjectStore('teachers', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('students')) {
                db.createObjectStore('students', { keyPath: 'id' });
            }
        },
    });
};
const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(isPersisted ? "✅ Persistent storage granted!" : "⚠️ Persistent storage denied!");
    }
};
requestPersistentStorage();

// ✅ Function to get data from IndexedDB
export const getFromIndexedDB = async (storeName) => {
    const db = await initDB();
    return db.getAll(storeName);
};

// ✅ Function to save data to IndexedDB
export const saveToIndexedDB = async (storeName, data) => {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    data.forEach((item) => store.put(item));
    await tx.done;
};
