import { useEffect, useState } from 'react';


const CustDetails = () => {
    const [custDetails, setCustDetails] = useState([]);

    const fetchData = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setCustDetails(data);
    };

    useEffect(() => {
        fetchData();
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
