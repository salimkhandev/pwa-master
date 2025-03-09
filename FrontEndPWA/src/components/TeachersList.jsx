import React, { useEffect, useState } from "react";
import { getTeachers } from "../api/fetchTeachers"; // ✅ Use IndexedDB + API
import teacherIcon from "../assets/react.svg"; // ✅ Placeholder image
import "../components/CustDetails.css";

const TeachersList = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data = await getTeachers(); // ✅ Fetch from IndexedDB or API
                getTeachers(setTeachers);
            } catch (err) {
                setError("Failed to fetch teachers data");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center text-red-600">
                        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Teachers List</h2>
                
                {teachers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((teacher, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-full">
                                        #{index + 1}
                                    </span>
                                    <img
                                        src={teacher.profile_pic_url || teacherIcon}
                                        alt={`${teacher.teacher_name}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {teacher.teacher_name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Section: {teacher.section_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No teachers found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeachersList;
