import { lazy, Suspense } from "react";

// NavBar and Hero load immediately — above the fold
import NavBar from "./Components/NavBar";
import Hero from "./sections/Hero";

// All below-fold sections lazy-loaded — zero JS cost until needed
const ShowcaseSection = lazy(() => import("./sections/ShowcaseSection"));
const LogoShowcase    = lazy(() => import("./sections/LogoShowcase"));
const FeatureCards    = lazy(() => import("./sections/FeatureCards"));
const Experience      = lazy(() => import("./sections/Experience"));
const TechStack       = lazy(() => import("./sections/TechStack"));
const Testimonials    = lazy(() => import("./sections/Testimonials"));
const Contact         = lazy(() => import("./sections/Contact"));
const Footer          = lazy(() => import("./sections/Footer"));

// Minimal section-level fallback — no layout shift
const SectionFallback = () => (
  <div className="w-full py-20 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
  </div>
);

const App = () => (
  <>
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
  </>
);

export default App;
