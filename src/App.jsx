import { lazy, Suspense, useState, useCallback, useEffect } from "react";

import NavBar from "./Components/NavBar";
import Hero from "./sections/Hero";
import CursorTrail from "./Components/CursorTrail";
import ScrollProgressBar from "./Components/ScrollProgressBar";
import BackToTop from "./Components/BackToTop";
import PageLoader from "./Components/PageLoader";
import { ToastProvider } from "./Components/ToastNotification";
import { registerServiceWorker, detectDeviceCapabilities, adaptiveLoad } from "./utils/performanceOptimizer";

const ShowcaseSection = lazy(() => import("./sections/ShowcaseSection"));
const LogoShowcase    = lazy(() => import("./sections/LogoShowcase"));
const FeatureCards    = lazy(() => import("./sections/FeatureCards"));
const Experience      = lazy(() => import("./sections/Experience"));
const TechStack       = lazy(() => import("./sections/TechStack"));
const Testimonials    = lazy(() => import("./sections/Testimonials"));
const Contact         = lazy(() => import("./sections/Contact"));
const Footer          = lazy(() => import("./sections/Footer"));

const SectionFallback = () => (
  <div className="w-full py-20 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
  </div>
);

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker();

    // Detect device capabilities and adapt loading
    const capabilities = detectDeviceCapabilities();
    const config = adaptiveLoad(capabilities);
    
    // Store config in window for components to use
    window.__ADAPTIVE_CONFIG__ = config;

    // Prefetch critical models
    if (config.enableWebGL) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/models/optimized-room.glb';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <ToastProvider>
      {/* Cinematic page loader */}
      {!loaded && <PageLoader onComplete={handleLoaded} />}

      {/* Global UI chrome */}
      <CursorTrail />
      <ScrollProgressBar />
      <BackToTop />

      {/* Main content — hidden until loader completes */}
      <div className={`app-content ${loaded ? "app-content--visible" : ""}`}>
        <NavBar />
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <ShowcaseSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <LogoShowcase />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FeatureCards />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TechStack />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
    </ToastProvider>
  );
};

export default App;
