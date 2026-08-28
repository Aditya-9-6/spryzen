'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, MeshDistortMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Suspense } from 'react';
import { Check, X } from 'lucide-react';

// ─── Plans matching spryzen_complete_pricing.html ─────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    period: 'Free Forever',
    color: '#64748b',
    emissive: '#1e293b',
    metalness: 0.3,
    roughness: 0.7,
    distort: 0.1,
    position: [-4.5, 0, 0] as [number, number, number],
    features: ['10K requests/mo', '0.5B fast gate only', 'REST API', 'JSON verdict output', 'Discord community'],
    missing: ['7B supreme court', 'Dashboard', 'Webhooks', 'Ouroboros evolution'],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceUSD: 35,
    period: '/month',
    color: '#38bdf8',
    emissive: '#0c1a2e',
    metalness: 0.9,
    roughness: 0.05,
    distort: 0.2,
    position: [-2.25, 0, 0] as [number, number, number],
    features: ['100K req/mo', 'L0 eBPF/XDP + L1 SIMD', '0.5B + Semantic Index', 'Python SDK', 'Basic dashboard'],
    missing: ['7B model', 'Ouroboros evolution', 'SLA guarantee'],
  },
  {
    id: 'growth',
    name: 'Growth',
    priceUSD: 120,
    period: '/month',
    color: '#a78bfa',
    emissive: '#3b0764',
    metalness: 0.8,
    roughness: 0.1,
    distort: 0.35,
    position: [0, 0, 0] as [number, number, number],
    features: ['1M req/mo', 'All 10 pipeline layers', '0.5B + 7B + Semantic', 'Ouroboros hot-patching', 'Webhooks + Slack', '99.5% SLA'],
    missing: ['Cross-customer intel', '80B supreme model'],
    recommended: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceUSD: 360,
    period: '/month',
    color: '#4ade80',
    emissive: '#0a2a0a',
    metalness: 0.85,
    roughness: 0.08,
    distort: 0.28,
    position: [2.25, 0, 0] as [number, number, number],
    features: ['5M req/mo', 'Global Ouroboros feed', 'Cross-customer threat intel', 'gRPC + Protobuf', 'SIEM export', 'Datadog/Grafana', '99.9% SLA · 4hr'],
    missing: ['80B supreme model', 'On-premise deployment'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceUSD: -1,
    period: 'Starting $900/mo',
    color: '#c084fc',
    emissive: '#2d1f5e',
    metalness: 1.0,
    roughness: 0.0,
    distort: 0.15,
    position: [4.5, 0, 0] as [number, number, number],
    features: ['Unlimited requests', '80B supreme court model', 'Private Ouroboros', 'On-premise / air-gapped', 'SOC2 + Kani docs', 'Dedicated CSM', '99.99% SLA · 1hr · Financial penalties'],
    missing: [],
  },
];

function PricingOrb({
  plan,
  selected,
  onSelect,
}: {
  plan: typeof PLANS[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = selected ? 1.35 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    meshRef.current.rotation.y = t * (selected ? 0.5 : 0.2);
  });

  return (
    <group position={plan.position}>
      <Float speed={1.5} floatIntensity={selected ? 0.3 : 0.15}>
        <mesh
          ref={meshRef}
          onClick={onSelect}
          onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
          onPointerLeave={() => { document.body.style.cursor = 'default'; }}
        >
          <sphereGeometry args={[0.75, 64, 64]} />
          <MeshDistortMaterial
            color={plan.color}
            emissive={plan.emissive}
            emissiveIntensity={selected ? 1.5 : 0.6}
            metalness={plan.metalness}
            roughness={plan.roughness}
            distort={plan.distort}
            speed={selected ? 3 : 1.5}
          />
        </mesh>

        {/* Glow ring when selected */}
        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.02, 16, 128]} />
            <meshBasicMaterial color={plan.color} transparent opacity={0.6} />
          </mesh>
        )}

        <pointLight color={plan.color} intensity={selected ? 8 : 3} distance={3} />
      </Float>

      {/* Plan name label */}
      <Html
        position={[0, -1.25, 0]}
        center
        distanceFactor={7}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: plan.color, fontFamily: 'Outfit', fontWeight: 900, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {plan.name}
          </div>
          {plan.recommended && (
            <div style={{ background: plan.color, color: '#000', fontSize: '7px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px', marginTop: '2px', letterSpacing: '0.1em' }}>
              POPULAR
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

export default function PricingOrbs() {
  const [selected, setSelected] = useState<string>('growth');

  const selectedPlan = PLANS.find(p => p.id === selected)!;
  const isEnterprise = selectedPlan.id === 'enterprise';

  return (
    <div style={{ width: '100%' }}>
      {/* 3D Canvas */}
      <div style={{ height: '360px', width: '100%', position: 'relative' }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.15} />
            {PLANS.map(plan => (
              <PricingOrb
                key={plan.id}
                plan={plan}
                selected={selected === plan.id}
                onSelect={() => setSelected(plan.id)}
              />
            ))}
            <EffectComposer>
              <Bloom intensity={1.0} luminanceThreshold={0.25} luminanceSmoothing={0.9} height={250} />
            </EffectComposer>
          </Suspense>
        </Canvas>

        {/* Instruction */}
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
          color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'Inter',
          letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          ← Click an orb to explore →
        </div>
      </div>

      {/* Selected Plan Detail Card */}
      <div
        className="glass-card"
        style={{
          maxWidth: '680px', margin: '1rem auto 0', padding: '2rem',
          borderColor: `${selectedPlan.color}33`,
          boxShadow: `0 0 40px ${selectedPlan.color}15`,
          transition: 'all 0.3s ease',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-label mb-1" style={{ color: selectedPlan.color }}>
              {selectedPlan.name} Plan
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem' }}>
              {isEnterprise ? (
                <>
                  <span style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: selectedPlan.color }}>Custom</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', paddingBottom: '0.25rem' }}>&nbsp;{selectedPlan.period}</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)', paddingBottom: '0.25rem' }}>$</span>
                  <span style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: selectedPlan.color }}>
                    {selectedPlan.priceUSD.toLocaleString('en-US')}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingBottom: '0.25rem' }}>
                    +Tax{selectedPlan.period}
                  </span>
                </>
              )}
            </div>
          </div>
          {selectedPlan.recommended && (
            <span className="badge badge-cyan">⭐ Most Popular</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div className="text-label mb-3" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedPlan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Check size={14} style={{ color: 'var(--neon-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          {selectedPlan.missing.length > 0 && (
            <div>
              <div className="text-label mb-3" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Not Included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPlan.missing.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', opacity: 0.5 }}>
                    <X size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <a
            href={isEnterprise ? '/contact' : `/auth/signup?plan=${selectedPlan.id}`}
            className="btn btn-primary flex-1 justify-center"
            style={{
              boxShadow: `0 0 24px ${selectedPlan.color}40`,
              ...(selectedPlan.id === 'enterprise' ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}),
            }}
          >
            {selectedPlan.priceUSD === 0 ? 'Start Free' : isEnterprise ? 'Contact Sales' : 'Start Trial'}
          </a>
          <a href="/pricing" className="btn btn-secondary">Full Comparison</a>
        </div>
      </div>
    </div>
  );
}
