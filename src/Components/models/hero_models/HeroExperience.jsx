import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, memo, useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = memo(() => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  // Memoize camera config to prevent re-renders
  const cameraConfig = useMemo(() => ({
    position: [0, 0, 15],
    fov: 45,
  }), []);

  // Memoize GL config for optimal performance
  const glConfig = useMemo(() => ({
    antialias: true,
    powerPreference: "high-performance",
    alpha: true,
    stencil: false,
    depth: true,
    precision: "mediump",
    logarithmicDepthBuffer: false,
  }), []);

  return (
    <Canvas
      camera={cameraConfig}
      dpr={[1, isMobile ? 1 : 1.5]}
      frameloop="always"
      gl={glConfig}
      performance={{ min: 0.5, max: 1 }}
      onCreated={(state) => {
        state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        state.gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.2} color="#1a1a40" />
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        makeDefault
      />

      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={isMobile ? 40 : isTablet ? 60 : 100} />
        <group
          scale={isMobile ? 0.6 : isTablet ? 0.8 : 1}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>

        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.95}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
});

HeroExperience.displayName = "HeroExperience";
export default HeroExperience;
