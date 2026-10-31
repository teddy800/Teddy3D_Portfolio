/**
 * 🚀 ADVANCED PERFORMANCE OPTIMIZATION SYSTEM
 * Zero-lag, enterprise-grade performance utilities
 */

// ============================================================================
// SMART RESOURCE PRELOADING
// ============================================================================

class ResourcePreloader {
  constructor() {
    this.preloaded = new Set();
    this.loading = new Map();
    this.cache = new Map();
  }

  /**
   * Preload image with priority
   */
  async preloadImage(url, priority = 'high') {
    if (this.preloaded.has(url)) return this.cache.get(url);
    if (this.loading.has(url)) return this.loading.get(url);

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.fetchPriority = priority;
      img.decoding = 'async';
      
      img.onload = () => {
        this.preloaded.add(url);
        this.cache.set(url, img);
        this.loading.delete(url);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loading.delete(url);
        reject(new Error(`Failed to load: ${url}`));
      };
      
      img.src = url;
    });

    this.loading.set(url, promise);
    return promise;
  }

  /**
   * Preload multiple images in parallel
   */
  async preloadImages(urls, priority = 'high') {
    return Promise.all(urls.map(url => this.preloadImage(url, priority)));
  }

  /**
   * Preload 3D model
   */
  preloadModel(url) {
    if (this.preloaded.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    this.preloaded.add(url);
  }

  /**
   * Preload font
   */
  preloadFont(url) {
    if (this.preloaded.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    this.preloaded.add(url);
  }
}

export const preloader = new ResourcePreloader();

// ============================================================================
// ADVANCED RAF (REQUEST ANIMATION FRAME) SCHEDULER
// ============================================================================

class RAFScheduler {
  constructor() {
    this.tasks = new Map();
    this.priorities = { high: [], medium: [], low: [] };
    this.isRunning = false;
    this.frameId = null;
  }

  /**
   * Schedule a task with priority
   */
  schedule(id, task, priority = 'medium') {
    if (this.tasks.has(id)) {
      this.cancel(id);
    }

    this.tasks.set(id, { task, priority });
    this.priorities[priority].push(id);

    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * Cancel a scheduled task
   */
  cancel(id) {
    const item = this.tasks.get(id);
    if (!item) return;

    this.tasks.delete(id);
    this.priorities[item.priority] = this.priorities[item.priority].filter(i => i !== id);
  }

  /**
   * Execute tasks in order of priority
   */
  tick = () => {
    const start = performance.now();
    const frameTime = 16.67; // 60 FPS budget

    // Process high priority first
    for (const priority of ['high', 'medium', 'low']) {
      while (this.priorities[priority].length > 0) {
        if (performance.now() - start > frameTime) {
          // Out of time, continue next frame
          this.frameId = requestAnimationFrame(this.tick);
          return;
        }

        const id = this.priorities[priority].shift();
        const item = this.tasks.get(id);
        
        if (item) {
          try {
            item.task();
          } catch (error) {
            console.error(`RAF task error:`, error);
          }
          this.tasks.delete(id);
        }
      }
    }

    // All tasks done
    if (this.tasks.size === 0) {
      this.stop();
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

export const rafScheduler = new RAFScheduler();

// ============================================================================
// INTERSECTION OBSERVER POOL (REUSE OBSERVERS)
// ============================================================================

class ObserverPool {
  constructor() {
    this.observers = new Map();
  }

  /**
   * Get or create observer for specific config
   */
  getObserver(options = {}) {
    const key = JSON.stringify(options);
    
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const callbacks = entry.target.__observerCallbacks || [];
          callbacks.forEach(cb => cb(entry));
        });
      }, options);
      
      this.observers.set(key, observer);
    }
    
    return this.observers.get(key);
  }

  /**
   * Observe element with callback
   */
  observe(element, callback, options = {}) {
    if (!element) return () => {};

    const observer = this.getObserver(options);
    
    if (!element.__observerCallbacks) {
      element.__observerCallbacks = [];
    }
    element.__observerCallbacks.push(callback);
    
    observer.observe(element);

    // Return cleanup function
    return () => {
      element.__observerCallbacks = element.__observerCallbacks.filter(cb => cb !== callback);
      
      if (element.__observerCallbacks.length === 0) {
        observer.unobserve(element);
        delete element.__observerCallbacks;
      }
    };
  }
}

export const observerPool = new ObserverPool();

// ============================================================================
// SMART EVENT DELEGATION
// ============================================================================

class EventDelegator {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Add delegated event listener
   */
  on(eventType, selector, handler, options = {}) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
      
      const delegatedHandler = (e) => {
        const listeners = this.listeners.get(eventType) || [];
        
        listeners.forEach(({ selector, handler }) => {
          const target = e.target.closest(selector);
          if (target) {
            handler.call(target, e, target);
          }
        });
      };
      
      document.addEventListener(eventType, delegatedHandler, { 
        passive: options.passive !== false,
        capture: options.capture || false,
      });
    }
    
    this.listeners.get(eventType).push({ selector, handler });
  }

  /**
   * Remove delegated event listener
   */
  off(eventType, selector, handler) {
    const listeners = this.listeners.get(eventType);
    if (!listeners) return;
    
    this.listeners.set(
      eventType,
      listeners.filter(l => l.selector !== selector || l.handler !== handler)
    );
  }
}

export const eventDelegator = new EventDelegator();

// ============================================================================
// IDLE CALLBACK SCHEDULER (BACKGROUND TASKS)
// ============================================================================

class IdleScheduler {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  /**
   * Schedule task to run when browser is idle
   */
  schedule(task, options = {}) {
    this.queue.push({ task, options });
    
    if (!this.processing) {
      this.process();
    }
  }

  process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;

    if ('requestIdleCallback' in window) {
      requestIdleCallback((deadline) => {
        while (deadline.timeRemaining() > 0 && this.queue.length > 0) {
          const { task } = this.queue.shift();
          try {
            task();
          } catch (error) {
            console.error('Idle task error:', error);
          }
        }
        
        this.process();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        if (this.queue.length > 0) {
          const { task } = this.queue.shift();
          try {
            task();
          } catch (error) {
            console.error('Idle task error:', error);
          }
        }
        this.process();
      }, 50);
    }
  }
}

export const idleScheduler = new IdleScheduler();

// ============================================================================
// MEMORY MONITORING & CLEANUP
// ============================================================================

export const memoryMonitor = {
  threshold: 0.8, // 80% of limit
  
  /**
   * Check if memory usage is high
   */
  isHighMemory() {
    if (!performance.memory) return false;
    
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    return (usedJSHeapSize / jsHeapSizeLimit) > this.threshold;
  },

  /**
   * Force cleanup if memory is high
   */
  cleanup() {
    if (this.isHighMemory() && window.gc) {
      window.gc();
    }
  },

  /**
   * Get memory stats
   */
  getStats() {
    if (!performance.memory) return null;
    
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    
    return {
      used: (usedJSHeapSize / 1048576).toFixed(2), // MB
      total: (totalJSHeapSize / 1048576).toFixed(2), // MB
      limit: (jsHeapSizeLimit / 1048576).toFixed(2), // MB
      usage: ((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(1), // %
    };
  },
};

// ============================================================================
// AUTOMATIC OPTIMIZATION
// ============================================================================

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  // 1. Preload critical resources
  const criticalImages = [
    '/images/bg.png',
    '/images/T.png',
  ];
  
  idleScheduler.schedule(() => {
    preloader.preloadImages(criticalImages, 'high');
  });

  // 2. Preload 3D models
  const models = [
    '/models/optimized-room.glb',
    '/models/react_logo-transformed.glb',
    '/models/python-transformed.glb',
    '/models/javascript-transformed.glb',
  ];
  
  idleScheduler.schedule(() => {
    models.forEach(model => preloader.preloadModel(model));
  });

  // 3. Setup passive event listeners
  ['wheel', 'touchstart', 'touchmove'].forEach(event => {
    document.addEventListener(event, () => {}, { passive: true });
  });

  // 4. Periodic memory cleanup
  setInterval(() => {
    if (memoryMonitor.isHighMemory()) {
      memoryMonitor.cleanup();
    }
  }, 60000); // Every minute

  // 5. Optimize scrolling
  let ticking = false;
  document.addEventListener('scroll', () => {
    if (!ticking) {
      rafScheduler.schedule('scroll-handler', () => {
        ticking = false;
        // Scroll handlers will be processed efficiently
      }, 'high');
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  preloader,
  rafScheduler,
  observerPool,
  eventDelegator,
  idleScheduler,
  memoryMonitor,
  initializePerformanceOptimizations,
};
