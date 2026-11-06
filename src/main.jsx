// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ===== CACHE-BUSTING: Clear old cache on version update =====
const APP_VERSION = '1.0.1';
const STORED_VERSION = localStorage.getItem('app_version');

if (STORED_VERSION !== APP_VERSION) {
  console.log('🔄 New version detected, clearing cache...');
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
  
  // Unregister old service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  // Update stored version
  localStorage.setItem('app_version', APP_VERSION);
  
  // Force reload from server (not cache)
  if (STORED_VERSION !== null) {
    window.location.reload(true);
  }
}

// Initialize advanced performance optimizations FIRST
import { initializePerformanceOptimizations } from './utils/advancedPerformance.js';
initializePerformanceOptimizations();

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
