import { OrbitControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { Suspense, memo, useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import Optimized3DCanvas, { useQualitySettings } from "../../Optimized3DCanvas";

const HeroScene = memo(({ qualitySettings, isMobile, isTablet }) => {
  // Determine particle count based on quality
  const particleCount = qualitySettings?.particleCount || 
    (isMobile ? 30 : isTablet ? 50 : 80);

  // Reduce particle updates on low-end devices
  const particleUpdateRate = isMobile ? 2 : isTablet ? 1.5 : 1;

  return (
    <>
      <ambientLight intensity={0.15} color="#1a1a40" />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxDistance={20}
        minDistance={8}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        makeDefault
      />

      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={particleCount} />
        <group
          scale={isMobile ? 0.6 : isTablet ? 0.75 : 0.95}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>

        {/* Conditionally render post-processing based on device - ONLY high-end */}
        {qualitySettings?.postProcessing && !isMobile && !isTablet && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.6}
            />
          </EffectComposer>
        )}
      </Suspense>
    </>
  );
});

HeroScene.displayName = "HeroScene";

const HeroExperience = memo(() => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const qualitySettings = useQualitySettings();
  const [isVisible, setIsVisible] = useState(true);
  const [frameloop, setFrameloop] = useState('always');

  // Pause rendering when hero is out of view to save resources
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        setFrameloop(visible ? 'always' : 'never');
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    const heroElement = document.querySelector('#hero');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => {
      if (heroElement) {
        observer.unobserve(heroElement);
      }
    };
  }, []);

  // Pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setFrameloop('never');
      } else if (isVisible) {
        setFrameloop('always');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVisible]);

  return (
    <Optimized3DCanvas
      camera={{
        position: [0, 0, 15],
        fov: 45,
        near: 1,
        far: 50,
      }}
      shadows={qualitySettings?.shadows && !isMobile}
      postProcessing={qualitySettings?.postProcessing}
      frameloop={frameloop}
      className="w-full h-full"
      gl={{
        powerPreference: 'high-performance',
        antialias: !isMobile,
        stencil: false,
        depth: true,
      }}
      dpr={isMobile ? [1, 1] : [1, Math.min(window.devicePixelRatio, 1.5)]}
    >
      <HeroScene 
        qualitySettings={qualitySettings}
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </Optimized3DCanvas>
  );
});

HeroExperience.displayName = "HeroExperience";
export default HeroExperience;
