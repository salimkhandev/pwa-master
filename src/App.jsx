import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import About from './components/About'
// import Contact from './components/Contact'
import Home from './components/Home'
import NavBar from './components/NavBar'
import Services from './components/Services'

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
