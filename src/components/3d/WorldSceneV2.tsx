'use client';

import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sparkles, MeshDistortMaterial, GradientTexture, Text, Trail, MeshWobbleMaterial, Icosahedron, Sphere, Box, Torus, Ring, Cone } from '@react-three/drei';
import { useWorldStore } from '@/stores/world-store';
import * as THREE from 'three';

// ============================================
// CHAPTER 0: Boot Sequence - Matrix Rain Effect
// ============================================
function MatrixRain({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 500;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 30,
        speed: 0.02 + Math.random() * 0.05,
      });
    }
    return temp;
  }, [count]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    });
    return pos;
  }, [particles, count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!groupRef.current || !active) return;
    const points = groupRef.current.children[0] as THREE.Points;
    if (!points?.geometry?.attributes?.position) return;
    const posArray = points.geometry.attributes.position.array as Float32Array;
    if (!posArray) return;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= particles[i].speed;
      if (posArray[i * 3 + 1] < -10) {
        posArray[i * 3 + 1] = 15;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <pointsMaterial color="#00ff88" size={0.1} transparent opacity={0.8} sizeAttenuation />
      </points>
    </group>
  );
}

// ============================================
// CHAPTER 1: Origin - DNA Helix of Company
// ============================================
function DNAHelix({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const helixCount = 40;

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {[...Array(helixCount)].map((_, i) => {
        const t = i / helixCount;
        const angle = t * Math.PI * 4;
        const y = (t - 0.5) * 12;
        const radius = 2;

        return (
          <group key={i}>
            {/* First strand */}
            <Float speed={2} floatIntensity={0.2}>
              <mesh position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color="#00ff88"
                  emissive="#00ff88"
                  emissiveIntensity={0.5}
                />
              </mesh>
            </Float>
            {/* Second strand */}
            <Float speed={2} floatIntensity={0.2}>
              <mesh position={[Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                  color="#00d4ff"
                  emissive="#00d4ff"
                  emissiveIntensity={0.5}
                />
              </mesh>
            </Float>
            {/* Connection bar */}
            {i % 4 === 0 && (
              <mesh position={[0, y, 0]} rotation={[0, angle, 0]}>
                <cylinderGeometry args={[0.03, 0.03, radius * 2, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ============================================
// CHAPTER 2: Problems & Solutions - Chaos to Order
// ============================================
function ChaosToOrder({ active, solving }: { active: boolean; solving: boolean }) {
  const problemsRef = useRef<THREE.Group>(null);
  const solutionsRef = useRef<THREE.Group>(null);

  const problems = useMemo(() => [
    { position: [-3, 2, 0], color: '#ff6b6b' },
    { position: [3, -1, 2], color: '#ffaa00' },
    { position: [-2, -2, -2], color: '#ff4444' },
    { position: [2, 3, -1], color: '#ff8800' },
    { position: [0, -3, 3], color: '#ff5555' },
  ], []);

  const solutions = useMemo(() => [
    { position: [-1.5, 1, 0], color: '#00ff88', name: 'Scout' },
    { position: [1.5, -0.5, 1], color: '#00d4ff', name: 'Infleos' },
    { position: [-1, -1, -1], color: '#00ff88', name: 'GCK' },
    { position: [1, 1.5, -0.5], color: '#00d4ff', name: 'CS Flow' },
    { position: [0, -1.5, 1.5], color: '#00ff88', name: 'VibeOps' },
  ], []);

  useFrame((state) => {
    if (!problemsRef.current || !active) return;
    const t = state.clock.getElapsedTime();

    problemsRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        // Chaotic rotation for problems
        child.rotation.x += 0.02 * (i + 1);
        child.rotation.y += 0.03 * (i + 1);
        child.position.x = problems[i].position[0] + Math.sin(t * (i + 1) * 0.5) * 0.5;
        child.position.y = problems[i].position[1] + Math.cos(t * (i + 1) * 0.5) * 0.5;
      }
    });

    if (solutionsRef.current) {
      solutionsRef.current.rotation.y = t * 0.2;
    }
  });

  if (!active) return null;

  return (
    <group>
      {/* Chaotic problems */}
      <group ref={problemsRef}>
        {problems.map((p, i) => (
          <mesh key={`problem-${i}`} position={p.position as [number, number, number]}>
            <octahedronGeometry args={[0.3, 0]} />
            <MeshWobbleMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.5}
              factor={1}
              speed={2}
            />
          </mesh>
        ))}
      </group>

      {/* Organized solutions */}
      <group ref={solutionsRef}>
        {solutions.map((s, i) => (
          <Float key={`solution-${i}`} speed={1.5} floatIntensity={0.3}>
            <mesh position={s.position as [number, number, number]}>
              <dodecahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <Sparkles count={10} scale={1} size={1} speed={0.5} color={s.color} position={s.position as [number, number, number]} />
          </Float>
        ))}
      </group>

      {/* Connection beams between problems and solutions */}
      {problems.map((p, i) => (
        <Trail
          key={`trail-${i}`}
          width={0.1}
          length={5}
          color={solutions[i]?.color || '#00ff88'}
          attenuation={(t) => t * t}
        >
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color={solutions[i]?.color || '#00ff88'} />
          </mesh>
        </Trail>
      ))}
    </group>
  );
}

// ============================================
// CHAPTER 3: Ecosystem - Connected Network
// ============================================
function EcosystemNetwork({ active, flowActive }: { active: boolean; flowActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => [
    { id: 'vibeops', name: 'VibeOps', position: [0, 2, 0] as [number, number, number], color: '#c084fc', isHub: true },
    { id: 'scout', name: 'Scout', position: [-3, 0, 2] as [number, number, number], color: '#00ff88', isHub: false },
    { id: 'infleos', name: 'Infleos', position: [3, 0, 2] as [number, number, number], color: '#00d4ff', isHub: false },
    { id: 'gck', name: 'GetCare', position: [-2, -2, -1] as [number, number, number], color: '#ff6b6b', isHub: false },
    { id: 'csflow', name: 'CS Flow', position: [2, -2, -1] as [number, number, number], color: '#ffd93d', isHub: false },
    { id: 'afform', name: 'Agency', position: [0, -3, 0] as [number, number, number], color: '#f472b6', isHub: false },
  ], []);

  const connections = useMemo(() => [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], // VibeOps to all
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], // Ring connections
  ], []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;

    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Group) {
          const scale = 1 + Math.sin(t * 2 + i) * 0.1;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <group key={node.id} position={node.position}>
            <Float speed={1.5} floatIntensity={0.3}>
              {node.isHub ? (
                <Icosahedron args={[0.8, 2]}>
                  <MeshDistortMaterial
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={flowActive ? 0.8 : 0.3}
                    distort={0.4}
                    speed={3}
                    metalness={0.5}
                    roughness={0.2}
                  />
                </Icosahedron>
              ) : (
                <mesh>
                  <octahedronGeometry args={[0.5, 0]} />
                  <meshStandardMaterial
                    color={node.color}
                    emissive={node.color}
                    emissiveIntensity={flowActive ? 0.6 : 0.2}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              )}
            </Float>

            {/* Glow effect */}
            <Sphere args={[node.isHub ? 1.2 : 0.8, 16, 16]}>
              <meshBasicMaterial color={node.color} transparent opacity={0.05} />
            </Sphere>

            {/* Sparkles around active nodes */}
            {flowActive && (
              <Sparkles count={20} scale={2} size={2} speed={0.8} color={node.color} />
            )}
          </group>
        ))}
      </group>

      {/* Connection lines */}
      {connections.map(([from, to], i) => {
        const start = new THREE.Vector3(...nodes[from].position);
        const end = new THREE.Vector3(...nodes[to].position);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);

        return (
          <group key={`conn-${i}`}>
            <mesh position={mid} lookAt={end}>
              <cylinderGeometry args={[0.02, 0.02, length, 8]} />
              <meshBasicMaterial
                color={flowActive ? '#00ff88' : '#333'}
                transparent
                opacity={flowActive ? 0.6 : 0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Data particles flowing */}
      {flowActive && (
        <DataFlow connections={connections} nodes={nodes} />
      )}
    </group>
  );
}

function DataFlow({ connections, nodes }: { connections: number[][]; nodes: Array<{ position: [number, number, number]; color: string }> }) {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const t = state.clock.getElapsedTime();

    particlesRef.current.children.forEach((child, i) => {
      const progress = ((t * 0.5) + i * 0.1) % 1;
      const connection = connections[i % connections.length];
      const start = new THREE.Vector3(...nodes[connection[0]].position);
      const end = new THREE.Vector3(...nodes[connection[1]].position);

      child.position.lerpVectors(start, end, progress);
    });
  });

  return (
    <group ref={particlesRef}>
      {[...Array(20)].map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// CHAPTER 4: Proof - Metrics Visualization
// ============================================
function MetricsViz({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const metrics = useMemo(() => [
    { value: 30, label: 'Partners', height: 3, color: '#00ff88' },
    { value: 100, label: 'Revenue', height: 5, color: '#00d4ff' },
    { value: 6, label: 'Products', height: 2, color: '#ffd93d' },
    { value: 3, label: 'Countries', height: 1.5, color: '#c084fc' },
  ], []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {metrics.map((metric, i) => {
        const angle = (i / metrics.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]}>
            {/* Bar */}
            <Float speed={1} floatIntensity={0.2}>
              <Box args={[0.8, metric.height, 0.8]} position={[0, metric.height / 2, 0]}>
                <meshStandardMaterial
                  color={metric.color}
                  emissive={metric.color}
                  emissiveIntensity={0.3}
                  metalness={0.8}
                  roughness={0.2}
                />
              </Box>
            </Float>

            {/* Top glow */}
            <Sphere args={[0.3, 16, 16]} position={[0, metric.height + 0.3, 0]}>
              <meshBasicMaterial color={metric.color} transparent opacity={0.6} />
            </Sphere>

            {/* Ring around base */}
            <Ring args={[0.8, 1, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <meshBasicMaterial color={metric.color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </Ring>

            <Sparkles count={10} scale={[1, metric.height, 1]} size={1} speed={0.5} color={metric.color} position={[0, metric.height / 2, 0]} />
          </group>
        );
      })}

      {/* Center platform */}
      <Torus args={[2.5, 0.1, 16, 100]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00ff88" transparent opacity={0.2} />
      </Torus>
    </group>
  );
}

// ============================================
// CHAPTER 5: Vision - Future Timeline
// ============================================
function TimelineVision({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const milestones = useMemo(() => [
    { year: '2015', label: '시작', z: 8, color: '#555555' },
    { year: '2023', label: 'AI 전환', z: 4, color: '#00ff88' },
    { year: '2024', label: '런칭', z: 0, color: '#00d4ff' },
    { year: '2026', label: 'NOW', z: -4, color: '#ffd93d' },
    { year: 'FUTURE', label: '비전', z: -8, color: '#c084fc' },
  ], []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Group) {
        child.position.y = Math.sin(t + i * 0.5) * 0.2;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {/* Timeline path */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 20, 8]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>

      {milestones.map((milestone, i) => (
        <Float key={i} speed={1.5} floatIntensity={0.2}>
          <group position={[0, 0, milestone.z]}>
            {/* Node */}
            <mesh>
              <icosahedronGeometry args={[milestone.year === 'FUTURE' ? 0.8 : 0.5, 1]} />
              <meshStandardMaterial
                color={milestone.color}
                emissive={milestone.color}
                emissiveIntensity={milestone.year === 'NOW' || milestone.year === 'FUTURE' ? 0.8 : 0.3}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>

            {/* Glow */}
            <Sphere args={[milestone.year === 'FUTURE' ? 1.2 : 0.8, 16, 16]}>
              <meshBasicMaterial color={milestone.color} transparent opacity={0.1} />
            </Sphere>

            {/* Sparkles for current and future */}
            {(milestone.year === 'NOW' || milestone.year === 'FUTURE') && (
              <Sparkles count={30} scale={3} size={2} speed={1} color={milestone.color} />
            )}
          </group>
        </Float>
      ))}
    </group>
  );
}

// ============================================
// CHAPTER 6: Call to Action - Portal
// ============================================
function CTAPortal({ active }: { active: boolean }) {
  const portalRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!portalRef.current || !active) return;
    const t = state.clock.getElapsedTime();

    portalRef.current.rotation.z = t * 0.2;

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
    }
  });

  if (!active) return null;

  return (
    <group ref={portalRef}>
      {/* Outer ring */}
      <Torus args={[3, 0.1, 16, 100]} ref={ringRef}>
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>

      {/* Middle ring */}
      <Torus args={[2.5, 0.08, 16, 100]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>

      {/* Inner ring */}
      <Torus args={[2, 0.06, 16, 100]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial
          color="#ffd93d"
          emissive="#ffd93d"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>

      {/* Center core */}
      <Icosahedron args={[0.8, 2]}>
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#00ff88"
          emissiveIntensity={1}
          distort={0.5}
          speed={5}
        />
      </Icosahedron>

      {/* Portal glow */}
      <Sphere args={[3.5, 32, 32]}>
        <meshBasicMaterial color="#00ff88" transparent opacity={0.03} side={THREE.BackSide} />
      </Sphere>

      {/* Massive sparkles */}
      <Sparkles count={100} scale={8} size={3} speed={1} color="#00ff88" />
      <Sparkles count={50} scale={6} size={2} speed={1.5} color="#00d4ff" />
    </group>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================
function BackgroundSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.0005;
    meshRef.current.rotation.x += 0.0003;
  });

  return (
    <mesh ref={meshRef} scale={50}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide} transparent opacity={0.3}>
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={['#000000', '#001a0d', '#000000']}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

function CentralCore({ chapter }: { chapter: number }) {
  const coreRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  const chapterColors: Record<number, string> = {
    0: '#00ff88',
    1: '#00ff88',
    2: '#ff6b6b',
    3: '#00d4ff',
    4: '#ffd93d',
    5: '#c084fc',
    6: '#00ff88',
  };

  const color = chapterColors[chapter] || '#00ff88';

  useFrame((state) => {
    if (!coreRef.current || !innerRef.current || !outerRef.current) return;
    const t = state.clock.getElapsedTime();

    coreRef.current.rotation.y = t * 0.1;
    coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;

    innerRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    outerRef.current.rotation.z = t * 0.5;
  });

  // Hide central core in chapters with their own focal point
  if (chapter >= 3) return null;

  return (
    <group ref={coreRef}>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>

      <mesh scale={2.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>

      <Sparkles count={50} scale={4} size={2} speed={0.4} color={color} />
    </group>
  );
}

function GridFloor({ visible, chapter }: { visible: boolean; chapter: number }) {
  if (!visible) return null;

  const chapterColors: Record<number, string> = {
    0: '#00ff88',
    1: '#00ff88',
    2: '#ff6b6b',
    3: '#00d4ff',
    4: '#ffd93d',
    5: '#c084fc',
    6: '#00ff88',
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[60, 60, 60, 60]} />
      <meshBasicMaterial color={chapterColors[chapter] || '#00ff88'} wireframe transparent opacity={0.08} />
    </mesh>
  );
}

// ============================================
// MAIN SCENE
// ============================================
function SceneContent() {
  const { currentChapter, flowActive, bootComplete, metricsVisible } = useWorldStore();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />

      {/* Background */}
      <BackgroundSphere />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Central core - visible in early chapters */}
      <CentralCore chapter={currentChapter} />

      {/* Chapter-specific 3D content */}
      <MatrixRain active={currentChapter === 0} />
      <DNAHelix active={currentChapter === 1} />
      <ChaosToOrder active={currentChapter === 2} solving={false} />
      <EcosystemNetwork active={currentChapter === 3} flowActive={flowActive} />
      <MetricsViz active={currentChapter === 4} />
      <TimelineVision active={currentChapter === 5} />
      <CTAPortal active={currentChapter === 6} />

      {/* Grid floor */}
      <GridFloor visible={currentChapter >= 1} chapter={currentChapter} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

function Loader() {
  return (
    <mesh>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#00ff88" wireframe />
    </mesh>
  );
}

export default function WorldSceneV2({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
