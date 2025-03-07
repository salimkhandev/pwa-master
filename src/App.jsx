import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';

import { ContextProvider } from './components/ContextAPI';
import CustDetails from './components/CustDetails';
import Offline from './components/Offline';
import TeachersList from './components/TeachersList';

// Lazy-loaded components
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Home = lazy(() => import('./components/Home'))
<<<<<<< HEAD
=======
import Offline from './components/Offline'
import CustDetails from './components/CustDetails';
>>>>>>> parent of 485814e (improved)



function App() {

 

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check device types
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroidDevice = /Android/.test(navigator.userAgent);
    
    setIsIOSDevice(isIOS);
    setIsAndroid(isAndroidDevice);

    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the saved prompt since it can't be used again here
    setDeferredPrompt(null);
  };

  return (
    <ContextProvider>

    
    <React.Fragment>
      {/* <Router> */}
        <div className="app">
          <nav className="navbar">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/custdetail">Customer Detail</Link></li>
            
            </ul>
          </nav>

          <div className="content">
            <Routes>
              <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><About /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>} />
              <Route path="/offline" element={<Offline />} /> {/* Catch-all route */}
              <Route path="/custdetail" element={<CustDetails />} /> {/* Catch-all route */}

            </Routes>
          </div>

          {/* Install button section */}
          {deferredPrompt && (
            <button onClick={handleInstallClick} className="install-button">
              Install App
            </button>
          )}
        </div>
      {/* </Router> */}
    </React.Fragment>
    </ContextProvider>
  )
}

export default App
