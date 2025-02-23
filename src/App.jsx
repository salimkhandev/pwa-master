import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'

// Lazy-loaded components
const About = lazy(() => import('./components/About'))
const Contact = lazy(() => import('./components/Contact'))
const Home = lazy(() => import('./components/Home'))

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><About /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
