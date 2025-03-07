import { useEffect, useState } from "react";
import {  getStudents } from "../db/studentsDB";
const CustDetails = () => {
    const [custDetails, setCustDetails] = useState([]);

    

    useEffect(() => {
        getStudents(setCustDetails);
    }, []);

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
