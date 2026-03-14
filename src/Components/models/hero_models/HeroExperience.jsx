import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, memo } from "react";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = memo(() => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      // Limit DPR to 1.5 max — prevents 4K screens from rendering at 4x cost
      dpr={[1, 1.5]}
      // Only re-render when something changes, not every frame
      frameloop="demand"
      // Improve GPU compositing
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.2} color="#1a1a40" />
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
        // Invalidate frame on control change so frameloop="demand" works
        makeDefault
      />

      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={isMobile ? 60 : 100} />
        <group
          scale={isMobile ? 0.7 : 1}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </Canvas>
  );
});

HeroExperience.displayName = "HeroExperience";
export default HeroExperience;
