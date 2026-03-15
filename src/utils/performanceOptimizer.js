/**
 * Advanced Performance Optimization Utilities
 * Handles memory management, lazy loading, and rendering optimization
 */

// Request Idle Callback polyfill for older browsers
const requestIdleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
const cancelIdleCallback = window.cancelIdleCallback || clearTimeout;

/**
 * Debounce function with leading/trailing options
 */
export const debounce = (func, wait, options = {}) => {
  let timeout, args, context, timestamp, result;
  const { leading = false, trailing = true, maxWait } = options;
  let lastCallTime;
  let lastInvokeTime = 0;
  let leading_called = false;

  const invokeFunc = (time) => {
    const result = func.apply(context, args);
    lastInvokeTime = time;
    timeout = undefined;
    return result;
  };

  const shouldInvoke = (time) => {
    if (lastInvokeTime === 0) return leading;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return timeSinceLastInvoke >= wait || timeSinceLastInvoke < 0 || (maxWait && time - lastCallTime >= maxWait);
  };

  const debounced = function (...args_) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    context = this;
    args = args_;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined && leading) {
        leading_called = true;
        result = invokeFunc(time);
      }
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (trailing && !leading_called) {
          result = invokeFunc(Date.now());
        }
        timeout = undefined;
        leading_called = false;
      }, wait);
    }
    return result;
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
    lastInvokeTime = 0;
    timeout = undefined;
  };

  return debounced;
};

/**
 * Throttle function - ensures function runs at most once per interval
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImages = () => {
  if (!('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.01,
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
};

/**
 * Preload critical resources
 */
export const preloadResource = (url, type = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = type;
  link.href = url;
  if (type === 'font') link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

/**
 * Prefetch resources for likely next navigation
 */
export const prefetchResource = (url) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Memory cleanup utility
 */
export const cleanupMemory = () => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize;
    const limit = performance.memory.jsHeapSizeLimit;
    const percentage = (used / limit) * 100;
    
    if (percentage > 85) {
      // Trigger garbage collection if available
      if (window.gc) window.gc();
    }
    
    return { used, limit, percentage };
  }
  return null;
};

/**
 * Monitor performance metrics
 */
export const monitorPerformance = () => {
  if (!window.performance || !window.performance.timing) return;

  const timing = window.performance.timing;
  const metrics = {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.requestStart,
    download: timing.responseEnd - timing.responseStart,
    domInteractive: timing.domInteractive - timing.navigationStart,
    domComplete: timing.domComplete - timing.navigationStart,
    loadComplete: timing.loadEventEnd - timing.navigationStart,
  };

  return metrics;
};

/**
 * Batch DOM updates to prevent layout thrashing
 */
export const batchDOMUpdates = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
};

/**
 * Optimize animations with RAF
 */
export const optimizeAnimation = (callback, fps = 60) => {
  const frameInterval = 1000 / fps;
  let lastFrameTime = 0;
  let rafId;

  const animate = (currentTime) => {
    if (currentTime - lastFrameTime >= frameInterval) {
      callback(currentTime);
      lastFrameTime = currentTime;
    }
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(rafId);
};

/**
 * Detect device capabilities
 */
export const detectDeviceCapabilities = () => {
  const capabilities = {
    hasWebGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    })(),
    hasWebWorker: typeof Worker !== 'undefined',
    hasServiceWorker: 'serviceWorker' in navigator,
    hasIntersectionObserver: 'IntersectionObserver' in window,
    hasRequestIdleCallback: 'requestIdleCallback' in window,
    cpuCores: navigator.hardwareConcurrency || 1,
    deviceMemory: navigator.deviceMemory || 4,
    connection: navigator.connection?.effectiveType || '4g',
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isTouchDevice: () => {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0));
    },
  };

  return capabilities;
};

/**
 * Adaptive loading based on device capabilities
 */
export const adaptiveLoad = (capabilities) => {
  const config = {
    enableWebGL: capabilities.hasWebGL && capabilities.connection !== 'slow-2g',
    enableAnimations: !capabilities.isReducedMotion && capabilities.connection !== 'slow-2g',
    particleCount: capabilities.connection === '4g' ? 100 : 50,
    modelQuality: capabilities.connection === '4g' ? 'high' : 'medium',
    imageQuality: capabilities.connection === '4g' ? 'webp' : 'jpg',
  };

  return config;
};

/**
 * Service Worker registration with error handling
 */
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

/**
 * Cache API helper
 */
export const cacheResource = async (cacheName, url) => {
  try {
    const cache = await caches.open(cacheName);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response.clone());
    }
  } catch (error) {
    console.error('Cache failed:', error);
  }
};

export default {
  debounce,
  throttle,
  lazyLoadImages,
  preloadResource,
  prefetchResource,
  cleanupMemory,
  monitorPerformance,
  batchDOMUpdates,
  optimizeAnimation,
  detectDeviceCapabilities,
  adaptiveLoad,
  registerServiceWorker,
  cacheResource,
};
