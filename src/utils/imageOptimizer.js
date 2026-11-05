/**
 * 🖼️ ADVANCED IMAGE OPTIMIZATION SYSTEM
 * WebP support, lazy loading, and progressive image loading
 */

// ============================================================================
// WEBP SUPPORT DETECTION
// ============================================================================

let webpSupported = null;

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>} WebP support status
 */
export const checkWebPSupport = () => {
  if (webpSupported !== null) {
    return Promise.resolve(webpSupported);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0;
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
};

// ============================================================================
// SMART IMAGE SOURCE SELECTOR
// ============================================================================

/**
 * Get optimized image source (WebP if supported)
 * @param {string} imagePath Original image path
 * @returns {Promise<string>} Optimized image path
 */
export const getOptimizedImageSrc = async (imagePath) => {
  const isWebPSupported = await checkWebPSupport();
  
  if (isWebPSupported && !imagePath.endsWith('.webp')) {
    // Try WebP version
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Check if WebP version exists
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(webpPath);
      img.onerror = () => resolve(imagePath); // Fallback to original
      img.src = webpPath;
    });
  }
  
  return imagePath;
};

// ============================================================================
// LAZY IMAGE LOADING
// ============================================================================

class LazyImageLoader {
  constructor() {
    this.observer = null;
    this.images = new WeakMap();
    this.initialized = false;
  }

  /**
   * Initialize IntersectionObserver for lazy loading
   */
  init(options = {}) {
    if (this.initialized) return;

    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.observer.unobserve(img);
        }
      });
    }, { ...defaultOptions, ...options });

    this.initialized = true;
  }

  /**
   * Load image
   * @param {HTMLImageElement} img Image element
   */
  async loadImage(img) {
    const src = img.dataset.src || img.getAttribute('data-src');
    const srcset = img.dataset.srcset || img.getAttribute('data-srcset');
    
    if (!src && !srcset) return;

    // Get optimized source
    const optimizedSrc = await getOptimizedImageSrc(src);

    // Create a temporary image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = optimizedSrc;
      if (srcset) img.srcset = srcset;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    };

    tempImg.onerror = () => {
      // Fallback to original src
      img.src = src;
      img.classList.add('loaded', 'error');
    };

    tempImg.src = optimizedSrc;
  }

  /**
   * Observe an image for lazy loading
   * @param {HTMLImageElement} img Image element
   */
  observe(img) {
    if (!this.initialized) {
      this.init();
    }
    
    if (img && img.tagName === 'IMG') {
      this.observer.observe(img);
    }
  }

  /**
   * Unobserve an image
   * @param {HTMLImageElement} img Image element
   */
  unobserve(img) {
    if (this.observer && img) {
      this.observer.unobserve(img);
    }
  }

  /**
   * Disconnect observer
   */
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.initialized = false;
    }
  }
}

export const lazyImageLoader = new LazyImageLoader();

// ============================================================================
// PROGRESSIVE IMAGE LOADING
// ============================================================================

/**
 * Load image progressively (blur-up effect)
 * @param {HTMLImageElement} img Image element
 * @param {string} lowQualitySrc Low quality placeholder
 * @param {string} highQualitySrc High quality image
 */
export const loadImageProgressively = async (img, lowQualitySrc, highQualitySrc) => {
  // Load low quality first
  img.src = lowQualitySrc;
  img.style.filter = 'blur(10px)';
  img.classList.add('loading');

  // Get optimized high quality source
  const optimizedSrc = await getOptimizedImageSrc(highQualitySrc);

  // Load high quality in background
  const highQualityImg = new Image();
  
  highQualityImg.onload = () => {
    img.src = optimizedSrc;
    img.style.filter = 'blur(0)';
    img.classList.remove('loading');
    img.classList.add('loaded');
  };

  highQualityImg.onerror = () => {
    // Keep low quality if high quality fails
    img.style.filter = 'blur(0)';
    img.classList.remove('loading');
    img.classList.add('error');
  };

  highQualityImg.src = optimizedSrc;
};

// ============================================================================
// IMAGE PRELOADING
// ============================================================================

const imageCache = new Map();

/**
 * Preload images
 * @param {string[]} imagePaths Array of image paths
 * @param {Object} options Preload options
 * @returns {Promise<void>}
 */
export const preloadImages = async (imagePaths, options = {}) => {
  const { priority = 'low', optimize = true } = options;

  const promises = imagePaths.map(async (path) => {
    if (imageCache.has(path)) {
      return imageCache.get(path);
    }

    const src = optimize ? await getOptimizedImageSrc(path) : path;

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.fetchPriority = priority;
      img.decoding = 'async';
      
      img.onload = () => {
        imageCache.set(path, img);
        resolve(img);
      };
      
      img.onerror = () => reject(new Error(`Failed to preload: ${path}`));
      
      img.src = src;
    });

    return promise;
  });

  return Promise.allSettled(promises);
};

// ============================================================================
// RESPONSIVE IMAGE SELECTOR
// ============================================================================

/**
 * Get responsive image source based on screen size
 * @param {Object} sources Image sources for different sizes
 * @returns {string} Appropriate image source
 */
export const getResponsiveImageSrc = (sources) => {
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;

  if (width <= 640 && sources.mobile) {
    return dpr > 1 && sources.mobile2x ? sources.mobile2x : sources.mobile;
  } else if (width <= 1024 && sources.tablet) {
    return dpr > 1 && sources.tablet2x ? sources.tablet2x : sources.tablet;
  } else if (sources.desktop) {
    return dpr > 1 && sources.desktop2x ? sources.desktop2x : sources.desktop;
  }

  return sources.default || sources.desktop || sources.tablet || sources.mobile;
};

// ============================================================================
// IMAGE OPTIMIZATION UTILITIES
// ============================================================================

/**
 * Compress image on client side (Canvas API)
 * @param {File} file Image file
 * @param {number} quality Quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const scale = Math.min(1, maxWidth / img.width);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions without loading full image
 * @param {string} src Image source
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
};

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

// Initialize lazy loading on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      lazyImageLoader.init();
      
      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach((img) => {
        lazyImageLoader.observe(img);
      });
    });
  } else {
    lazyImageLoader.init();
  }
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  checkWebPSupport,
  getOptimizedImageSrc,
  lazyImageLoader,
  loadImageProgressively,
  preloadImages,
  getResponsiveImageSrc,
  compressImage,
  getImageDimensions,
};
