/**
 * 🚀 Advanced Performance Monitoring & Optimization Utilities
 * Provides real-time performance tracking, adaptive quality adjustment,
 * and memory management for optimal user experience
 */

// ============================================================================
// DEVICE TIER DETECTION
// ============================================================================

/**
 * Detect device capabilities and classify into performance tiers
 * @returns {Object} Device capabilities and tier classification
 */
export const detectDeviceCapabilities = () => {
  const capabilities = {
    // Hardware
    cores: navigator.hardwareConcurrency || 2,
    memory: navigator.deviceMemory || 4, // GB
    gpu: detectGPUTier(),
    
    // Network
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
    effectiveType: (navigator.connection?.effectiveType) || '4g',
    downlink: navigator.connection?.downlink || 10, // Mbps
    
    // Display
    dpr: window.devicePixelRatio || 1,
    width: window.innerWidth,
    height: window.innerHeight,
    
    // Battery
    battery: null, // Will be populated async
    
    // Performance
    memory: performance.memory || {},
  };

  // Classify into tiers: high, mid, low
  capabilities.tier = classifyDeviceTier(capabilities);
  
  return capabilities;
};

/**
 * Detect GPU tier using WebGL renderer info
 * @returns {string} GPU tier: 'high', 'mid', 'low'
 */
const detectGPUTier = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'mid';
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    // High-end GPUs
    if (/NVIDIA|GeForce RTX|AMD Radeon RX/i.test(renderer)) return 'high';
    
    // Mid-range GPUs
    if (/Intel|Mali|Adreno 6/i.test(renderer)) return 'mid';
    
    // Low-end GPUs
    return 'low';
  } catch (error) {
    return 'mid';
  }
};

/**
 * Classify device into performance tier
 * @param {Object} capabilities Device capabilities
 * @returns {string} Tier: 'high', 'mid', 'low'
 */
const classifyDeviceTier = (capabilities) => {
  const score = 
    (capabilities.cores >= 8 ? 3 : capabilities.cores >= 4 ? 2 : 1) +
    (capabilities.memory >= 8 ? 3 : capabilities.memory >= 4 ? 2 : 1) +
    (capabilities.gpu === 'high' ? 3 : capabilities.gpu === 'mid' ? 2 : 1) +
    (capabilities.width >= 1920 ? 2 : capabilities.width >= 1280 ? 1 : 0);
  
  if (score >= 9) return 'high';
  if (score >= 6) return 'mid';
  return 'low';
};

// ============================================================================
// ADAPTIVE QUALITY SETTINGS
// ============================================================================

/**
 * Get optimized quality settings based on device tier
 * @param {string} tier Device tier
 * @returns {Object} Quality configuration
 */
export const getAdaptiveQualitySettings = (tier = 'mid') => {
  const settings = {
    high: {
      // 3D Settings
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      shadows: true,
      shadowMapSize: 2048,
      particleCount: 150,
      bloomIntensity: 0.4,
      postProcessing: true,
      precision: 'highp',
      
      // Animation Settings
      animationQuality: 'high',
      gsapEase: 'power4.out',
      staggerDelay: 0.05,
      
      // Loading Settings
      lazyLoadThreshold: '400px',
      prefetchEnabled: true,
    },
    mid: {
      // 3D Settings
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      antialias: true,
      shadows: true,
      shadowMapSize: 1024,
      particleCount: 80,
      bloomIntensity: 0.3,
      postProcessing: true,
      precision: 'mediump',
      
      // Animation Settings
      animationQuality: 'medium',
      gsapEase: 'power3.out',
      staggerDelay: 0.08,
      
      // Loading Settings
      lazyLoadThreshold: '300px',
      prefetchEnabled: true,
    },
    low: {
      // 3D Settings
      pixelRatio: 1,
      antialias: false,
      shadows: false,
      shadowMapSize: 512,
      particleCount: 40,
      bloomIntensity: 0.2,
      postProcessing: false,
      precision: 'lowp',
      
      // Animation Settings
      animationQuality: 'low',
      gsapEase: 'power2.out',
      staggerDelay: 0.1,
      
      // Loading Settings
      lazyLoadThreshold: '200px',
      prefetchEnabled: false,
    },
  };
  
  return settings[tier] || settings.mid;
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

class PerformanceMonitor {
  constructor() {
    this.fps = 60;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.metrics = {
      fps: [],
      memory: [],
      loadTime: 0,
      fcp: 0,
      lcp: 0,
      tti: 0,
      cls: 0,
    };
    this.observers = [];
  }

  /**
   * Start monitoring performance metrics
   */
  start() {
    // FPS monitoring
    this.monitorFPS();
    
    // Web Vitals monitoring
    this.monitorWebVitals();
    
    // Memory monitoring
    if (performance.memory) {
      this.monitorMemory();
    }
    
    // Long tasks monitoring
    this.monitorLongTasks();
  }

  /**
   * Monitor FPS in real-time
   */
  monitorFPS() {
    const measureFPS = (currentTime) => {
      this.frameCount++;
      const delta = currentTime - this.lastTime;
      
      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.metrics.fps.push(this.fps);
        
        // Keep only last 60 measurements
        if (this.metrics.fps.length > 60) {
          this.metrics.fps.shift();
        }
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      this.rafId = requestAnimationFrame(measureFPS);
    };
    
    this.rafId = requestAnimationFrame(measureFPS);
  }

  /**
   * Monitor Web Vitals (FCP, LCP, CLS, TTI)
   */
  monitorWebVitals() {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  /**
   * Monitor memory usage
   */
  monitorMemory() {
    const measureMemory = () => {
      if (performance.memory) {
        const memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize / 1048576, // MB
          totalJSHeapSize: performance.memory.totalJSHeapSize / 1048576, // MB
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / 1048576, // MB
        };
        
        this.metrics.memory.push(memory);
        
        // Keep only last 60 measurements
        if (this.metrics.memory.length > 60) {
          this.metrics.memory.shift();
        }
      }
    };
    
    // Measure every 5 seconds
    this.memoryInterval = setInterval(measureMemory, 5000);
  }

  /**
   * Monitor long tasks (> 50ms)
   */
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // longtask API not supported
      }
    }
  }

  /**
   * Get current metrics
   * @returns {Object} Current performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      currentFPS: this.fps,
      avgFPS: this.metrics.fps.length > 0 
        ? Math.round(this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length)
        : 0,
      currentMemory: this.metrics.memory.length > 0 
        ? this.metrics.memory[this.metrics.memory.length - 1]
        : null,
    };
  }

  /**
   * Stop monitoring and cleanup
   */
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Singleton instance
let monitorInstance = null;

/**
 * Get or create performance monitor instance
 * @returns {PerformanceMonitor} Monitor instance
 */
export const getPerformanceMonitor = () => {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
    monitorInstance.start();
  }
  return monitorInstance;
};

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

/**
 * Force garbage collection (if available)
 */
export const forceGarbageCollection = () => {
  if (window.gc) {
    window.gc();
  }
};

/**
 * Cleanup unused resources
 * @param {Object} three Three.js scene/renderer
 */
export const cleanupThreeResources = (three) => {
  if (!three) return;
  
  // Dispose geometries
  three.scene?.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    
    // Dispose materials
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    
    // Dispose textures
    if (object.material?.map) object.material.map.dispose();
    if (object.material?.normalMap) object.material.normalMap.dispose();
    if (object.material?.roughnessMap) object.material.roughnessMap.dispose();
    if (object.material?.metalnessMap) object.material.metalnessMap.dispose();
  });
  
  // Dispose renderer
  if (three.renderer) {
    three.renderer.dispose();
    three.renderer.forceContextLoss();
  }
};

// ============================================================================
// THROTTLE & DEBOUNCE
// ============================================================================

/**
 * Throttle function execution
 * @param {Function} func Function to throttle
 * @param {number} limit Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function execution
 * @param {Function} func Function to debounce
 * @param {number} delay Delay in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// ============================================================================
// PREFETCH & PRELOAD
// ============================================================================

/**
 * Prefetch resource on hover
 * @param {string} url Resource URL
 * @param {string} type Resource type (script, style, image, etc.)
 */
export const prefetchOnHover = (url, type = 'script') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Preload critical resource
 * @param {string} url Resource URL
 * @param {string} type Resource type
 */
export const preloadResource = (url, type = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  detectDeviceCapabilities,
  getAdaptiveQualitySettings,
  getPerformanceMonitor,
  cleanupThreeResources,
  forceGarbageCollection,
  throttle,
  debounce,
  prefetchOnHover,
  preloadResource,
};
