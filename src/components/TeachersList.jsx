import React, { useEffect, useState } from "react";
import { getTeachers } from "../api/fetchTeachers"; // ✅ Use IndexedDB + API
import teacherIcon from "../assets/react.svg"; // ✅ Placeholder image

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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="teachers-container">
            <h2 className="teachers-title">Teachers List</h2>

            {teachers.length > 0 ? (
                teachers.map((teacher, index) => (
                    <div key={index} className="teacher-card">
                        <img
                            src={teacher.profile_pic_url || teacherIcon}
                            alt="Teacher"
                            className="teacher-image"
                        />
                        <h4 className="teacher-name">{teacher.teacher_name}</h4>
                        <p className="teacher-section">Section: {teacher.section_name}</p>
                    </div>
                ))
            ) : (
                <p>No teachers found</p>
            )}
        </div>
    );
};

export default TeachersList;
