// components/Attendance.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await axios.get("http://localhost:3000/attendance");
            setStudents(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch attendance data");
            console.error("Fetch error:", err);
        }
    };

    const handleAttendance = async (id, status) => {
        try {
            await axios.post("http://localhost:3000/attendance", {
                student_id: id,
                status,
            });
            fetchAttendance();
        } catch (err) {
            setError("Failed to update attendance");
            console.error("Update error:", err);
        }
    };

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-red-50 text-red-500 rounded-lg mt-10">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">📌 Mark Attendance</h2>
            {students.length === 0 ? (
                <p className="text-gray-500">No students found</p>
            ) : (
                <ul>
                    {students.map((student) => (
                        <li
                            key={student.student_id}
                            className="flex justify-between p-3 border-b hover:bg-gray-50"
                        >
                            <span className="font-medium">{student.name}</span>
                            <div className="space-x-2">
                                <button
                                    className={`px-3 py-1 rounded transition-colors ${student.status === "Present"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-300 hover:bg-green-400 hover:text-white"
                                        }`}
                                    onClick={() => handleAttendance(student.student_id, "Present")}
                                >
                                    Present
                                </button>
                                <button
                                    className={`px-3 py-1 rounded transition-colors ${student.status === "Absent"
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-300 hover:bg-red-400 hover:text-white"
                                        }`}
                                    onClick={() => handleAttendance(student.student_id, "Absent")}
                                >
                                    Absent
                                </button>
                            </div>
                            <span className="ml-4 text-sm text-gray-600">{student.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}