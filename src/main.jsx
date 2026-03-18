// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Render app first — Lenis must NOT block React mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Initialize Lenis + GSAP ticker sync AFTER React mounts
import('./utils/smoothScroll.js').catch(() => {});

// Image load handler — mark images as loaded for fade-in
if (typeof window !== 'undefined') {
  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.classList.add('loaded');
    }
  }, true);

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    });
  }
}
