import { useEffect, useState } from "react";
import {  getStudents } from "../db/studentsDB";
const CustDetails = () => {
    const [custDetails, setCustDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                getStudents(setCustDetails);
            } catch (err) {
                setError("Failed to fetch students data", err);
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
        <div className="container">
            <h1>Customer Details</h1>
            {custDetails.map((data, key) => (
                <div className="post" key={key}>
                    <h3>
                        Title: {data.title}
                    </h3>
                    <p>Details: {data.body}</p>
                </div>
            ))}
        </div>
    );
};

export default CustDetails;
