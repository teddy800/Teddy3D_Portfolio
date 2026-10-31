import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, memo, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import Optimized3DCanvas from "../../Optimized3DCanvas";

// Preload all models on component mount to improve performance
const modelCache = new Map();

// Inner scene — rendered inside an optimized Canvas per card
const TechScene = memo(({ model, isHovered }) => {
  const scene = useGLTF(model.modelPath);
  const { gl } = useThree();

  useEffect(() => {
    // Apply special material for specific models
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child) => {
        if (child.isMesh && child.name === "Object_5") {
          child.material = new THREE.MeshStandardMaterial({ color: "white" });
        }
      });
    }

    // Optimize materials for better performance
    scene.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Enable frustum culling
        child.frustumCulled = true;
        
        // Optimize material
        if (child.material.map) {
          child.material.map.anisotropy = gl.capabilities.getMaxAnisotropy();
        }
      }
    });

    // Cleanup function
    return () => {
      scene.scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [scene, model.name, gl]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow={false} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow={false} />
      <Environment preset="city" />
      
      <Float 
        speed={isHovered ? 7 : 5.5} 
        rotationIntensity={isHovered ? 0.7 : 0.5} 
        floatIntensity={isHovered ? 1.2 : 0.9}
      >
        <group scale={model.scale} rotation={model.rotation}>
          <primitive object={scene.scene} />
        </group>
      </Float>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        makeDefault 
      />
    </>
  );
});

TechScene.displayName = "TechScene";

const TechIconCardExperience = memo(({ model }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Observe visibility to pause rendering when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading slightly before visible
      }
    );

    // Find the parent card element
    const cardElement = document.querySelector(`[data-tech="${model.name}"]`);
    if (cardElement) {
      observer.observe(cardElement);
      
      // Mouse events for hover effect
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      
      cardElement.addEventListener('mouseenter', handleMouseEnter);
      cardElement.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        observer.unobserve(cardElement);
        cardElement.removeEventListener('mouseenter', handleMouseEnter);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [model.name]);

  // Don't render canvas until visible
  if (!isVisible) {
    return (
      <div className="w-52 h-60 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    );
  }

  return (
    <Optimized3DCanvas
      shadows={false}
      postProcessing={false}
      frameloop={isVisible ? "always" : "never"}
      className="w-full h-full"
    >
      <TechScene model={model} isHovered={isHovered} />
    </Optimized3DCanvas>
  );
});

TechIconCardExperience.displayName = "TechIconCardExperience";

// Preload function for models
export const preloadTechModels = (models) => {
  models.forEach((model) => {
    if (!modelCache.has(model.modelPath)) {
      useGLTF.preload(model.modelPath);
      modelCache.set(model.modelPath, true);
    }
  });
};

export default TechIconCardExperience;
