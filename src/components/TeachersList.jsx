import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './TeachersList.css'; // Import external CSS
import teacherIcon from '../assets/react.svg'; // Placeholder icon

const TeachersList = () => {
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('https://ghss-management-backend.vercel.app/TeachersList');
                setTeachers(response.data);
            } catch (err) {
                setError('Failed to fetch teachers data');
                console.log('Error',err);
                
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="teachers-container">
            <h2 className="teachers-title">Teachers List</h2>

            {Object.keys(teachers).map((className, index) => (
                <div key={index} className="class-section">
                    <h3 className="class-name">{className}</h3>

                    <div className="teachers-grid">
                        {teachers[className].map((teacher, idx) => (
                            <div key={idx} className="teacher-card">
                                <img
                                    src={teacher.profile_pic_url || teacherIcon}
                                    alt="Teacher"
                                    className="teacher-image"
                                />
                                <h4 className="teacher-name">{teacher.teacher_name}</h4>
                                <p className="teacher-section">Section: {teacher.section_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeachersList;
