// components/Attendance.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { CACHE_NAME } from "../../public/config";
import { getStudentsStatus } from "../api/fetchStudentStatus";
import { deleteOfflineAttendanceStatus, getOfflineAttendanceStatus, isOfflineAttendanceTaken, updateStudentById } from "../db/indexedDB";
import { useContextAPI } from './ContextAPI';

export default function Attendance() {
    const { value } = useContextAPI();
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncingLoading, setSyncingLoading] = useState(false);

    const fetchData = async () => {
        try {
            // const data = await getTeachers(); // ✅ Fetch from IndexedDB or API
            getStudentsStatus(setStudents, value);
        } catch (err) {
            setError("Failed to fetch teachers data");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOfflineAttendanceStatus().then(async (attendanceDatas) => {
            console.log("🎯 Cleaned Data Before Sending:", attendanceDatas);

            if (attendanceDatas.length > 0 && value) {
                const cleanedData = attendanceDatas.map(({ id, status }) => ({
                    student_id: id,  // Renaming 'id' to 'student_id'
                    status: status
                }));

                console.log("🚀 Sending Data:", cleanedData);

                try {
                    setSyncingLoading(true);
                    const response = await axios.post("https://pwa-backend-123.vercel.app/attendance", cleanedData);

                    if (response.status === 200) {
                        deleteOfflineAttendanceStatus(); // Run success function
                        setSyncingLoading(false);
                        fetchData(); // Refresh after successful upload
                    }
                } catch (error) {
                    console.error("❌ Error syncing attendance:", error);
                    // setSyncingLoading(false);
                    alert("❌ Failed to update attendance. Please try again.");
                } // Refresh after successful upload
            }
        });

        // if(syncingLoading){
        fetchData();
        // }
    }, [value]);

    const handleAttendance = async (id, status) => {    
        try {
            if (value) {
                if ('caches' in window) {
                    const cacheName = `${CACHE_NAME}`;
                    console.log(cacheName, "cacheName");
                    // // const urlToDelete = "https://pwa-frontend-123.vercel.app/attendance";
                    // const urlToDelete = "https://pwa-frontend-123.vercel.app/attendancehwhwhwh";

                    // const cache = await caches.open(cacheName);

                    // // ❌ Delete old cached response
                    // const deleted = await cache.delete(urlToDelete);
                    // console.log(deleted ? "✅ Deleted old cache" : "⚠️ Not Found in cache");

                    // // 🔄 Fetch new data from server
                    // const response = await fetch(urlToDelete);

                    // if (response.ok) {
                    //     // ✅ Store new response in cache
                    //     await cache.put(urlToDelete, response.clone());
                    //     console.log("✅ New data cached successfully!");
                    // } else {
                    //     console.error("❌ Failed to fetch new data");
                    // }
                }
                
                await axios.post("https://pwa-backend-123.vercel.app/attendance", {
                    student_id: id,
                    status: status
                });
                fetchData();
            }
            if (!value) {
                updateStudentById(id, { status: status });
                isOfflineAttendanceTaken(id, status);
                fetchData();
            }
        } catch (err) {
            setError("Failed to update attendance");
            console.error("Update error:", err);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                    <div className="flex items-center text-red-600">
                        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 bg-gray-50">
            <div className="w-full mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">📌 Mark Attendance</h2>
                        <div className="flex items-center gap-3">
                            {/* Online/Offline Status */}
                            <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                    value ? 'bg-green-500' : 'bg-red-500'
                                }`}></span>
                                {value ? 'Online' : 'Offline'}
                            </div>
                            
                            {/* Syncing Indicator */}
                            {syncingLoading && (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                                    <div className="w-3 h-3 border-t-2 border-b-2 border-current rounded-full animate-spin"></div>
                                    <span className="text-sm font-medium">Syncing...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="divide-y divide-gray-100">
                    {students.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">No students found</p>
                        </div>
                    ) : (
                        students.map((student) => (
                            <div
                                key={student.id}
                                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Student Name */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Status: <span className={`font-medium ${
                                                student.status === "Present" ? "text-green-600" :
                                                student.status === "Absent" ? "text-red-600" :
                                                "text-gray-600"
                                            }`}>{student.status || "Not marked"}</span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAttendance(student.id, "Present")}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                student.status === "Present"
                                                    ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                                                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                                            }`}
                                        >
                                            Present
                                        </button>
                                        <button
                                            onClick={() => handleAttendance(student.id, "Absent")}
                                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                student.status === "Absent"
                                                    ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                                                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"
                                            }`}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}