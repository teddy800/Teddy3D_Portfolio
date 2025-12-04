// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This line triggers Lenis globally — no warning anymore!
import './utils/smoothScroll.js'   // ← Changed from "import lenis from" to just "import"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)