import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker
if ('serviceWorker' in navigator) {
  console.log('serviceWorker in navigator');
    navigator.serviceWorker.register('/public/sw.js')
    .then((registration) => {
      console.log('add icon to the browser ', registration);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
