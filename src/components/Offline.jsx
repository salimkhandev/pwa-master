// src/components/Offline.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Offline.module.css';

const Offline = () => {
    return (
        <div className={styles.offlineContainer}>
            <h1 className={styles.offlineTitle}>Oops!</h1>
            <p className={styles.offlineText}>You might want to check your internet connection or return to the home page.</p>
            <Link to="/" className={styles.offlineLink}>Return to Home</Link>
        </div>
    );
};

export default Offline;