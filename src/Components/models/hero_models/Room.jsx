import { useRef, useMemo, memo, useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export const Room = memo((props) => {
  const { nodes, materials } = useGLTF("/models/optimized-room.glb");
  const screensRef = useRef();
  
  // Lazy load texture - only when needed
  const matcapTexture = useTexture("/images/textures/mat1.png", (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false; // Performance boost
  });

  // useMemo — materials created ONCE, never re-allocated on re-render
  const mats = useMemo(() => {
    const sharedMaterialProps = {
      flatShading: false,
      shininess: 30,
    };
    
    return {
      curtain:  new THREE.MeshPhongMaterial({ ...sharedMaterialProps, color: "#d90429" }),
      body:     new THREE.MeshPhongMaterial({ ...sharedMaterialProps, map: matcapTexture }),
      table:    new THREE.MeshPhongMaterial({ ...sharedMaterialProps, color: "#582f0e" }),
      radiator: new THREE.MeshPhongMaterial({ ...sharedMaterialProps, color: "#fff" }),
      comp:     new THREE.MeshStandardMaterial({ ...sharedMaterialProps, color: "#fff", roughness: 0.5, metalness: 0.2 }),
      pillow:   new THREE.MeshPhongMaterial({ ...sharedMaterialProps, color: "#8338ec" }),
      chair:    new THREE.MeshPhongMaterial({ ...sharedMaterialProps, color: "#000" }),
    };
  }, [matcapTexture]);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      Object.values(mats).forEach(mat => mat.dispose());
    };
  }, [mats]);

  return (
    <group {...props} dispose={null}>
      {/* High-impact meshes with custom materials */}
      <mesh geometry={nodes._________6_blinn1_0.geometry} material={mats.curtain} castShadow receiveShadow />
      <mesh geometry={nodes.body1_blinn1_0.geometry} material={mats.body} castShadow receiveShadow />
      <mesh geometry={nodes.cabin_blinn1_0.geometry} material={mats.table} castShadow receiveShadow />
      <mesh geometry={nodes.chair_body_blinn1_0.geometry} material={mats.chair} castShadow receiveShadow />
      <mesh geometry={nodes.comp_blinn1_0.geometry} material={mats.comp} castShadow receiveShadow />
      <mesh ref={screensRef} geometry={nodes.emis_lambert1_0.geometry} material={materials.lambert1} />
      <mesh geometry={nodes.pillows_blinn1_0.geometry} material={mats.pillow} castShadow receiveShadow />
      <mesh geometry={nodes.table_blinn1_0.geometry} material={mats.table} castShadow receiveShadow />
      <mesh geometry={nodes.radiator_blinn1_0.geometry} material={mats.radiator} />
      
      {/* Lower-impact meshes with shared materials */}
      <mesh geometry={nodes.handls_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.keyboard_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.kovrik_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_bl_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_white_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.miuse_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.monitor2_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.monitor3_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.pCylinder5_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.polySurface53_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.radiator_blinn1_0001.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.railing_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.red_bttns_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.red_vac_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.stylus_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.tablet_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.triangle_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.vac_black_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.vacuum1_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.vacuumgrey_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.vires_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.window_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.window4_phong1_0.geometry} material={materials.phong1} />
    </group>
  );
});

Room.displayName = "Room";
useGLTF.preload("/models/optimized-room.glb");
