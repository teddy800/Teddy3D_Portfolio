// Advanced IntersectionObserver hook — mounts heavy components only when visible
import { useState, useEffect, useRef, useMemo } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  
  // Memoize options to avoid recreating observer on every render
  const observerOptions = useMemo(() => ({
    threshold: options.threshold || 0.05,
    rootMargin: options.rootMargin || "300px",
    root: options.root || null
  }), [options.threshold, options.rootMargin, options.root]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      observerOptions
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, [observerOptions]);

  return [ref, inView];
}
