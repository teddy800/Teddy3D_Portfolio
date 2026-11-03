import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, memo, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Optimized3DCanvas from "../../Optimized3DCanvas";

// ============================================================================
// ULTRA-FAST CACHING SYSTEM - INSTANT LOADING
// ============================================================================
const modelCache = new Map();
const textureCache = new Map();
const geometryCache = new Map();
let preloadStarted = false;

// Aggressive preloading with priority queue
const preloadAllModels = () => {
  if (preloadStarted) return;
  preloadStarted = true;

  const modelPaths = [
    '/models/react_logo-transformed.glb',
    '/models/python-transformed.glb',
    '/models/node-transformed.glb',
    '/models/three.js-transformed.glb',
    '/models/git-svg-transformed.glb',
    '/models/javascript-transformed.glb',
    '/models/nextjs.glb',
    '/models/figma.glb',
    '/models/ai-brain.glb',
    '/models/react-native.glb',
  ];

  // Immediate preload with high priority
  modelPaths.forEach(path => {
    if (!modelCache.has(path)) {
      try {
        useGLTF.preload(path);
        modelCache.set(path, 'preloading');
      } catch (error) {
        console.warn(`Preload skipped for ${path}`);
      }
    }
  });
};

// Execute preload ASAP
if (typeof window !== 'undefined') {
  // Start preloading immediately
  setTimeout(() => preloadAllModels(), 0);
  
  // Also preload on user interaction for instant response
  const preloadOnInteraction = () => {
    preloadAllModels();
    window.removeEventListener('mousemove', preloadOnInteraction);
    window.removeEventListener('touchstart', preloadOnInteraction);
  };
  
  window.addEventListener('mousemove', preloadOnInteraction, { once: true, passive: true });
  window.addEventListener('touchstart', preloadOnInteraction, { once: true, passive: true });
}

// ============================================================================
// ULTRA-OPTIMIZED 3D SCENE - ZERO LAG, MAXIMUM PERFORMANCE
// ============================================================================
const TechScene = memo(({ model, isHovered }) => {
  const scene = useGLTF(model.modelPath);
  const { gl } = useThree();
  const groupRef = useRef();
  const optimizedRef = useRef(false);
  const rotationRef = useRef(0);

  // INSTANT one-time optimization - runs once and caches forever
  useEffect(() => {
    if (optimizedRef.current) return;
    
    const cacheKey = model.modelPath;
    
    // Check if already optimized globally
    if (geometryCache.has(cacheKey)) {
      optimizedRef.current = true;
      return;
    }

    // Special material for Interactive Developer
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child) => {
        if (child.isMesh && child.name === "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ 
            color: "white",
            metalness: 0.2,
            roughness: 0.8,
            precision: 'lowp',
          });
        }
      });
    }

    // ULTRA-AGGRESSIVE optimization for instant rendering
    scene.scene.traverse((child) => {
      if (child.isMesh) {
        // Disable expensive updates
        child.frustumCulled = true;
        child.matrixAutoUpdate = false;
        child.updateMatrix();
        
        // Material optimization
        if (child.material) {
          child.material.precision = 'lowp';
          child.material.flatShading = false;
          
          // Texture caching and optimization
          if (child.material.map && !textureCache.has(child.material.map.uuid)) {
            const texture = child.material.map;
            texture.anisotropy = 1; // Minimal for speed
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            textureCache.set(texture.uuid, texture);
          }
          
          // Disable expensive material features
          child.material.needsUpdate = false;
        }
        
        // Geometry optimization
        if (child.geometry && !child.geometry.boundingSphere) {
          child.geometry.computeBoundingSphere();
        }
      }
    });

    geometryCache.set(cacheKey, true);
    optimizedRef.current = true;
  }, [scene, model.name, model.modelPath, gl]);

  // Ultra-smooth rotation with requestAnimationFrame timing
  useFrame((state, delta) => {
    if (groupRef.current && isHovered) {
      rotationRef.current += delta * 0.5;
      groupRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <>
      {/* Minimal, performant lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 3]} intensity={0.6} castShadow={false} />
      
      {/* Lightweight environment - no background for speed */}
      <Environment preset="city" background={false} environmentIntensity={0.3} />
      
      <Float 
        speed={isHovered ? 5 : 3.5} 
        rotationIntensity={isHovered ? 0.4 : 0.2} 
        floatIntensity={isHovered ? 0.8 : 0.5}
        floatingRange={[-0.08, 0.08]}
      >
        <group 
          ref={groupRef}
          scale={model.scale} 
          rotation={model.rotation}
        >
          <primitive object={scene.scene} />
        </group>
      </Float>
      
      {/* Ultra-minimal controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableDamping={false}
        autoRotate={false}
        enableRotate={false}
        makeDefault 
      />
    </>
  );
});

TechScene.displayName = "TechScene";

// ============================================================================
// INSTANT-RENDER COMPONENT - ZERO LAG
// ============================================================================
const TechIconCardExperience = memo(({ model }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const observerRef = useRef(null);
  const cardRef = useRef(null);

  // ULTRA-AGGRESSIVE intersection observer - loads 300px before visible
  useEffect(() => {
    // Find the card element
    const cardElement = document.querySelector(`[data-tech="${model.name}"]`);
    if (!cardElement) return;
    
    cardRef.current = cardElement;

    // Create high-performance observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          // INSTANT rendering - no delays
          setShouldRender(true);
        }
      },
      { 
        threshold: [0, 0.01], // Trigger as soon as visible
        rootMargin: '300px 0px 300px 0px' // Load way before visible for instant appearance
      }
    );

    observerRef.current.observe(cardElement);

    // Optimized passive event listeners
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    cardElement.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    cardElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    return () => {
      if (observerRef.current && cardElement) {
        observerRef.current.unobserve(cardElement);
        observerRef.current.disconnect();
      }
      cardElement.removeEventListener('mouseenter', handleMouseEnter);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [model.name]);

  // Show instant placeholder - no loading states
  if (!shouldRender) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="w-20 h-20 rounded-full animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
          }}
        />
      </div>
    );
  }

  return (
    <Optimized3DCanvas
      shadows={false}
      postProcessing={false}
      frameloop="always"
      dpr={[1, 1.5]} // Limit pixel ratio for speed
      performance={{ min: 0.8 }} // Maintain performance
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
      gl={{ 
        antialias: false, // Disable for speed
        alpha: true,
        powerPreference: "high-performance",
        precision: 'lowp',
      }}
    >
      <TechScene model={model} isHovered={isHovered} />
    </Optimized3DCanvas>
  );
});

TechIconCardExperience.displayName = "TechIconCardExperience";

// ============================================================================
// ENHANCED PRELOAD FUNCTION - INSTANT MODEL LOADING
// ============================================================================
export const preloadTechModels = (models) => {
  // Immediate preload - no delays
  models.forEach((model) => {
    if (model.modelPath && !modelCache.has(model.modelPath)) {
      try {
        useGLTF.preload(model.modelPath);
        modelCache.set(model.modelPath, 'loaded');
      } catch (error) {
        console.warn(`Failed to preload ${model.modelPath}:`, error);
      }
    }
  });
  
  // Also trigger global preload if not started
  if (!preloadStarted) {
    preloadAllModels();
  }
};

export default TechIconCardExperience;
