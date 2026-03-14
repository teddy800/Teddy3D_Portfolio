// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize Lenis + GSAP ticker sync before app mounts
import './utils/smoothScroll.js'

// Add 'loaded' class to lazy images once they decode — enables CSS fade-in
if (typeof window !== 'undefined') {
  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IMG') e.target.classList.add('loaded');
  }, true);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)