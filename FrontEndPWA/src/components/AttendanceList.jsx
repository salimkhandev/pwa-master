// components/Attendance.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { getStudentsStatus } from "../api/fetchStudentStatus";
import { CACHE_NAME } from "../../public/config";
import { useContextAPI } from './ContextAPI';
export default function Attendance() {
    const { value } = useContextAPI();
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        try {
            // const data = await getTeachers(); // ✅ Fetch from IndexedDB or API
            getStudentsStatus(setStudents);
        } catch (err) {
            setError("Failed to fetch teachers data");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        
        fetchData();
    }, []);


    const handleAttendance = async (id, status) => {
        try {
          
            if ('caches' in window) {
                const cacheName = `${CACHE_NAME}`;
                const urlToDelete = "https://pwa-frontend-123.vercel.app/attendance";

                const cache = await caches.open(cacheName);

                // ❌ Delete old cached response
                const deleted = await cache.delete(urlToDelete);
                console.log(deleted ? "✅ Deleted old cache" : "⚠️ Not Found in cache");

                // 🔄 Fetch new data from server
                const response = await fetch(urlToDelete);

                if (response.ok) {
                    // ✅ Store new response in cache
                    await cache.put(urlToDelete, response.clone());
                    console.log("✅ New data cached successfully!");
                } else {
                    console.error("❌ Failed to fetch new data");
                }
            }
            




            await axios.post("https://pwa-backend-123.vercel.app/attendance", {
                student_id: id,
                status: status
            });
            fetchData();
        } catch (err) {
            setError("Failed to update attendance");
            console.error("Update error:", err);
        }
    };

    if (error) {
        return (
            <div className="mx-4 md:max-w-xl md:mx-auto p-4 md:p-6 bg-red-50 text-red-500 rounded-lg mt-4 md:mt-10">
                {error}
            </div>
        );
    }
    if (loading) {
        return <div className="mx-4 md:max-w-xl md:mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg mt-4 md:mt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">📌 Mark Attendance</h2>
            <p className="text-gray-500">Loading...</p>
        </div>
    }

    return (
        <div className="mx-4 md:max-w-xl md:mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg mt-4 md:mt-10">
            {<h5 className="text-xl  mb-4">{value}</h5>}
            <h2 className="text-xl md:text-2xl font-bold mb-4">📌 Mark Attendance</h2>
            {students.length === 0 ? (
                <p className="text-gray-500">No students found</p>
            ) : (
                <ul className="space-y-2">
                    {students.map((student) => (
                        <li
                            key={student.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 border-b hover:bg-gray-50"
                        >
                            <span className="font-medium text-sm md:text-base">
                                {student.name}
                            </span>
                            
                            <div className="flex items-center justify-between sm:justify-end flex-1 gap-2">
                                <div className="flex gap-2">
                                    <button
                                        className={`px-2 py-1 md:px-3 md:py-1 rounded text-sm md:text-base transition-colors ${
                                            student.status === "Present"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-300 hover:bg-green-400 hover:text-white"
                                        }`}
                                        onClick={() => handleAttendance(student.id, "Present")}
                                    >
                                        Present
                                    </button>
                                    <button
                                        className={`px-2 py-1 md:px-3 md:py-1 rounded text-sm md:text-base transition-colors ${
                                            student.status === "Absent"
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-300 hover:bg-red-400 hover:text-white"
                                        }`}
                                        onClick={() => handleAttendance(student.id, "Absent")}
                                    >
                                        Absent
                                    </button>
                                </div>
                                <span className="text-xs md:text-sm text-gray-600 min-w-[70px] text-right">
                                    {student.status}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}