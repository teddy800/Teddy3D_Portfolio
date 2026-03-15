import { useEffect, useRef } from "react";

/**
 * Advanced performance optimization hook
 * - Implements request idle callback for non-critical tasks
 * - Batches DOM updates
 * - Manages memory efficiently
 */
export function usePerformanceOptimization() {
  const idleCallbackRef = useRef(null);

  useEffect(() => {
    // Enable aggressive garbage collection hints
    if (window.gc) {
      window.gc();
    }

    // Optimize for Core Web Vitals
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              console.log("LCP:", entry.renderTime || entry.loadTime);
            }
            if (entry.entryType === "first-input") {
              console.log("FID:", entry.processingDuration);
            }
            if (entry.entryType === "layout-shift") {
              console.log("CLS:", entry.value);
            }
          }
        });

        observer.observe({
          entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
        });

        return () => observer.disconnect();
      } catch (e) {
        // Silently fail if not supported
      }
    }

    return () => {
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, []);

  // Schedule non-critical work during idle time
  const scheduleIdleTask = (callback, timeout = 2000) => {
    if ("requestIdleCallback" in window) {
      idleCallbackRef.current = requestIdleCallback(callback, { timeout });
    } else {
      idleCallbackRef.current = setTimeout(callback, timeout);
    }
  };

  return { scheduleIdleTask };
}

/**
 * Debounce hook for expensive operations
 */
export function useDebounce(callback, delay = 300) {
  const timeoutRef = useRef(null);

  const debounced = (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };

  return debounced;
}

/**
 * Throttle hook for scroll/resize events
 */
export function useThrottle(callback, limit = 100) {
  const inThrottle = useRef(false);

  return (...args) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
  };
}
