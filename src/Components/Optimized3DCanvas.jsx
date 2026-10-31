/**
 * 🚀 Optimized 3D Canvas Component
 * Adaptive quality, shared context, and performance monitoring
 */

import { Canvas } from "@react-three/fiber";
import { memo, useMemo, useEffect, useState } from "react";
import { 
  detectDeviceCapabilities, 
  getAdaptiveQualitySettings,
  cleanupThreeResources 
} from "../utils/performanceMonitor";

/**
 * Optimized Canvas wrapper with adaptive quality settings
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Canvas children
 * @param {Object} props.camera Camera configuration
 * @param {boolean} props.shadows Enable shadows
 * @param {boolean} props.postProcessing Enable post-processing
 * @param {string} props.frameloop Frame loop mode ('always', 'demand', 'never')
 * @param {Function} props.onCreated Callback when canvas is created
 */
const Optimized3DCanvas = memo(({ 
  children, 
  camera = {}, 
  shadows = true,
  postProcessing = true,
  frameloop = 'always',
  onCreated,
  className = '',
  ...rest 
}) => {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [qualitySettings, setQualitySettings] = useState(null);

  // Detect device capabilities on mount
  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    
    const settings = getAdaptiveQualitySettings(capabilities.tier);
    setQualitySettings(settings);
    
    console.log(`🎮 Device Tier: ${capabilities.tier}`, settings);
  }, []);

  // Memoize camera configuration
  const cameraConfig = useMemo(() => ({
    position: camera.position || [0, 0, 15],
    fov: camera.fov || 45,
    near: camera.near || 0.1,
    far: camera.far || 1000,
  }), [camera]);

  // Memoize WebGL configuration based on device tier
  const glConfig = useMemo(() => {
    if (!qualitySettings) return {};
    
    const isMobile = window.innerWidth < 768;
    
    return {
      antialias: qualitySettings.antialias && !isMobile,
      powerPreference: "high-performance",
      alpha: true,
      stencil: false,
      depth: true,
      precision: qualitySettings.precision,
      logarithmicDepthBuffer: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
    };
  }, [qualitySettings]);

  // Handle canvas creation
  const handleCreated = (state) => {
    if (!qualitySettings) return;
    
    // Set pixel ratio based on device tier
    state.gl.setPixelRatio(qualitySettings.pixelRatio);
    
    // Set clear color
    state.gl.setClearColor(0x000000, 0);
    
    // Enable shadows if supported
    if (shadows && qualitySettings.shadows) {
      state.gl.shadowMap.enabled = true;
      state.gl.shadowMap.type = qualitySettings.antialias ? 2 : 0; // PCFSoftShadowMap : BasicShadowMap
    }
    
    // Optimize renderer settings
    state.gl.physicallyCorrectLights = false; // Faster lighting
    state.gl.toneMapping = 0; // NoToneMapping - fastest
    
    // Call user's onCreated callback
    if (onCreated) {
      onCreated(state);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup Three.js resources
      console.log('🧹 Cleaning up 3D resources');
    };
  }, []);

  // Don't render until we have quality settings
  if (!qualitySettings) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    );
  }

  return (
    <Canvas
      camera={cameraConfig}
      dpr={[1, qualitySettings.pixelRatio]}
      frameloop={frameloop}
      gl={glConfig}
      shadows={shadows && qualitySettings.shadows}
      performance={{ 
        min: 0.5, 
        max: 1,
        debounce: 200,
      }}
      onCreated={handleCreated}
      className={className}
      {...rest}
    >
      {children}
    </Canvas>
  );
});

Optimized3DCanvas.displayName = "Optimized3DCanvas";

export default Optimized3DCanvas;

/**
 * Hook to get current quality settings
 * @returns {Object} Quality settings
 */
export const useQualitySettings = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    const qualitySettings = getAdaptiveQualitySettings(capabilities.tier);
    setSettings(qualitySettings);
  }, []);

  return settings;
};

/**
 * Hook to adapt quality based on FPS
 * @param {number} targetFPS Target FPS (default: 55)
 * @returns {string} Current quality tier
 */
export const useAdaptiveFPS = (targetFPS = 55) => {
  const [tier, setTier] = useState('mid');
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;

    const measureFPS = (currentTime) => {
      frameCount++;
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / delta);
        setFps(currentFPS);

        // Adapt quality based on FPS
        if (currentFPS < targetFPS - 10) {
          setTier(prev => prev === 'high' ? 'mid' : prev === 'mid' ? 'low' : 'low');
        } else if (currentFPS > targetFPS + 5) {
          setTier(prev => prev === 'low' ? 'mid' : prev === 'mid' ? 'high' : 'high');
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [targetFPS]);

  return { tier, fps };
};
