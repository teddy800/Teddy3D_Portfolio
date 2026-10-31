import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, memo, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Optimized3DCanvas from "../../Optimized3DCanvas";

// Global model cache for instant reuse
const modelCache = new Map();
const textureCache = new Map();

// Preload all models immediately on module load for instant access
const preloadAllModels = () => {
  const modelPaths = [
    '/models/react_logo-transformed.glb',
    '/models/python-transformed.glb',
    '/models/javascript-transformed.glb',
    '/models/node-transformed.glb',
    '/models/nextjs.glb',
    '/models/three.js-transformed.glb',
    '/models/figma.glb',
    '/models/git-svg-transformed.glb',
    '/models/ai-brain.glb',
    '/models/react-native.glb',
  ];

  modelPaths.forEach(path => {
    if (!modelCache.has(path)) {
      useGLTF.preload(path);
      modelCache.set(path, true);
    }
  });
};

// Execute preload immediately
if (typeof window !== 'undefined') {
  preloadAllModels();
}

// Ultra-fast scene with minimal overhead
const TechScene = memo(({ model, isHovered }) => {
  const scene = useGLTF(model.modelPath);
  const { gl } = useThree();
  const groupRef = useRef();
  const [isOptimized, setIsOptimized] = useState(false);

  // One-time optimization on mount
  useEffect(() => {
    if (isOptimized) return;

    // Apply special materials
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child) => {
        if (child.isMesh && child.name === "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ 
            color: "white",
            metalness: 0.3,
            roughness: 0.7,
          });
        }
      });
    }

    // Ultra-fast optimization
    scene.scene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        child.matrixAutoUpdate = false;
        child.updateMatrix();
        
        if (child.material) {
          // Optimize material
          child.material.precision = 'lowp';
          child.material.needsUpdate = true;
          
          // Cache and optimize textures
          if (child.material.map && !textureCache.has(child.material.map.uuid)) {
            const texture = child.material.map;
            texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            textureCache.set(texture.uuid, true);
          }
        }
        
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
        }
      }
    });

    setIsOptimized(true);
  }, [scene, model.name, gl, isOptimized]);

  // Smooth rotation animation for hover
  useFrame((state, delta) => {
    if (groupRef.current && isHovered) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      {/* Minimal lighting for performance */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow={false} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow={false} />
      
      {/* Lightweight environment */}
      <Environment preset="city" background={false} />
      
      <Float 
        speed={isHovered ? 6 : 4} 
        rotationIntensity={isHovered ? 0.6 : 0.3} 
        floatIntensity={isHovered ? 1 : 0.7}
        floatingRange={[-0.1, 0.1]}
      >
        <group 
          ref={groupRef}
          scale={model.scale} 
          rotation={model.rotation}
        >
          <primitive object={scene.scene} />
        </group>
      </Float>
      
      {/* Minimal controls for performance */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableDamping={false}
        autoRotate={false}
        makeDefault 
      />
    </>
  );
});

TechScene.displayName = "TechScene";

const TechIconCardExperience = memo(({ model }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Aggressive preloading - start loading before fully visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Immediate rendering for instant appearance
          requestAnimationFrame(() => {
            setShouldRender(true);
          });
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '200px' // Load well before visible for instant appearance
      }
    );

    const cardElement = document.querySelector(`[data-tech="${model.name}"]`);
    if (cardElement) {
      observer.observe(cardElement);
      
      // Optimized event handlers
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      
      cardElement.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      cardElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      
      return () => {
        observer.unobserve(cardElement);
        cardElement.removeEventListener('mouseenter', handleMouseEnter);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [model.name]);

  // Show static placeholder while preparing
  if (!shouldRender) {
    return (
      <div className="w-52 h-60 flex items-center justify-center bg-gradient-to-br from-slate-800/20 to-slate-900/20 rounded-lg">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse" />
      </div>
    );
  }

  return (
    <Optimized3DCanvas
      shadows={false}
      postProcessing={false}
      frameloop="always"
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <TechScene model={model} isHovered={isHovered} />
    </Optimized3DCanvas>
  );
});

TechIconCardExperience.displayName = "TechIconCardExperience";

// Enhanced preload function
export const preloadTechModels = (models) => {
  models.forEach((model) => {
    if (!modelCache.has(model.modelPath)) {
      useGLTF.preload(model.modelPath);
      modelCache.set(model.modelPath, true);
    }
  });
};

export default TechIconCardExperience;
