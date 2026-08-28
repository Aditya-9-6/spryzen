'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, TrendingDown, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function RoiCalculator() {
  const [requestsK, setRequestsK] = useState(500); // 500k requests/month

  // Calculations
  const spryzenCost = Math.max(29, Math.round(requestsK * 0.08)); // $0.08 per 1k reqs baseline
  const cloudflareWafCost = Math.round(200 + requestsK * 0.45); // Enterprise WAF + custom rule tier
  const awsWafCost = Math.round(150 + requestsK * 0.50); // Rules + inspection fees
  const lakeraCost = Math.round(requestsK * 0.85); // Pure SaaS per-token guardrail

  const monthlySavings = Math.max(0, cloudflareWafCost - spryzenCost);
  const annualSavings = monthlySavings * 12;
  const latencySavedMs = 38; // 45ms legacy vs 7ms Spryzen

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '16px',
        border: '1px solid var(--glass-border)',
        background: 'var(--bg-card)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 212, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── Header ─── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Calculator size={16} />
            Enterprise Cost & Latency Benchmark
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', margin: '0.35rem 0 0 0', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
            Calculate Your ROI with Spryzen
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', margin: '0.25rem 0 0 0' }}>
            Compare Spryzen's sovereign zero-trust engine against legacy proxy & WAF stacks
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            background: 'var(--neon-emerald-dim)',
            border: '1px solid var(--neon-emerald-glow)',
            color: 'var(--neon-emerald)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8125rem',
            fontWeight: 800,
          }}
        >
          <TrendingDown size={18} />
          Save up to 75% Monthly
        </div>
      </div>

      {/* ─── Slider Control ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Monthly AI / API Request Volume:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neon-cyan)' }}>
            {requestsK >= 1000 ? `${(requestsK / 1000).toFixed(1)}M` : `${requestsK}K`} requests/mo
          </span>
        </div>

        <input
          type="range"
          min={50}
          max={10000}
          step={50}
          value={requestsK}
          onChange={e => setRequestsK(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: 'var(--bg-void)',
            outline: 'none',
            cursor: 'pointer',
            border: '1px solid var(--glass-border)',
            accentColor: 'var(--neon-cyan)',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
          <span>50K (Early Stage)</span>
          <span>1M (Scale Up)</span>
          <span>5M (Growth)</span>
          <span>10M+ (Enterprise)</span>
        </div>
      </div>

      {/* ─── Comparison Cards Grid ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Spryzen Card */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--neon-cyan-dim)',
            border: '2px solid var(--neon-cyan)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 0 25px rgba(0, 212, 255, 0.15)',
          }}
        >
          <div style={{ position: 'absolute', top: '-10px', left: '1rem', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', background: 'var(--neon-cyan)', color: '#000', textTransform: 'uppercase' }}>
            Sovereign Engine
          </div>
          <div style={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', fontSize: '1.125rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            Spryzen+
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--neon-cyan)' }}>
            ${spryzenCost.toLocaleString()}
            <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
          </div>
          <div style={{ borderTop: '1px solid var(--neon-cyan-glow)', paddingTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neon-emerald)' }}>
              <Check size={12} /> &lt;7ms avg overhead
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neon-emerald)' }}>
              <Check size={12} /> On-prem sovereign
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--neon-emerald)' }}>
              <Check size={12} /> Zero token leakage
            </div>
          </div>
        </div>

        {/* Cloudflare WAF */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-void)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Cloudflare WAF
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            ${cloudflareWafCost.toLocaleString()}
            <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <div>&bull; ~42ms proxy latency</div>
            <div>&bull; Cloud-hosted routing</div>
            <div>&bull; Basic pattern rules</div>
          </div>
        </div>

        {/* AWS WAF */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-void)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            AWS WAF + Rules
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            ${awsWafCost.toLocaleString()}
            <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <div>&bull; ~35ms AWS hop</div>
            <div>&bull; Per-rule metering fee</div>
            <div>&bull; No prompt semantics</div>
          </div>
        </div>

        {/* Lakera Guardrail */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: '12px',
            background: 'var(--bg-void)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            SaaS Guardrails
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            ${lakeraCost.toLocaleString()}
            <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
            <div>&bull; ~65ms cloud roundtrip</div>
            <div>&bull; Third-party data egress</div>
            <div>&bull; $0.85 per 1k requests</div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Savings Banner ─── */}
      <div
        style={{
          padding: '1.25rem 1.75rem',
          borderRadius: '12px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Estimated Annual Savings with Spryzen
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--neon-emerald)' }}>
            ${annualSavings.toLocaleString()} / year saved{' '}
            <span style={{ fontSize: '0.8125rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 400, color: 'var(--text-secondary)' }}>
              (+{latencySavedMs}ms faster per request)
            </span>
          </div>
        </div>

        <Link
          href="/pricing"
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: 'var(--neon-cyan)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.75rem',
            fontFamily: 'JetBrains Mono, monospace',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.35)',
          }}
        >
          <Zap size={14} />
          View All Enterprise Plans <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

