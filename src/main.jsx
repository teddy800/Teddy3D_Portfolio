// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize Lenis + GSAP ticker sync before app mounts
import './utils/smoothScroll.js'

// Optimize image loading with native lazy loading
if (typeof window !== 'undefined') {
  // Defer non-critical image loading
  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.classList.add('loaded');
      // Trigger image optimization if available
      if (e.target.decode) {
        e.target.decode().catch(() => {});
      }
    }
  }, true);

  // Register service worker for offline support and aggressive caching
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
    });
  }

  // Enable requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload critical resources
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/models/react_logo-transformed.glb';
      document.head.appendChild(link);
    });
  }
}

// Render with concurrent features enabled
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)