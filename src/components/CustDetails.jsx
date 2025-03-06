import { useEffect, useState } from "react";
// import { fetchData } from "../api/fetchData";
import { getStudents } from "../api/fetchStudents";

const CustDetails = () => {
    const [custDetails, setCustDetails] = useState([]);

    useEffect(() => {
        getStudents(setCustDetails);
    }, []);

    return (
        <div className="container">
            <h1>Customer Details</h1>
            {custDetails.map((data) => (
                <div className="post" key={data.id}>
                    <h3>Title: {data.title}</h3>
                    <p>Details: {data.body}</p>
                </div>
            ))}
        </div>
    );
};

export default CustDetails;
