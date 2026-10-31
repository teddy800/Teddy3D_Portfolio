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
    (isMobile ? 40 : isTablet ? 60 : 100);

  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a40" />
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
        makeDefault
      />

      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={particleCount} />
        <group
          scale={isMobile ? 0.6 : isTablet ? 0.8 : 1}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>

        {/* Conditionally render post-processing based on device */}
        {qualitySettings?.postProcessing && !isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={qualitySettings.bloomIntensity}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.95}
              mipmapBlur
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

  // Pause rendering when hero is out of view to save resources
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
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

  return (
    <Optimized3DCanvas
      camera={{
        position: [0, 0, 15],
        fov: 45,
      }}
      shadows={qualitySettings?.shadows}
      postProcessing={qualitySettings?.postProcessing}
      frameloop={isVisible ? "always" : "never"}
      className="w-full h-full"
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
