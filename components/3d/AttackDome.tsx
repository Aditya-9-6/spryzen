'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Suspense } from 'react';

// ─── Attack Projectile ───────────────────────────────────────────────────
function Projectile({ index, onHit }: { index: number; onHit: () => void }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  const theta = useRef(Math.random() * Math.PI * 2);
  const phi   = useRef(Math.random() * Math.PI);
  const speed = useRef(0.02 + Math.random() * 0.015);
  const r     = useRef(5 + Math.random() * 1.5);
  const hitTriggered = useRef(false);

  useFrame(() => {
    if (!meshRef.current) return;
    r.current -= speed.current;

    const x = r.current * Math.sin(phi.current) * Math.cos(theta.current + index * 0.5);
    const y = r.current * Math.sin(phi.current) * Math.sin(theta.current + index * 0.5);
    const z = r.current * Math.cos(phi.current);

    meshRef.current.position.set(x, y, z);

    if (r.current < 1.5 && !hitTriggered.current) {
      hitTriggered.current = true;
      r.current = 5 + Math.random() * 1.5;
      theta.current = Math.random() * Math.PI * 2;
      phi.current   = Math.random() * Math.PI;
      hitTriggered.current = false;
      onHit();
    }
  });

  const isRed = index % 3 !== 0;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={isRed ? '#ff1744' : '#ff6d00'} />
    </mesh>
  );
}

// ─── Shield Dome ─────────────────────────────────────────────────────────
function Dome() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) outerRef.current.rotation.y = t * 0.15;
    if (innerRef.current) innerRef.current.rotation.y = -t * 0.2;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.3;
  });

  return (
    <group>
      {/* Outer shield */}
      <Sphere ref={outerRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#002244"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.1}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.18}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere ref={innerRef} args={[1.52, 24, 24]}>
        <meshBasicMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.12}
        />
      </Sphere>

      {/* Core glow */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Equatorial rings */}
      <Ring ref={ring1Ref} args={[1.6, 1.63, 128]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </Ring>
      <Ring ref={ring2Ref} args={[1.75, 1.77, 128]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.35} side={THREE.DoubleSide} />
      </Ring>

      <pointLight color="#00d4ff" intensity={10} distance={5} />
    </group>
  );
}

// ─── Attack Dome Scene ───────────────────────────────────────────────────
export default function AttackDome({ onHitCallback }: { onHitCallback?: () => void }) {
  const [hitCount, setHitCount] = useState(0);

  const handleHit = () => {
    setHitCount(c => c + 1);
    onHitCallback?.();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={0.4} />

          <Dome />

          {/* Attack projectiles */}
          {Array.from({ length: 12 }, (_, i) => (
            <Projectile key={i} index={i} onHit={handleHit} />
          ))}

          <EffectComposer>
            <Bloom intensity={2.0} luminanceThreshold={0.15} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
