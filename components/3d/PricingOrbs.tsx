'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shield, Server, HardDrive, Cpu, Zap, ArrowRight, Lock, Terminal } from 'lucide-react';
import Link from 'next/link';

interface OnPremPlan {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  priceUSD: number;
  period: string;
  description: string;
  accentColor: string;
  glowColor: string;
  recommended?: boolean;
  deploymentType: string;
  specs: {
    volume: string;
    deployment: string;
    egress: string;
    engine: string;
  };
  features: string[];
  missing: string[];
}

const ON_PREM_PLANS: OnPremPlan[] = [
  {
    id: 'starter',
    name: 'Self-Hosted Starter',
    badge: 'Open Sovereign',
    badgeColor: '#64748b',
    priceUSD: 0,
    period: 'Free Forever',
    description: 'For developers and security engineers running local WAF and LLM sandboxes.',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    deploymentType: 'Docker / Single Host',
    specs: {
      volume: '10K req/mo',
      deployment: 'Local Docker container',
      egress: 'Zero cloud telemetry',
      engine: 'L0 eBPF + L1 SIMD',
    },
    features: [
      '10K requests / month',
      'Local eBPF/XDP kernel drop filter',
      'SIMD Aho-Corasick pattern engine',
      'Local CLI & JSON verdict outputs',
      'Community Discord & GitHub support',
    ],
    missing: [
      '7B LLM Supreme Court',
      'Ouroboros autonomous evolution',
      'Multi-node clustering',
      'Enterprise SLA',
    ],
  },
  {
    id: 'growth',
    name: 'On-Premise Growth',
    badge: '⭐ Most Popular',
    badgeColor: '#00d4ff',
    priceUSD: 120,
    period: '/month',
    description: 'For production apps requiring local sub-8ms LLM guardrails and threat neutralization.',
    accentColor: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.35)',
    recommended: true,
    deploymentType: 'Bare-Metal / Dedicated VM',
    specs: {
      volume: '1M req/mo',
      deployment: 'Bare-metal Linux / VM',
      egress: 'Strict on-prem boundary',
      engine: 'All 10 Pipeline Layers',
    },
    features: [
      '1 Million requests / month',
      'Full 10-layer sovereign defense pipeline',
      'Local 0.5B + 7B Supreme Court models',
      'On-prem Ouroboros hot-patching',
      'Local Webhooks & Slack alerts',
      '99.5% Uptime SLA guarantee',
    ],
    missing: [
      'Multi-node HA cluster',
      'Air-gapped classified deployment',
      'Dedicated Security Architect',
    ],
  },
  {
    id: 'pro',
    name: 'On-Premise Pro Cluster',
    badge: 'High Availability',
    badgeColor: '#4ade80',
    priceUSD: 360,
    period: '/month',
    description: 'For scale-ups and regulated FinTech / Healthcare requiring multi-node HA clusters.',
    accentColor: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.3)',
    deploymentType: 'Kubernetes HA Cluster',
    specs: {
      volume: '5M req/mo',
      deployment: 'Multi-node K8s cluster',
      egress: 'Hardware-isolated network',
      engine: 'Distributed Threat Mesh',
    },
    features: [
      '5 Million requests / month',
      'Multi-node Kubernetes HA deployment',
      'Cross-node real-time threat gossip',
      'Hardware Security Module (HSM) support',
      'gRPC, SIEM & Prometheus telemetry',
      '99.9% Uptime SLA · 4hr MTTR',
    ],
    missing: [
      'Custom fine-tuned 80B model',
      'Dedicated Security Architect',
    ],
  },
  {
    id: 'enterprise',
    name: 'Air-Gapped Sovereign',
    badge: 'Defense Grade',
    badgeColor: '#f59e0b',
    priceUSD: 999,
    period: 'Custom Contract',
    description: 'For critical infrastructure, defense contractors, and tier-1 banks in isolated networks.',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    deploymentType: '100% Air-Gapped Subnet',
    specs: {
      volume: 'Unlimited',
      deployment: 'Air-gapped sovereign infra',
      egress: 'Strict physical isolation',
      engine: 'Custom 80B Supreme Court',
    },
    features: [
      'Unlimited volumetric request throughput',
      '100% Air-gapped & classified network support',
      'Custom fine-tuned 80B local LLM model',
      'Post-quantum cryptography (ML-KEM/DSA)',
      'Dedicated On-Premise Security Architect',
      '99.999% SLA · 15-min emergency response',
    ],
    missing: [],
  },
];

export default function PricingOrbs() {
  const [selectedId, setSelectedId] = useState<string>('growth');

  const selectedPlan = ON_PREM_PLANS.find(p => p.id === selectedId) || ON_PREM_PLANS[1];
  const isEnterprise = selectedPlan.id === 'enterprise';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {/* ─── On-Premise Value Banner ─── */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Server size={20} style={{ color: 'var(--neon-cyan)', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '0.8125rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              100% On-Premise Sovereign Architecture
            </span>
            <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
              All plans deploy inside your VPC, bare-metal servers, or air-gapped data centers. Zero prompt or token egress.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--neon-emerald)' }}>
          <Lock size={14} />
          <strong>Zero Cloud Retention</strong>
        </div>
      </div>

      {/* ─── Tier Switcher Tabs ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {ON_PREM_PLANS.map(plan => {
          const isSelected = plan.id === selectedId;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedId(plan.id)}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: isSelected ? 'var(--bg-card)' : 'var(--bg-void)',
                border: `1.5px solid ${isSelected ? plan.accentColor : 'var(--glass-border)'}`,
                boxShadow: isSelected ? `0 0 20px ${plan.glowColor}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${plan.accentColor}20`,
                    color: plan.accentColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {plan.badge}
                </span>
                {plan.recommended && (
                  <span style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                    POPULAR
                  </span>
                )}
              </div>

              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {plan.name}
              </div>

              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.35rem', color: plan.accentColor }}>
                {plan.priceUSD === 0 ? 'Free' : isEnterprise ? 'Custom' : `$${plan.priceUSD}`}
                <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}>
                  {' '}{plan.period}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Selected Plan Detailed Card ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: `1.5px solid ${selectedPlan.accentColor}40`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px ${selectedPlan.glowColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Plan Header & CTA */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: `${selectedPlan.accentColor}25`,
                    color: selectedPlan.accentColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedPlan.name}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
                  &bull; {selectedPlan.deploymentType}
                </span>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                {isEnterprise ? (
                  <span style={{ color: selectedPlan.accentColor }}>Custom On-Premise Contract</span>
                ) : (
                  <>
                    <span style={{ color: selectedPlan.accentColor }}>${selectedPlan.priceUSD}</span>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}>
                      {' '}{selectedPlan.period}
                    </span>
                  </>
                )}
              </div>

              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8125rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
                {selectedPlan.description}
              </p>
            </div>

            <Link
              href={isEnterprise ? '/contact' : `/auth/signup?plan=${selectedPlan.id}`}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '10px',
                background: selectedPlan.accentColor,
                color: '#000',
                fontWeight: 800,
                fontSize: '0.8125rem',
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: `0 0 20px ${selectedPlan.glowColor}`,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              <Zap size={15} />
              {selectedPlan.priceUSD === 0 ? 'Deploy Free On-Premise' : isEnterprise ? 'Request Sovereign Briefing' : 'Start 14-Day Free Trial'}
            </Link>
          </div>

          {/* Specs Quick Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '10px',
              background: 'var(--bg-void)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume Capacity</div>
              <div style={{ fontSize: '0.8125rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedPlan.specs.volume}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Host Environment</div>
              <div style={{ fontSize: '0.8125rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedPlan.specs.deployment}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data Egress</div>
              <div style={{ fontSize: '0.8125rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--neon-emerald)', marginTop: '2px' }}>{selectedPlan.specs.egress}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Detection Engine</div>
              <div style={{ fontSize: '0.8125rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: selectedPlan.accentColor, marginTop: '2px' }}>{selectedPlan.specs.engine}</div>
            </div>
          </div>

          {/* Features Lists */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Included */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: 'var(--neon-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Included Capabilities
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPlan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
                    <Check size={14} style={{ color: 'var(--neon-emerald)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded */}
            {selectedPlan.missing.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Upgrade For More
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedPlan.missing.map(m => (
                    <div key={m} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', opacity: 0.6 }}>
                      <X size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
