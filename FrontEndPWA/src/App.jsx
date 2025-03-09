import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Attendance from './components/AttendanceList';
import { ContextProvider } from './components/ContextAPI';
import CustDetails from './components/CustDetails';
import Navbar from './components/Navbar';
import Offline from './components/Offline';
import TeachersList from './components/TeachersList';

// Lazy-loaded components
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Home = lazy(() => import('./components/Home'))





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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-14 md:pl-64">
          <div className="container mx-auto px-4 py-6">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><About /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>} />
                <Route path="/attendance" element={<Suspense fallback={<div>Loading...</div>}><Attendance /></Suspense>} />
                <Route path="/offline" element={<Offline />} />
                <Route path="/custdetail" element={<CustDetails />} />
                <Route path="/teacherlist" element={<Suspense fallback={<div>Loading...</div>}><TeachersList /></Suspense>} />
                <Route path="/attendance" element={<Attendance />} />
              </Routes>
            </Suspense>
          </div>
        </main>

        {/* Install button section */}
        {deferredPrompt && (
          <button onClick={handleInstallClick} className="install-button">
            Install App
          </button>
        )}
      </div>
    </ContextProvider>
  )
}

export default App
