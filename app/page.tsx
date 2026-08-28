'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Shield, ChevronRight, ArrowRight, Star, Terminal, Globe2, Brain, Lock } from 'lucide-react';
import StatsCounter from '@/components/ui/StatsCounter';
import LivePlayground from '@/components/ui/LivePlayground';
import RoiCalculator from '@/components/ui/RoiCalculator';

// Lazy-load heavy 3D components
const ShieldScene  = dynamic(() => import('@/components/3d/ShieldScene'),  { ssr: false });
const NodeGraph    = dynamic(() => import('@/components/3d/NodeGraph'),    { ssr: false });
const PricingOrbs  = dynamic(() => import('@/components/3d/PricingOrbs'),  { ssr: false });

// ─── Terminal Lines ───────────────────────────────────────────────────────
const terminalLines = [
  { type: 'system',  text: '[SYSTEM] Spryzen+ v2.6 — Sovereign Security Engine Online' },
  { type: 'attack',  text: '[THREAT] SQLi probe from 45.33.32.156 — Score: 0.98' },
  { type: 'defense', text: '[WAF]    Pattern matched: UNION SELECT. Blocked in 0.8ms.' },
  { type: 'ai',      text: '[PHI-3]  "Coordinated DB enumeration attempt neutralized."' },
  { type: 'system',  text: '[TARTARUS] Attacker banished to Mirror Dimension.' },
  { type: 'defense', text: '[GALACTIC] Threat signature broadcast to global mesh.' },
  { type: 'ai',      text: '[XP]     +100 XP | Level 3 → Autonomous SOC Unlocked' },
  { type: 'default', text: '█' },
];

const colorMap: Record<string, string> = {
  system:  'var(--neon-cyan)',
  attack:  'var(--neon-crimson)',
  defense: 'var(--neon-emerald)',
  ai:      '#a855f7',
  default: 'var(--text-muted)',
};

// ─── Feature Cards ────────────────────────────────────────────────────────
const features = [
  {
    icon: Shield,
    color: 'var(--neon-cyan)',
    badge: 'God Protocol',
    title: '1,500+ Attack Patterns',
    desc: 'From Prototype Pollution to GraphQL nested bombs. Catch the 15% of attacks commercial WAFs miss.',
  },
  {
    icon: Brain,
    color: '#a855f7',
    badge: 'Autonomous',
    title: '6 Sovereign AI Agents',
    desc: 'ARIA (Business Impact), HUNTER (Stealth), COMPLY (Statutory Audit) running 24/7 without human input.',
  },
  {
    icon: Lock,
    color: 'var(--neon-emerald)',
    badge: 'On-Premise Native',
    title: 'Zero Data Sovereignty Risk',
    desc: 'Your traffic never touches our servers. Absolute on-premise filtering with eBPF kernel-level speed.',
  },
  {
    icon: Globe2,
    color: 'var(--neon-gold)',
    badge: 'Global Mesh',
    title: 'Galactic Consensus',
    desc: 'One node\'s discovery instantly protects every node worldwide via quantum-signed threat gossip.',
  },
  {
    icon: Terminal,
    color: 'var(--neon-crimson)',
    badge: 'Mirror Dimension',
    title: 'Tartarus Honeypot Engine',
    desc: 'Persistent attackers are banished to infinite fake infrastructure that exhausts their resources.',
  },
  {
    icon: Zap,
    color: 'var(--neon-orange)',
    badge: 'Self-Evolving',
    title: 'Ouroboros Engine',
    desc: 'Shadow red-teaming generates and deploys Wasm patches before attackers can pivot. 0-day resilience.',
  },
];

// ─── Compliance Stats ─────────────────────────────────────────────────────
const complianceItems = [
  { label: 'DPDP 2023', color: 'var(--neon-cyan)' },
  { label: 'GDPR',      color: 'var(--neon-violet)' },
  { label: 'ISO 27001', color: 'var(--neon-emerald)' },
  { label: 'SOC 2',     color: 'var(--neon-gold)' },
  { label: 'PCI DSS',   color: 'var(--neon-orange)' },
];

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem var(--section-px)',
          textAlign: 'center',
        }}
      >
        {/* Background glow orbs */}
        <div className="glow-orb glow-orb-cyan" style={{ width: 700, height: 700, top: -200, right: -200, zIndex: 0 }} />
        <div className="glow-orb glow-orb-violet" style={{ width: 500, height: 500, bottom: -150, left: -150, zIndex: 0 }} />

        {/* 3D Shield background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.7 }}>
          <ShieldScene />
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, transparent, var(--bg-void))',
          zIndex: 1,
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge badge-cyan" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Star size={10} />
              Absolute Intelligence Supremacy · v2.6 Production Ready
            </span>
          </motion.div>

          <motion.h1
            className="text-hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Defend Like a{' '}
            <span className="text-gradient-cyan">Sovereign.</span>
          </motion.h1>

          <motion.p
            className="text-lead"
            style={{ maxWidth: '640px', margin: '1.5rem auto 2.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The world&apos;s first self-evolving, on-premise AI security engine with 1,500+ detection patterns,
            6 autonomous SOC agents, and real-time Tartarus honeypot deception — 62% cheaper than Cloudflare.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              <Zap size={18} />
              Start Free Trial
            </Link>
            <Link href="/wargame" className="btn btn-secondary btn-lg">
              View Live War Game
              <ChevronRight size={18} />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {['No credit card required', 'DPDP Compliant', '99.9% Uptime SLA'].map((text) => (
              <span
                key={text}
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--neon-emerald)',
                    boxShadow: '0 0 8px var(--neon-emerald)',
                    display: 'inline-block',
                  }}
                />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────────────── */}
      <section className="section">
        <StatsCounter />
      </section>

      {/* ─── LIVE INTERACTIVE ATTACK PLAYGROUND ─────────────────────────────── */}
      <section className="section" id="playground" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-eyebrow">Interactive Attack Simulator</span>
          <h2 className="text-h1">Test Spryzen's Defense Shield Live</h2>
          <p className="text-lead" style={{ maxWidth: 640, margin: '1rem auto 0' }}>
            Simulate prompt injections, PII extraction, and SQLi attacks in real-time. See sub-8ms interception with formal mathematical proofs.
          </p>
        </div>
        <LivePlayground />
      </section>

      {/* ─── ENTERPRISE ROI & LATENCY CALCULATOR ────────────────────────────── */}
      <section className="section" id="roi" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <RoiCalculator />
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="section" id="features">
        <div className="section-header">
          <span className="section-eyebrow">Core Technology</span>
          <h2 className="text-h1">Indestructible Architecture</h2>
          <p className="text-lead" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
            Built for state-level resilience and sub-millisecond precision — from the kernel up.
          </p>
        </div>

        <div className="grid-features">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card"
              style={{ padding: '2rem' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-sm)',
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <span
                  className="badge"
                  style={{
                    background: `${f.color}15`,
                    color: f.color,
                    border: `1px solid ${f.color}33`,
                    fontSize: '0.65rem',
                  }}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="text-h3" style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ARCHITECTURE FLYTHROUGH ───────────────────────────────────────── */}
      <section className="section" id="architecture">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-eyebrow">How It Works</span>
            <h2 className="text-h1">Defense in Depth</h2>
            <p className="text-lead" style={{ margin: '1rem 0 2rem' }}>
              Six interlocking security layers — each with its own AI agent — create a fortress that
              hardens itself every time an attacker probes it.
            </p>

            {[
              { color: 'var(--neon-cyan)',    label: 'Pingora Proxy',   desc: 'L7 reverse proxy core — TLS, routing' },
              { color: '#7c3aed',             label: 'WAF Core',        desc: '1,500+ patterns, ML anomaly detection' },
              { color: 'var(--neon-crimson)', label: 'Tartarus Engine', desc: 'Honeypot deception, Mirror Dimension' },
              { color: 'var(--neon-emerald)', label: 'Aegis Prime',     desc: 'Kernel eBPF/XDP packet filtering' },
              { color: 'var(--neon-gold)',    label: 'Ghost Engine',    desc: 'Hot-reloadable Wasm plugin runtime' },
              { color: '#a855f7',             label: 'Ouroboros AI',    desc: 'Self-evolution via shadow red-teaming' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-start gap-4 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 10px ${item.color}`,
                  marginTop: 5, flexShrink: 0,
                }} />
                <div>
                  <span style={{ color: item.color, fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: 8 }}>{item.desc}</span>
                </div>
              </motion.div>
            ))}

            <Link href="/features" className="btn btn-secondary mt-4">
              View Full Architecture <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ height: '500px', position: 'relative' }}>
            <NodeGraph />
          </div>
        </div>
      </section>

      {/* ─── WAR GAME TERMINAL ─────────────────────────────────────────────── */}
      <section className="section" id="wargame">
        <div className="section-header">
          <span className="section-eyebrow">Live Proof</span>
          <h2 className="text-h1">The Great War Game</h2>
          <p className="text-lead" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
            Live transparency of our 30-day stress test against state-level volumetric attacks.
          </p>
        </div>

        <div className="terminal" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#ff5f56' }} />
            <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
            <div className="terminal-dot" style={{ background: '#27c93f' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem', fontFamily: 'JetBrains Mono' }}>
              spryzen@sovereign ~ — war-game-live
            </span>
          </div>

          {terminalLines.map((line, i) => (
            <motion.div
              key={i}
              style={{ color: colorMap[line.type], marginBottom: '0.25rem' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/wargame" className="btn btn-primary">
            <Zap size={16} />
            View Full War Game Dashboard
          </Link>
        </div>
      </section>

      {/* ─── PRICING PREVIEW ───────────────────────────────────────────────── */}
      <section className="section" id="pricing">
        <div className="section-header">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="text-h1">The 40% Rule</h2>
          <p className="text-lead" style={{ maxWidth: 560, margin: '1rem auto 0' }}>
            By filtering at the network card (not the cloud), we eliminate bandwidth costs —
            and pass 100% of savings to you.
          </p>
        </div>

        <PricingOrbs />

        <div className="flex justify-center mt-8">
          <Link href="/pricing" className="btn btn-secondary">
            See Full Pricing & ROI Calculator <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── COMPLIANCE STRIP ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: '3rem var(--section-px)',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="text-label" style={{ color: 'var(--text-muted)' }}>Compliance & Certifications</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Built for regulated enterprises</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {complianceItems.map((item) => (
              <span
                key={item.label}
                className="badge"
                style={{
                  background: `${item.color}10`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                  fontSize: '0.75rem',
                  padding: '0.5rem 1rem',
                }}
              >
                ✓ {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-orb-cyan" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-eyebrow">Get Started Today</span>
          <h2 className="text-h1" style={{ marginBottom: '1rem' }}>
            Ready to become{' '}
            <span className="text-gradient-cyan">Sovereign?</span>
          </h2>
          <p className="text-lead" style={{ maxWidth: 500, margin: '0 auto 2.5rem' }}>
            Join enterprises protecting billions of requests per month with Spryzen+.
            Free Scout tier — no credit card required.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              <Zap size={20} />
              Start Free — No Card Needed
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Talk to Sales <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
