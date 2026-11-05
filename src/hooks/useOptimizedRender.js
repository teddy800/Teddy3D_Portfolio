/**
 * 🚀 OPTIMIZED RENDER HOOK
 * Prevents unnecessary re-renders and optimizes component performance
 */

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

/**
 * Hook to prevent unnecessary re-renders by deep comparing props
 * @param {Function} Component Component to render
 * @param {Object} props Component props
 * @returns {React.Component} Memoized component
 */
export const useDeepCompareMemo = (value) => {
  const ref = useRef();
  const signalRef = useRef(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return useMemo(() => ref.current, [signalRef.current]);
};

/**
 * Deep equality check
 * @param {*} a First value
 * @param {*} b Second value
 * @returns {boolean} Are values equal
 */
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Hook to debounce values (prevents rapid updates)
 * @param {*} value Value to debounce
 * @param {number} delay Delay in ms
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook to throttle values (rate limiting)
 * @param {*} value Value to throttle
 * @param {number} interval Interval in ms
 * @returns {*} Throttled value
 */
export const useThrottle = (value, interval = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastUpdate);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * Hook for optimized scroll handling
 * @param {Function} callback Scroll callback
 * @param {number} throttleMs Throttle interval
 */
export const useOptimizedScroll = (callback, throttleMs = 100) => {
  const callbackRef = useRef(callback);
  const frameId = useRef(null);
  const lastCall = useRef(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      
      if (now - lastCall.current < throttleMs) {
        if (frameId.current) {
          cancelAnimationFrame(frameId.current);
        }
        
        frameId.current = requestAnimationFrame(() => {
          lastCall.current = now;
          callbackRef.current();
        });
      } else {
        lastCall.current = now;
        callbackRef.current();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [throttleMs]);
};

/**
 * Hook for optimized resize handling
 * @param {Function} callback Resize callback
 * @param {number} debounceMs Debounce interval
 */
export const useOptimizedResize = (callback, debounceMs = 200) => {
  const callbackRef = useRef(callback);
  const timeoutId = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleResize = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        callbackRef.current();
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [debounceMs]);
};

/**
 * Hook for intersection observer (viewport visibility)
 * @param {Object} options Observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);

  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        setEntry(entry);

        if (freezeOnceVisible && isVisible) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [ref, isIntersecting, entry];
};

/**
 * Hook to detect when component is idle (no updates for X time)
 * @param {number} idleTime Time in ms to consider idle
 * @returns {boolean} Is component idle
 */
export const useIdleDetection = (idleTime = 2000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
    }, idleTime);
  }, [idleTime]);

  useEffect(() => {
    resetIdleTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetIdleTimer]);

  return isIdle;
};

/**
 * Hook to prevent rendering when tab is hidden
 * @returns {boolean} Is tab visible
 */
export const useTabVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

/**
 * Hook for RAF-based animation loops (optimized)
 * @param {Function} callback Animation callback
 * @param {boolean} enabled Is animation enabled
 */
export const useAnimationFrame = (callback, enabled = true) => {
  const callbackRef = useRef(callback);
  const frameRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let lastTime = 0;
    const animate = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      callbackRef.current(deltaTime, time);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled]);
};

/**
 * Hook to measure component render time
 * @param {string} componentName Component name for logging
 */
export const useRenderTime = (componentName) => {
  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (renderTime > 16.67) { // Slower than 60fps
      console.warn(`⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
    
    renderStartTime.current = performance.now();
  });
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  useDeepCompareMemo,
  useDebounce,
  useThrottle,
  useOptimizedScroll,
  useOptimizedResize,
  useIntersectionObserver,
  useIdleDetection,
  useTabVisibility,
  useAnimationFrame,
  useRenderTime,
};
