import { openDB } from 'idb';

// ✅ Request persistent storage permission
const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(isPersisted ? "✅ Persistent storage granted!" : "⚠️ Persistent storage denied!");
    }
};

// ✅ Initialize IndexedDB with multiple object stores
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

// ✅ Run persistent storage request
requestPersistentStorage();
