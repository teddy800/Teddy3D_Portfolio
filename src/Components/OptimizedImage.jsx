/**
 * 🖼️ Optimized Image Component
 * Features: Lazy loading, blur placeholder, WebP/AVIF support, responsive images
 */

import { memo, useState, useEffect, useRef } from "react";

/**
 * Optimized Image Component with modern image loading techniques
 * @param {Object} props Component props
 * @param {string} props.src Image source URL
 * @param {string} props.alt Alt text for accessibility
 * @param {string} props.className CSS classes
 * @param {Object} props.sizes Responsive image sizes
 * @param {boolean} props.priority Priority loading (disable lazy load)
 * @param {string} props.placeholder Placeholder type: 'blur' | 'empty'
 * @param {Function} props.onLoad Callback when image loads
 */
const OptimizedImage = memo(({
  src,
  alt = "",
  className = "",
  sizes,
  priority = false,
  placeholder = "blur",
  onLoad,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before visible
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Generate WebP and AVIF sources
  const getImageSources = (imagePath) => {
    if (!imagePath) return [];
    
    const ext = imagePath.split('.').pop();
    const basePath = imagePath.replace(`.${ext}`, '');
    
    return [
      { type: 'image/avif', src: `${basePath}.avif` },
      { type: 'image/webp', src: `${basePath}.webp` },
      { type: `image/${ext}`, src: imagePath },
    ];
  };

  // Generate srcset for responsive images
  const generateSrcSet = (imagePath) => {
    if (!imagePath || !sizes) return null;
    
    const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
    const ext = imagePath.split('.').pop();
    const basePath = imagePath.replace(`.${ext}`, '');
    
    return widths.map(width => `${basePath}-${width}w.${ext} ${width}w`).join(', ');
  };

  const sources = getImageSources(imageSrc);
  const srcSet = generateSrcSet(imageSrc);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        backgroundColor: placeholder === 'blur' && !isLoaded ? '#1a1a1a' : 'transparent',
      }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && isInView && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Actual image */}
      {isInView && imageSrc && (
        <picture>
          {sources.slice(0, -1).map((source, idx) => (
            <source 
              key={idx}
              type={source.type}
              srcSet={srcSet || source.src}
              sizes={sizes}
            />
          ))}
          <img
            src={sources[sources.length - 1].src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            {...rest}
          />
        </picture>
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;

/**
 * Shimmer animation for loading placeholder
 */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}
