'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Zap, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ─── Plan Data — matches spryzen_complete_pricing.html exactly ──────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    tier: 'Free',
    icon: '🛡️',
    priceMonthly: 0,
    priceAnnual: 0,
    period: 'forever · no card needed',
    requests: '10,000 req/mo',
    tokens: '0.5B model only',
    support: 'No SLA · Community support',
    overage: null,
    color: '#555',
    ctaClass: 'btn-outline',
    ctaText: 'Start free →',
    ctaHref: '/auth/signup?plan=free',
    detection: [
      { label: 'Prompt injection', included: true },
      { label: 'Basic jailbreak', included: true },
      { label: 'CBRN probes', included: false },
      { label: 'Indirect injection', included: false },
    ],
    models: [
      { label: '0.5B fast gate', included: true },
      { label: '7B supreme court', included: false },
    ],
    features: [
      { label: 'REST API', included: true },
      { label: 'JSON verdict output', included: true },
      { label: 'Dashboard', included: false },
      { label: 'Webhooks', included: false },
      { label: 'Ouroboros evolution', included: false },
    ],
    supportItems: [
      { label: 'Discord community', included: true },
      { label: 'Email support', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tier: 'Starter',
    icon: '🔒',
    priceMonthly: 299,
    priceAnnual: 239,
    period: 'per month · 10M requests',
    requests: '10,000,000 req/mo',
    tokens: 'Early AI Startups',
    support: 'Email support · 99.9% Uptime',
    overage: '$0.20 / 1M req',
    overageColor: '#60a5fa',
    color: '#60a5fa',
    ctaClass: 'btn-starter',
    ctaText: 'Deploy Starter →',
    ctaHref: '/auth/signup?plan=starter',
    detection: [
      { label: 'Prompt injection defense', included: true },
      { label: 'OWASP LLM Top 10', included: true },
      { label: 'Token smuggling blocker', included: true },
      { label: 'Encoding obfuscation filter', included: true },
      { label: 'L0 XDP eBPF DDoS Guard', included: true },
      { label: 'L1 SIMD Fast Path', included: true },
    ],
    models: [
      { label: '0.5B Fast Wire Gate', included: true },
      { label: 'Semantic cosine index', included: true },
    ],
    features: [
      { label: 'REST API + Python SDK', included: true },
      { label: 'Security Dashboard', included: true },
      { label: '7-day request telemetry', included: true },
    ],
    supportItems: [
      { label: 'Email support', included: true },
      { label: '99.9% Uptime SLA', included: true },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tier: 'Growth',
    icon: '⚡',
    priceMonthly: 999,
    priceAnnual: 799,
    period: 'per month · 50M requests',
    requests: '50,000,000 req/mo',
    tokens: 'Scale-ups & High Traffic',
    support: 'Priority Slack · 99.95% SLA',
    overage: '$0.15 / 1M req',
    overageColor: '#a78bfa',
    color: '#a78bfa',
    recommended: true,
    ctaClass: 'btn-primary',
    ctaText: 'Start Growth →',
    ctaHref: '/auth/signup?plan=growth',
    detection: [
      { label: 'Everything in Starter, plus:', included: true, header: true },
      { label: 'Full 11-category taxonomy', included: true },
      { label: 'Multimodal PDF/image scan', included: true },
      { label: 'WebSocket / gRPC inspection', included: true },
      { label: 'Semantic drift tracking', included: true },
      { label: 'Canary token detection', included: true },
      { label: 'Ouroboros hot-patching', included: true, special: true },
    ],
    models: [
      { label: '14B Cognitive LLM Gate', included: true },
      { label: 'Semantic vector cache', included: true },
    ],
    features: [
      { label: 'Full dashboard + live telemetry', included: true },
      { label: '30-day request logs', included: true },
      { label: 'Webhooks + Slack alerts', included: true },
      { label: 'Attacker fingerprinting', included: true, special: true },
    ],
    supportItems: [
      { label: 'Priority Slack channel', included: true },
      { label: '99.95% Uptime SLA', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'Pro',
    icon: '🔥',
    priceMonthly: 2999,
    priceAnnual: 2399,
    period: 'per month · 200M requests',
    requests: '200,000,000 req/mo',
    tokens: 'Mid-Market SaaS',
    support: 'Shared Slack · 99.99% SLA · 1hr response',
    overage: '$0.12 / 1M req',
    overageColor: '#4ade80',
    color: '#4ade80',
    ctaClass: 'btn-pro',
    ctaText: 'Deploy Pro →',
    ctaHref: '/auth/signup?plan=pro',
    detection: [
      { label: 'Everything in Growth, plus:', included: true, header: true },
      { label: 'Cross-customer threat intel', included: true, special: true },
      { label: 'Global Ouroboros feed', included: true, special: true },
      { label: 'Business logic anomaly guard', included: true, special: true },
      { label: 'Threat actor attribution', included: true, special: true },
    ],
    features: [
      { label: 'Unlimited custom rules', included: true },
      { label: '90-day request logs', included: true },
      { label: 'Automated compliance audits', included: true },
      { label: 'SIEM export (Datadog/Splunk)', included: true },
    ],
    supportItems: [
      { label: 'Dedicated engineering channel', included: true },
      { label: '99.99% SLA · 1hr response', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'Enterprise',
    icon: '👑',
    priceMonthly: 7499,
    priceAnnual: 5999,
    period: 'per month · 1B requests',
    requests: '1,000,000,000 req/mo',
    tokens: 'Global Fintech & Health',
    support: 'Dedicated CSM · 24/7 · 15min SLA',
    overage: '$0.10 / 1M req',
    color: '#c084fc',
    enterprise: true,
    ctaClass: 'btn-enterprise',
    ctaText: 'Deploy Enterprise →',
    ctaHref: '/contact',
    detection: [
      { label: 'Everything in Pro, plus:', included: true, header: true },
      { label: 'Dedicated 110-node Bare-Metal Mesh', included: true, special: true },
      { label: 'Air-Gapped Sovereign Option', included: true, special: true },
      { label: 'Private Ouroboros instance', included: true, special: true },
      { label: 'Custom LLM fine-tuning', included: true, special: true },
    ],
    features: [
      { label: 'SOC2 & DPDP evidence pack', included: true },
      { label: 'Kani formal proof report', included: true },
      { label: 'Pen test audit report', included: true },
      { label: 'Source code escrow option', included: true },
    ],
    supportItems: [
      { label: 'Dedicated 24/7 SOC engineer', included: true },
      { label: '99.99% SLA · 15min response', included: true },
    ],
  },
];

// ─── Token Pricing Table ──────────────────────────────────────────────────
const TOKEN_MODELS = [
  {
    name: 'Spryzen 0.5B',
    badge: 'Fast Gate',
    badgeColor: '#4ade80',
    badgeBg: '#0c3a2a',
    routes: 'Obvious attacks + clear safe requests',
    inputPer1M: '$2.16',
    outputPer1M: '$1.08',
    avgPerReq: '$0.0012',
    latency: '<5ms',
    trafficShare: '~85%',
    trafficColor: '#4ade80',
    trafficBg: '#134e4a',
  },
  {
    name: 'Spryzen 7B',
    badge: 'Supreme Court',
    badgeColor: '#a78bfa',
    badgeBg: '#1e1a3a',
    routes: 'Ambiguous + complex attacks',
    inputPer1M: '$10.80',
    outputPer1M: '$5.40',
    avgPerReq: '$0.0066',
    latency: '~45ms',
    trafficShare: '~15%',
    trafficColor: '#a78bfa',
    trafficBg: '#1e1a3a',
  },
  {
    name: 'Semantic Index',
    badge: 'Cosine Pre-Check',
    badgeColor: '#fbbf24',
    badgeBg: '#1a1400',
    routes: 'Cosine pre-check (all traffic)',
    inputPer1M: '$0.54',
    outputPer1M: '—',
    avgPerReq: '$0.0002',
    latency: '<3ms',
    trafficShare: '100%',
    trafficColor: '#4ade80',
    trafficBg: '#134e4a',
  },
  {
    name: '80B Supreme',
    badge: 'Enterprise Only',
    badgeColor: '#f472b6',
    badgeBg: '#2a0a1a',
    routes: 'Enterprise: hardest edge cases',
    inputPer1M: '$54.00',
    outputPer1M: '$27.00',
    avgPerReq: '$0.0336',
    latency: '~400ms',
    trafficShare: 'Ent only',
    trafficColor: '#f472b6',
    trafficBg: '#2a0a1a',
  },
];

// ─── SLA Tiers ────────────────────────────────────────────────────────────
const SLA_TIERS = [
  { tier: 'Growth', pct: '99.5%', downtime: '3.6 hrs downtime/mo', credit: 'Service credits only', penalty: 'No cash penalty', color: '#888' },
  { tier: 'Business', pct: '99.9%', downtime: '43 min downtime/mo', credit: '10× downtime as credits', penalty: '$600/hr penalty', color: '#60a5fa' },
  { tier: 'Enterprise', pct: '99.99%', downtime: '4.3 min downtime/mo', credit: '30× downtime as credits', penalty: '$2,400/hr penalty', color: '#a78bfa' },
  { tier: 'Sovereign', pct: 'Custom', downtime: 'Negotiated per contract', credit: 'Custom credit structure', penalty: 'Custom penalty schedule', color: '#4ade80' },
];

// ─── FAQs ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How does Spryzen+ calculate billing requests?',
    a: 'We bill only for valid requests that are fully processed by your Spryzen application instances. Any requests blocked at the kernel network layer (via L0 XDP/eBPF) are 100% free and do not count toward your monthly quota.',
  },
  {
    q: 'What payment currencies and methods are supported?',
    a: 'We support USD billing processed securely via Stripe (Credit Cards, Apple Pay, Google Pay) and corporate Bank Transfer (ACH/wire). GST/VAT compliance details are automatically attached for tax credit compliance.',
  },
  {
    q: 'What is Ouroboros hot-patching?',
    a: 'Ouroboros is our self-evolving engine. When a new attack pattern is detected in production, it generates and deploys a Wasm patch automatically within seconds — without downtime or manual intervention. Available from Growth tier.',
  },
  {
    q: 'How does the annual discount work?',
    a: 'Annual billing gives you 20% off vs monthly pricing. You pay upfront for the year. Upgrades are pro-rated. Downgrades take effect at the next billing cycle. Enterprise contracts are custom with NET-30 invoicing.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100vh', paddingBottom: '6rem' }}>

      {/* ─── HERO ─── */}
      <section className="section" style={{ textAlign: 'center', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-orb-cyan" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)', opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '1.25rem', display: 'inline-flex', gap: '0.4rem' }}>
            <Star size={10} />
            Formally verified AI security
          </span>
          <h1 className="text-h1" style={{ marginBottom: '1rem' }}>
            Simple pricing.{' '}
            <span className="text-gradient-cyan">Serious protection.</span>
          </h1>
          <p className="text-lead" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            Pay per request. No hidden fees. No vendor lock-in.
            Switch plans anytime. Cancel anytime.
          </p>

          {/* Hero stats */}
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { value: '78,000+', label: 'attack examples trained on', color: '#a78bfa' },
              { value: '99.4%', label: 'detection rate', color: '#4ade80' },
              { value: '<8ms', label: 'avg response time', color: '#60a5fa' },
              { value: '10', label: 'pipeline layers', color: '#fb923c' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color, marginBottom: 3, fontFamily: 'Outfit' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Billing toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '0.875rem', color: annual ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: annual ? 400 : 700 }}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              style={{
                position: 'relative', width: 52, height: 28, borderRadius: 14,
                background: annual ? '#7c3aed' : '#1a1a35',
                border: `1px solid ${annual ? '#7c3aed' : '#222238'}`,
                cursor: 'pointer', transition: 'all 0.3s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', height: 22, width: 22, left: annual ? 26 : 2, bottom: 2,
                background: '#fff', borderRadius: '50%', transition: 'left 0.3s',
                display: 'block',
              }} />
            </button>
            <span style={{ fontSize: '0.875rem', color: annual ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: annual ? 700 : 400 }}>Annual</span>
            <span style={{ background: '#134e4a', color: '#6ee7b7', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>Save 20%</span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            All pricing is listed in USD. Regional sales taxes are calculated at checkout.
          </div>
        </div>
      </section>

      {/* ─── PLAN CARDS GRID ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
        }}>
          {PLANS.map((plan, i) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            const isEnterprise = plan.enterprise;
            const isGrowth = plan.recommended;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: isEnterprise
                    ? 'linear-gradient(160deg, #0d0d1a, #100d1f)'
                    : 'var(--bg-card)',
                  border: isGrowth
                    ? '1px solid #7c3aed'
                    : isEnterprise
                    ? '1px solid #2d1f5e'
                    : '1px solid var(--glass-border)',
                  borderRadius: 18,
                  padding: '1.625rem 1.375rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isGrowth
                    ? '0 0 0 1px rgba(124,58,237,0.18), 0 24px 48px rgba(124,58,237,0.1)'
                    : 'var(--shadow-card)',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                whileHover={{ y: -3 }}
              >
                {isGrowth && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: '#7c3aed', color: '#fff', fontSize: '0.625rem', fontWeight: 700,
                    padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.05em',
                  }}>
                    ⭐ Most Popular
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 17, marginBottom: 12,
                  background: isGrowth ? '#2d1f5e' : isEnterprise ? '#1a0a2a' : plan.id === 'starter' ? '#0c1a2e' : plan.id === 'pro' ? '#0a2a0a' : '#111128',
                }}>
                  {plan.icon}
                </div>

                {/* Tier label */}
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: plan.color, marginBottom: 8 }}>
                  {plan.tier}
                </div>

                {/* Price */}
                <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, marginBottom: 2 }}>
                  {isEnterprise ? (
                    <span style={{ fontSize: 24, paddingTop: 6, display: 'inline-block', color: plan.color }}>Custom</span>
                  ) : (
                    <>
                      <sup style={{ fontSize: 18, verticalAlign: 'top', marginTop: 7, display: 'inline-block' }}>$</sup>
                      {price === 0 ? '0' : price?.toLocaleString('en-US')}
                    </>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  {plan.period}
                </div>

                {/* Requests box */}
                <div style={{
                  background: '#08081a', border: '1px solid #141428', borderRadius: 9,
                  padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text-muted)',
                  lineHeight: 1.65, marginBottom: 16,
                }}>
                  <strong style={{ color: plan.color }}>{plan.requests}</strong><br />
                  {plan.tokens}<br />
                  {plan.overage && (
                    <span style={{ color: plan.overageColor }}>Overage: {plan.overage}</span>
                  )}
                  {isEnterprise && (
                    <span style={{ color: plan.color }}>Starting {plan.startingAt}</span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10,
                    fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                    marginBottom: 22, textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
                    ...(plan.id === 'free' ? { background: '#1a1a30', color: '#888', border: '1px solid #222238' }
                      : plan.id === 'starter' ? { background: '#0c2a3a', color: '#38bdf8', border: '1px solid #0a3a4a' }
                      : plan.id === 'growth' ? { background: '#7c3aed', color: '#fff', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }
                      : plan.id === 'pro' ? { background: '#0a2a0a', color: '#4ade80', border: '1px solid #1a3a1a' }
                      : { background: 'linear-gradient(135deg,#1a1400,#2a1a00)', color: '#fbbf24', border: '1px solid #3a2a00' })
                  }}
                >
                  {plan.ctaText}
                </Link>

                {/* Detection features */}
                {plan.detection && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '0 0 9px' }}>Detection</div>
                    {plan.detection.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} special={(f as any).special} header={(f as any).header} />
                    ))}
                  </>
                )}

                {/* Models */}
                {plan.models && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '16px 0 9px' }}>Models</div>
                    {plan.models.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} />
                    ))}
                  </>
                )}

                {/* Pipeline */}
                {plan.pipeline && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '16px 0 9px' }}>Pipeline</div>
                    {plan.pipeline.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} />
                    ))}
                  </>
                )}

                {/* Features */}
                {plan.features && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '16px 0 9px' }}>Features</div>
                    {plan.features.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} special={(f as any).special} />
                    ))}
                  </>
                )}

                {/* Integrations */}
                {plan.integrations && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '16px 0 9px' }}>Integrations</div>
                    {plan.integrations.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} />
                    ))}
                  </>
                )}

                {/* Support */}
                {plan.supportItems && (
                  <>
                    <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '16px 0 9px' }}>Support</div>
                    {plan.supportItems.map(f => (
                      <FeatureRow key={f.label} label={f.label} included={f.included} />
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── MODULAR PAY-AS-YOU-GO ADD-ONS ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <span className="section-eyebrow">Modular Power-Ups</span>
          <h2 className="text-h2" style={{ marginBottom: 8 }}>Pay-As-You-Go Add-On Modules</h2>
          <p className="text-lead" style={{ fontSize: '0.875rem', maxWidth: 650, margin: '0 auto' }}>
            Scale specific capabilities on-demand without upgrading your entire subscription tier.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            {
              id: 'gw_router',
              icon: '🔀',
              title: 'Universal AI Gateway',
              price: '$49 / mo',
              desc: 'High-speed reverse proxy API routing + live observability baseline.',
              cta: 'Activate Module',
            },
            {
              id: 'id_protocol',
              icon: '🪪',
              title: 'Spryzen ID (Agent Auth)',
              price: '$99 / mo',
              desc: 'Stateless Ed25519 cryptographic identity & signature verification for autonomous AI Agents.',
              cta: 'Activate Module',
            },
            {
              id: 'redteam_ex',
              icon: '🎯',
              title: 'Red Team Exercise',
              price: '$499 / mo',
              desc: 'Automated adversarial probe campaigns and continuous pen-testing for development teams.',
              cta: 'Activate Module',
            },
            {
              id: 'compliance_acc',
              icon: '📑',
              title: 'Compliance Accelerator',
              price: '$500 / mo',
              desc: 'Auto-generated cryptographically signed SOC-2, HIPAA, ISO 27001, and India DPDP compliance PDFs.',
              cta: 'Activate Module',
            },
            {
              id: 'multi_region',
              icon: '🌐',
              title: 'Multi-Region Sync',
              price: '$499 / mo',
              desc: 'Global sub-millisecond state replication and zero-downtime multi-cloud cluster consensus.',
              cta: 'Activate Module',
            },
            {
              id: 'siem_hook',
              icon: '📡',
              title: 'SIEM Integration',
              price: '$99 / mo',
              desc: 'Real-time high-throughput streaming to Datadog, Splunk, Elastic, and Microsoft Sentinel.',
              cta: 'Activate Module',
            },
            {
              id: 'private_oro',
              icon: '🐍',
              title: 'Private Ouroboros Instance',
              price: '$1,000 / mo',
              desc: 'Dedicated private ML training loop for custom proprietary threat models and dynamic eBPF patches.',
              cta: 'Activate Module',
            },
            {
              id: 'exec_dash',
              icon: '📊',
              title: 'Executive 3D Dashboard',
              price: '$149 / mo',
              desc: 'WebGL live-attack 3D visual forensics with geographic telemetry mapping.',
              cta: 'Activate Module',
            },
            {
              id: 'aether_shield',
              icon: '🛡️',
              title: 'Aether Shield (ZK-DPI)',
              price: '$399 / mo',
              desc: 'Privacy-safe Zero-Knowledge Deep Packet Inspection without ever decrypting raw user data.',
              cta: 'Activate Module',
            },
            {
              id: 'm_td_rotate',
              icon: '🔄',
              title: 'Shapeshifter MTD',
              price: '$199 / mo',
              desc: 'Dynamic Moving Target Defense with automated IPv6/Port rotation to blind network scanners.',
              cta: 'Activate Module',
            },
            {
              id: 'soul_catcher',
              icon: '🧬',
              title: 'Soul Catcher (Biometrics)',
              price: '$299 / mo',
              desc: 'Real-time mouse dynamics, keystroke rhythm, and headless scraper bot detection (0 CAPTCHAs).',
              cta: 'Activate Module',
            },
            {
              id: 'vaporize_dlp',
              icon: '💨',
              title: 'Vaporize (DLP)',
              price: '$249 / mo',
              desc: 'Hardware-accelerated SIMD PII, API key, credit card, and secret leakage redaction in egress streams.',
              cta: 'Activate Module',
            },
            {
              id: 'lazarus_tunnel',
              icon: '⚡',
              title: 'Lazarus DEFCON-1',
              price: '$499 / mo',
              desc: 'Instant failover IronCore Sidecar tunnel activation during extreme catastrophic network partitions.',
              cta: 'Activate Module',
            },
            {
              id: 'honeypot_net',
              icon: '🍯',
              title: 'Cognitive Honeytokens',
              price: '$299 / mo',
              desc: 'Active deception network (Tartarus) synthesizing fake endpoints to poison and trap attackers.',
              cta: 'Activate Module',
            },
            {
              id: 'deepfake_guard',
              icon: '👁️',
              title: 'Multimodal Deepfake Guard',
              price: '$299 / mo',
              desc: 'Adversarial audio, visual, and image sanitization against multimodal AI prompt exploits.',
              cta: 'Activate Module',
            },
            {
              id: 'scraping_noise',
              icon: '🌫️',
              title: 'Adversarial Scraper Noise',
              price: '$299 / mo',
              desc: 'Active synthetic noise injection into response bodies to poison and break AI scrapers.',
              cta: 'Activate Module',
            },
            {
              id: 'rag_sanitizer',
              icon: '🛡️',
              title: 'Poisoned RAG Shield',
              price: '$200 / mo',
              desc: 'Vector-space embedding validation and semantic cosine anomaly detection for enterprise RAG.',
              cta: 'Activate Module',
            },
          ].map((addon) => (
            <motion.div
              key={addon.title}
              className="glass-card"
              style={{
                padding: '22px 20px',
                borderRadius: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              whileHover={{ y: -3 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{addon.icon}</span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: 'var(--neon-cyan)',
                    background: 'var(--neon-cyan-dim)',
                    padding: '3px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--neon-cyan-glow)',
                  }}>
                    {addon.price}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                  {addon.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 18 }}>
                  {addon.desc}
                </p>
              </div>

              <Link
                href="/portal/billing"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '9px',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s',
                }}
              >
                {addon.cta} &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── TOKEN PRICING TABLE ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Usage-Based Billing</span>
          <h2 className="text-h2" style={{ marginBottom: 8 }}>Token pricing by model</h2>
          <p className="text-lead" style={{ fontSize: '0.875rem' }}>
            Traffic is routed automatically. You pay based on which model processed each request.
            85% of requests use the fast 0.5B gate. Only ~15% escalate to 7B.
          </p>
        </div>

        <motion.div
          className="glass-card"
          style={{ overflow: 'hidden', padding: 0 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Model', 'Routes', 'Input / 1M tokens', 'Output / 1M tokens', 'Avg per request', 'Latency', 'Traffic share'].map(h => (
                    <th key={h} style={{
                      background: '#080814', fontSize: '0.625rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '1px', color: '#444',
                      padding: '13px 20px', textAlign: 'left', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOKEN_MODELS.map((m, i) => (
                  <tr key={m.name} style={{ borderTop: '1px solid #111120' }}>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: '0.625rem', padding: '2px 8px',
                        borderRadius: 10, fontWeight: 700,
                        background: m.badgeBg, color: m.badgeColor,
                      }}>
                        {m.name}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#555' }}>{m.routes}</td>
                    <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: m.badgeColor, fontWeight: 700 }}>{m.inputPer1M}</td>
                    <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: m.outputPer1M === '—' ? '#555' : m.badgeColor, fontWeight: m.outputPer1M === '—' ? 400 : 700 }}>{m.outputPer1M}</td>
                    <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: m.badgeColor, fontWeight: 700 }}>{m.avgPerReq}</td>
                    <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#555' }}>{m.latency}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: '0.625rem', padding: '2px 8px',
                        borderRadius: 10, fontWeight: 700,
                        background: m.trafficBg, color: m.trafficColor,
                      }}>
                        {m.trafficShare}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Blended avg row */}
                <tr style={{ background: '#08080f', borderTop: '1px solid #111120' }}>
                  <td style={{ padding: '13px 20px', color: '#888' }}><strong>Blended avg</strong></td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#444' }}>Typical production mix</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#e2e2e8', fontWeight: 700 }}>$2.88</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#e2e2e8', fontWeight: 700 }}>$1.44</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#e2e2e8', fontWeight: 700 }}>$0.0017</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#888' }}>&lt;8ms avg</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.8125rem', color: '#444' }}>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* ─── SLA TIERS ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Reliability</span>
          <h2 className="text-h2" style={{ marginBottom: 8 }}>SLA tiers and financial penalties</h2>
          <p className="text-lead" style={{ fontSize: '0.875rem' }}>
            Real financial penalties on enterprise contracts. That&apos;s what builds enterprise trust.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {SLA_TIERS.map(sla => (
            <motion.div
              key={sla.tier}
              className="glass-card"
              style={{ padding: '18px 20px', textAlign: 'center' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: sla.color, marginBottom: 4 }}>{sla.pct}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{sla.tier}</div>
              <div style={{ fontSize: '0.6875rem', color: '#444', marginBottom: 10 }}>{sla.downtime}</div>
              <hr style={{ border: 'none', borderTop: '1px solid #141428', margin: '10px 0' }} />
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{sla.credit}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f87171', marginTop: 6 }}>{sla.penalty}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── BILLING DETAILS ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Transparency</span>
          <h2 className="text-h2" style={{ marginBottom: 8 }}>Billing details</h2>
          <p className="text-lead" style={{ fontSize: '0.875rem' }}>Everything you need to know about how billing works.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {[
            { icon: '📅', title: 'Billing cycle', desc: 'Monthly plans billed on the 1st. Annual billed upfront with 20% discount. Pro-rated billing on upgrades. Downgrades effective next cycle.' },
            { icon: '📊', title: 'Overage billing', desc: 'Billed at month end. Alerts at 80% and 95% via email + webhook. Set hard limits to prevent overages entirely.' },
            { icon: '💳', title: 'Payment methods', desc: 'India: UPI, NEFT, net banking, debit card via Razorpay. International: Stripe. Enterprise: invoice + NET-30 terms.' },
            { icon: '📈', title: 'Usage counting', desc: '1 request = 1 call to /v1/analyze. WebSocket: billed per frame inspected. Batch: each item = 1 request. Failed requests not counted.' },
            { icon: '🏢', title: 'Volume discounts', desc: '5–10 seats: 10% off. 11–25: 15% off. 25+: custom. Startup program (pre-Series A): 50% off Growth for 12 months.' },
            { icon: '🌍', title: 'GST', desc: 'Indian businesses: 18% GST added. GST invoice auto-generated. International: zero-rated. Provide GSTIN at checkout for input credit.' },
            { icon: '💰', title: 'Refund policy', desc: '14-day money-back on first payment. After 14 days: no refunds monthly. Annual: pro-rated refund within 60 days. Outage: 10× downtime as credits.' },
            { icon: '🔒', title: 'Data retention', desc: 'Free/Starter: 7 days. Growth: 30 days. Pro: 90 days. Enterprise: 1yr+. Raw prompts deleted after verdict unless logging enabled.' },
            { icon: '🔄', title: 'Contract structure', desc: 'Enterprise needs: MSA + DPA + SLA + NDA. Annual upfront preferred. NET-30 invoicing. Auto-renew with 90-day cancellation notice.' },
          ].map(card => (
            <motion.div
              key={card.title}
              className="glass-card"
              style={{ padding: '18px 20px' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 10 }}>{card.icon} {card.title}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── STARTUP BANNER ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          style={{
            background: 'linear-gradient(135deg, #0a1a0a, #0a0a1a)',
            border: '1px solid #1a3a1a', borderRadius: 14,
            padding: '20px 28px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
              Startup program — 50% off Growth for 12 months
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#5a7a5a', margin: 0 }}>
              Pre-Series A · Under $1M ARR · Building something real with AI · No pitch deck needed
            </p>
          </div>
          <Link
            href="/contact?program=startup"
            style={{
              background: '#0a2a0a', color: '#4ade80', border: '1px solid #1a4a1a',
              padding: '10px 22px', borderRadius: 10, fontSize: '0.8125rem', fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Apply now → founders@spryzen.io
          </Link>
        </motion.div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: 800, margin: '0 auto' }}>
        <h2 className="text-h2" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {FAQS.map((faq, idx) => (
            <motion.div
              key={idx}
              className="glass-card"
              style={{ padding: '1.5rem' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={16} style={{ color: 'var(--neon-cyan)' }} />
                {faq.q}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA BOTTOM ─── */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(13,13,42,0.5))', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-orb glow-orb-cyan" style={{ width: 500, height: 500, top: -150, left: '50%', transform: 'translateX(-50%)', opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>Start protecting your AI today</h2>
          <p className="text-lead" style={{ marginBottom: '2rem' }}>
            10,000 requests free. No credit card. Takes 5 minutes to integrate.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              <Zap size={18} />
              Start for free
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Talk to enterprise sales <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Helper: Feature Row ───────────────────────────────────────────────────
function FeatureRow({ label, included, special, header }: {
  label: string;
  included: boolean;
  special?: boolean;
  header?: boolean;
}) {
  if (header) {
    return (
      <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', margin: '0 0 9px' }}>
        {label}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 9, marginBottom: 8, fontSize: '0.75rem', lineHeight: 1.45, color: '#999', alignItems: 'flex-start' }}>
      <span style={{
        flexShrink: 0, width: 15, height: 15, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, marginTop: 1,
        background: special ? '#2d1f5e' : included ? '#134e4a' : '#1a1a1a',
        color: special ? '#a78bfa' : included ? '#6ee7b7' : '#333',
      }}>
        {special ? '★' : included ? '✓' : '✗'}
      </span>
      {label}
    </div>
  );
}
