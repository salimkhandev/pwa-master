// src/components/Fallback.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Fallback = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Oops!</h1>
            <p>The page you are looking for does not exist.</p>
            <p>You might want to check your internet connection or return to the home page.</p>
            <Link to="/">Return to Home</Link>
        </div>
    );
};

export default Fallback;