import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", text: "Home", icon: "🏠" },
    { to: "/about", text: "About", icon: "ℹ️" },
    { to: "/contact", text: "Contact", icon: "📞" },
    { to: "/custdetail", text: "Customers", icon: "👥" },
    { to: "/teacherlist", text: "Teachers", icon: "👨‍🏫" },
    { to: "/attendance", text: "Attendance", icon: "📋" }
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg fixed  w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight transform hover:scale-105 transition duration-300"
            >
              PWA<span className="text-purple-300">App</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition duration-300 group
                  ${location.pathname === item.to 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/10 hover:text-purple-200'}`}
              >
                {item.text}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-300 group-hover:w-3/4 transition-all duration-300 transform -translate-x-1/2"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 focus:outline-none transition duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transform transition duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu with Glass Effect */}
      <div
        className={`fixed inset-0 backdrop-blur-lg bg-gradient-to-b from-indigo-900/95 to-purple-900/95 transform transition-all duration-500 ease-in-out ${
          isOpen 
            ? "translate-x-0 opacity-100" 
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none transition duration-300"
          onClick={() => setIsOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mobile Menu Content */}
        <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
          <div className="w-full max-w-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 w-full px-6 py-4 rounded-xl mb-3 text-lg font-medium transition-all duration-300
                  ${location.pathname === item.to
                    ? 'bg-white/20 text-white transform scale-105'
                    : 'hover:bg-white/10 text-gray-100 hover:text-white'
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.text}</span>
                {location.pathname === item.to && (
                  <span className="ml-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
