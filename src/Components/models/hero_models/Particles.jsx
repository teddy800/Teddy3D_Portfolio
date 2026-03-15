import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";

const Particles = memo(({ count = 100 }) => {
  const mesh = useRef();

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.005 + Math.random() * 0.01;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i];
      if (pos[i * 3 + 1] < -2) pos[i * 3 + 1] = Math.random() * 10 + 5;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    state.invalidate();
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
});

Particles.displayName = "Particles";
export default Particles;
