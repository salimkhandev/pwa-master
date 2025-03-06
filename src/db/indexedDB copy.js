import { openDB } from 'idb';

// ✅ Request persistent storage permission
const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(isPersisted ? "✅ Persistent storage granted!" : "⚠️ Persistent storage denied!");
    }
};

// ✅ Initialize IndexedDB
const dbPromise = openDB('myDatabase', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('dataStore')) {
            db.createObjectStore('dataStore', { keyPath: 'id' });
        }
    },
});

// ✅ Run persistent storage request
requestPersistentStorage();

// Function to get data
export const getFromIndexedDB = async () => {
    const db = await dbPromise;
    return db.getAll('dataStore');
};

// Function to save data
export const saveToIndexedDB = async (data) => {
    const db = await dbPromise;
    const tx = db.transaction('dataStore', 'readwrite');
    const store = tx.objectStore('dataStore');
    data.forEach((item) => store.put(item));
    await tx.done;
};
