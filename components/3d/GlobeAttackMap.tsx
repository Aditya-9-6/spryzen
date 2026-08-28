'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Convert lat/lon to 3D sphere coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Generate a curved arc between two 3D points
function generateArc(start: THREE.Vector3, end: THREE.Vector3, segments = 50): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const midPoint = start.clone().add(end).multiplyScalar(0.5);
  const length = start.distanceTo(end);
  midPoint.normalize().multiplyScalar(1.4 + length * 0.3); // Arch height

  const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
  for (let i = 0; i <= segments; i++) {
    points.push(curve.getPoint(i / segments));
  }
  return points;
}

const ATTACK_COLORS: Record<string, string> = {
  'SQL Injection': '#ff1744',
  'XSS': '#ff6d00',
  'DDoS': '#9c27b0',
  'Bot': '#ffd600',
  'Path Traversal': '#ff1744',
  'CSRF': '#ff6d00',
};

const KNOWN_LOCATIONS: Record<string, [number, number]> = {
  'CN': [35.86, 104.19],
  'RU': [61.52, 105.31],
  'US': [37.09, -95.71],
  'DE': [51.16, 10.45],
  'BR': [-14.23, -51.92],
  'IN': [20.59, 78.96],
  'KR': [35.90, 127.76],
  'NG': [9.08, 8.67],
  'UA': [48.37, 31.16],
  'TR': [38.96, 35.24],
};

interface Attack {
  id: string;
  sourceCountry: string;
  attackType: string;
  timestamp: number;
}

interface AttackArc {
  id: string;
  points: THREE.Vector3[];
  color: string;
  progress: number;
  speed: number;
  alpha: number;
}

// Globe mesh with wireframe overlay
function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08;
    if (wireRef.current) wireRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#050518"
          emissive="#020210"
          specular="#1a237e"
          shininess={60}
          opacity={0.95}
          transparent
        />
      </mesh>
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.001, 24, 24]} />
        <meshBasicMaterial color="#00d4ff" wireframe opacity={0.08} transparent />
      </mesh>
    </group>
  );
}

// Animated attack arc
function AttackArcMesh({ arc, onComplete }: { arc: AttackArc; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  useFrame((_, delta) => {
    if (completedRef.current) return;
    progressRef.current = Math.min(1, progressRef.current + delta * arc.speed);
    setProgress(progressRef.current);
    if (progressRef.current >= 1 && !completedRef.current) {
      completedRef.current = true;
      setTimeout(onComplete, 1500);
    }
  });

  const visiblePoints = useMemo(() => {
    const count = Math.floor(arc.points.length * progress);
    return arc.points.slice(0, Math.max(2, count));
  }, [arc.points, progress]);

  if (visiblePoints.length < 2) return null;

  const alpha = progress < 0.9 ? 1 : 1 - (progress - 0.9) / 0.1;

  return (
    <>
      <Line
        points={visiblePoints}
        color={arc.color}
        lineWidth={1.5}
        transparent
        opacity={alpha * 0.9}
      />
      {/* Animated head dot */}
      {progress < 1 && (
        <mesh position={visiblePoints[visiblePoints.length - 1]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={arc.color} />
        </mesh>
      )}
      {/* Impact flash */}
      {progress >= 1 && (
        <mesh position={arc.points[arc.points.length - 1]}>
          <sphereGeometry args={[0.025 * alpha, 8, 8]} />
          <meshBasicMaterial color={arc.color} transparent opacity={alpha} />
        </mesh>
      )}
    </>
  );
}

// Target point (your server location — Mumbai)
const TARGET_POS = latLonToVector3(19.07, 72.87, 1.01);

function TargetMarker() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 4) * 0.3);
    }
  });
  return (
    <group>
      <mesh position={TARGET_POS}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#00e676" />
      </mesh>
      <mesh ref={ref} position={TARGET_POS}>
        <ringGeometry args={[0.022, 0.03, 16]} />
        <meshBasicMaterial color="#00e676" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ attacks }: { attacks: Attack[] }) {
  const [arcs, setArcs] = useState<AttackArc[]>([]);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.5, 2.8);
  }, [camera]);

  // Generate arcs from new attacks
  useEffect(() => {
    attacks.forEach(attack => {
      const alreadyExists = arcs.find(a => a.id === attack.id);
      if (alreadyExists) return;

      const countries = Object.keys(KNOWN_LOCATIONS);
      const sourceCountry = KNOWN_LOCATIONS[attack.sourceCountry] 
        ? attack.sourceCountry 
        : countries[Math.floor(Math.random() * countries.length)];
      
      const [lat, lon] = KNOWN_LOCATIONS[sourceCountry];
      const sourcePos = latLonToVector3(lat, lon, 1.01);
      const color = ATTACK_COLORS[attack.attackType] || '#ff1744';

      const newArc: AttackArc = {
        id: attack.id,
        points: generateArc(sourcePos, TARGET_POS),
        color,
        progress: 0,
        speed: 0.4 + Math.random() * 0.3,
        alpha: 1,
      };

      setArcs(prev => [...prev.slice(-15), newArc]); // keep max 15 arcs
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attacks]);

  const removeArc = (id: string) => {
    setArcs(prev => prev.filter(a => a.id !== id));
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00d4ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#7c3aed" />
      
      <GlobeMesh />
      <TargetMarker />

      {arcs.map(arc => (
        <AttackArcMesh
          key={arc.id}
          arc={arc}
          onComplete={() => removeArc(arc.id)}
        />
      ))}
    </>
  );
}

interface GlobeAttackMapProps {
  attacks?: Attack[];
  className?: string;
}

export default function GlobeAttackMap({ attacks = [], className = '' }: GlobeAttackMapProps) {
  // Demo mode: generate fake attacks if none provided
  const [demoAttacks, setDemoAttacks] = useState<Attack[]>([]);
  
  useEffect(() => {
    if (attacks.length > 0) return;
    
    const types = Object.keys(ATTACK_COLORS);
    const countries = Object.keys(KNOWN_LOCATIONS);
    let counter = 0;

    const interval = setInterval(() => {
      counter++;
      setDemoAttacks(prev => [...prev.slice(-20), {
        id: `demo-${counter}-${Date.now()}`,
        sourceCountry: countries[Math.floor(Math.random() * countries.length)],
        attackType: types[Math.floor(Math.random() * types.length)],
        timestamp: Date.now(),
      }]);
    }, 1800);

    return () => clearInterval(interval);
  }, [attacks.length]);

  const activeAttacks = attacks.length > 0 ? attacks : demoAttacks;

  return (
    <div className={`relative ${className}`} style={{ background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0.5, 2.8], fov: 45 }}>
        <Scene attacks={activeAttacks} />
      </Canvas>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {Object.entries(ATTACK_COLORS).slice(0, 4).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${color}`,
            }} />
            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              {type}
            </span>
          </div>
        ))}
      </div>

      {/* Mumbai marker label */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(0,230,118,0.1)',
        border: '1px solid rgba(0,230,118,0.3)',
        borderRadius: '6px',
        padding: '6px 12px',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#00e676',
          boxShadow: '0 0 8px #00e676',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: '12px', color: '#00e676', fontFamily: 'var(--font-mono)' }}>
          Your Server — Mumbai
        </span>
      </div>
    </div>
  );
}
