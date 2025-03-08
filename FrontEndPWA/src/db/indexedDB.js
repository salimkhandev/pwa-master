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
            if (!db.objectStoreNames.contains('students-status')) {
                db.createObjectStore('students-status', { keyPath: 'id' });
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

// update data in IndexedDB
// ✅ Function to update specific student with multiple fields
export const updateStudentById = async (id, updates) => {
    try {
        const db = await initDB();
        const tx = db.transaction('students-status', 'readwrite');
        const store = tx.objectStore('students-status');

        // Get the existing student record
        const student = await store.get(id);

        if (!student) {
            throw new Error(`Student with ID ${id} not found`);
        }

        // Update the student with new data
        const updatedStudent = {
            ...student,
            ...updates
        };

        // Save the updated record
        await store.put(updatedStudent);
        await tx.done;

        return updatedStudent;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

// Usage example:
/*
try {
    await updateStudentById(studentId, {
        status: "Present",
        lastUpdated: new Date(),
        // ... any other fields you want to update
    });
    // Update successful
} catch (error) {
    // Handle error
}
*/

    requestPersistentStorage();