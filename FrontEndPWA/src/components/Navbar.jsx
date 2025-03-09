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
    <>
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
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
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-800 to-indigo-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-indigo-700">
          <Link 
            to="/"
            className="text-xl font-bold text-white"
            onClick={() => setIsOpen(false)}
          >
            PWA<span className="text-purple-300">App</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 focus:outline-none"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Items */}
        <div className="py-4 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-all duration-200
                ${location.pathname === item.to
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.text}</span>
              {location.pathname === item.to && (
                <span className="ml-auto">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
