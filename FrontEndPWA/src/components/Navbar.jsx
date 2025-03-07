import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/custdetail">Customer Detail</Link></li>
        <li><Link to="/teacherlist">Teachers</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 