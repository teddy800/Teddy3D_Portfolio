import { useRef, useMemo, memo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const Particles = memo(({ count = 100 }) => {
  const mesh = useRef();
  const animationActive = useRef(true);

  const particleData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.005 + Math.random() * 0.01;
      sizes[i] = Math.random() * 0.05 + 0.03; // Varied sizes
    }
    return { positions: pos, speeds: spd, sizes };
  }, [count]);

  // Optimize animation - skip frames for better performance
  let frameSkip = 0;
  useFrame((state) => {
    if (!mesh.current || !animationActive.current) return;
    
    // Skip every other frame on low-end devices
    frameSkip++;
    if (frameSkip % 2 !== 0) return;
    
    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= particleData.speeds[i];
      if (pos[i * 3 + 1] < -2) pos[i * 3 + 1] = Math.random() * 10 + 5;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  // Pause animation when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      animationActive.current = !document.hidden;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <points ref={mesh} frustumCulled={true}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={2} // AdditiveBlending for better performance
      />
    </points>
  );
});

Particles.displayName = "Particles";
export default Particles;
