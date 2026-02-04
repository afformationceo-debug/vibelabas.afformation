'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { PRODUCTS } from '@/lib/products-data';

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#00ff88"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>
      {/* Inner glow */}
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial color="#00ff88" transparent opacity={0.1} />
      </Sphere>
    </Float>
  );
}

function ProductNode({
  position,
  color,
  name,
  index,
}: {
  position: [number, number, number];
  color: string;
  name: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Orbit around center
      const time = state.clock.elapsedTime * 0.3 + index * (Math.PI / 3);
      const radius = 3.5;
      meshRef.current.position.x = Math.cos(time) * radius;
      meshRef.current.position.z = Math.sin(time) * radius;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.5;

      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      meshRef.current.scale.setScalar(scale);

      // Update text position
      if (textRef.current) {
        textRef.current.position.copy(meshRef.current.position);
        textRef.current.position.y += 0.8;
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[position[0], position[1] + 0.8, position[2]]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>
    </>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 6;

    for (let i = 0; i < count; i++) {
      // Line from center to each product node position
      points.push(new THREE.Vector3(0, 0, 0));
      const angle = (i / count) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5)
      );
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      const positions = linesRef.current.geometry.attributes.position;
      const count = 6;

      for (let i = 0; i < count; i++) {
        const time = state.clock.elapsedTime * 0.3 + i * (Math.PI / 3);
        const radius = 3.5;

        // Update end point of each line
        const idx = i * 2 + 1;
        positions.setXYZ(
          idx,
          Math.cos(time) * radius,
          Math.sin(time * 0.5) * 0.5,
          Math.sin(time) * radius
        );
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00ff88" transparent opacity={0.3} />
    </lineSegments>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00ff88"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const productColors = PRODUCTS.slice(0, 6).map((p) => p.color);
  const productNames = PRODUCTS.slice(0, 6).map((p) => p.name);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#00d4ff"
      />

      {/* Central Sphere */}
      <CentralSphere />

      {/* Product Nodes */}
      {productColors.map((color, index) => (
        <ProductNode
          key={index}
          position={[0, 0, 0]}
          color={color}
          name={productNames[index]}
          index={index}
        />
      ))}

      {/* Connection Lines */}
      <ConnectionLines />

      {/* Background Particles */}
      <Particles />

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
