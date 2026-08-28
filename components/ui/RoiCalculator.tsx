'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, DollarSign, TrendingDown, ArrowRight, Check } from 'lucide-react';
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
    <div className="w-full max-w-5xl mx-auto p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] shadow-2xl backdrop-blur-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--neon-cyan)] uppercase tracking-wider">
            <Calculator size={16} />
            Enterprise Cost & Latency Benchmark
          </div>
          <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-[var(--text-primary)] mt-1">
            Calculate Your ROI with Spryzen
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Compare Spryzen's sovereign zero-trust engine against legacy proxy & WAF stacks
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--neon-emerald-dim)] border border-[var(--neon-emerald-glow)] text-[var(--neon-emerald)] font-mono text-sm font-bold">
          <TrendingDown size={18} />
          Save up to 75% Monthly
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center font-mono">
          <span className="text-sm text-[var(--text-secondary)]">Monthly AI / API Request Volume:</span>
          <span className="text-xl font-bold text-[var(--neon-cyan)]">
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
          className="w-full h-2.5 bg-[var(--bg-void)] rounded-lg appearance-none cursor-pointer accent-[var(--neon-cyan)] border border-[var(--glass-border)]"
        />

        <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>50K (Early Stage)</span>
          <span>1M (Scale Up)</span>
          <span>5M (Growth)</span>
          <span>10M+ (Enterprise)</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Spryzen Card */}
        <div className="p-5 rounded-xl bg-[var(--neon-cyan-dim)] border-2 border-[var(--neon-cyan)] relative space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[var(--neon-cyan)] text-black uppercase">
            Sovereign Engine
          </div>
          <div className="font-bold font-outfit text-lg text-[var(--text-primary)]">Spryzen+</div>
          <div className="text-3xl font-black font-outfit text-[var(--neon-cyan)]">
            ${spryzenCost.toLocaleString()}
            <span className="text-xs font-mono text-[var(--text-muted)] font-normal"> /mo</span>
          </div>
          <div className="text-xs font-mono text-[var(--text-secondary)] space-y-1.5 pt-2 border-t border-[var(--neon-cyan-glow)]">
            <div className="flex items-center gap-1 text-[var(--neon-emerald)]">
              <Check size={12} /> &lt;7ms avg overhead
            </div>
            <div className="flex items-center gap-1 text-[var(--neon-emerald)]">
              <Check size={12} /> On-prem sovereign
            </div>
            <div className="flex items-center gap-1 text-[var(--neon-emerald)]">
              <Check size={12} /> Zero token leakage
            </div>
          </div>
        </div>

        {/* Cloudflare WAF */}
        <div className="p-5 rounded-xl bg-[var(--bg-void)] border border-[var(--glass-border)] space-y-3">
          <div className="font-bold font-outfit text-base text-[var(--text-secondary)]">Cloudflare WAF</div>
          <div className="text-2xl font-bold font-outfit text-[var(--text-primary)]">
            ${cloudflareWafCost.toLocaleString()}
            <span className="text-xs font-mono text-[var(--text-muted)] font-normal"> /mo</span>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-2 border-t border-[var(--glass-border)]">
            <div>&bull; ~42ms proxy latency</div>
            <div>&bull; Cloud-hosted routing</div>
            <div>&bull; Basic pattern rules</div>
          </div>
        </div>

        {/* AWS WAF */}
        <div className="p-5 rounded-xl bg-[var(--bg-void)] border border-[var(--glass-border)] space-y-3">
          <div className="font-bold font-outfit text-base text-[var(--text-secondary)]">AWS WAF + Rules</div>
          <div className="text-2xl font-bold font-outfit text-[var(--text-primary)]">
            ${awsWafCost.toLocaleString()}
            <span className="text-xs font-mono text-[var(--text-muted)] font-normal"> /mo</span>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-2 border-t border-[var(--glass-border)]">
            <div>&bull; ~35ms AWS hop</div>
            <div>&bull; Per-rule metering fee</div>
            <div>&bull; No prompt semantics</div>
          </div>
        </div>

        {/* Lakera / SaaS Guardrail */}
        <div className="p-5 rounded-xl bg-[var(--bg-void)] border border-[var(--glass-border)] space-y-3">
          <div className="font-bold font-outfit text-base text-[var(--text-secondary)]">SaaS Guardrails</div>
          <div className="text-2xl font-bold font-outfit text-[var(--text-primary)]">
            ${lakeraCost.toLocaleString()}
            <span className="text-xs font-mono text-[var(--text-muted)] font-normal"> /mo</span>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] space-y-1 pt-2 border-t border-[var(--glass-border)]">
            <div>&bull; ~65ms cloud roundtrip</div>
            <div>&bull; Third-party data egress</div>
            <div>&bull; $0.85 per 1k requests</div>
          </div>
        </div>
      </div>

      {/* Savings Summary Banner */}
      <div className="p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Estimated Annual Savings with Spryzen
          </div>
          <div className="text-2xl md:text-3xl font-black font-outfit text-[var(--neon-emerald)]">
            ${annualSavings.toLocaleString()} / year saved{' '}
            <span className="text-sm font-mono font-normal text-[var(--text-secondary)]">
              (+{latencySavedMs}ms faster per request)
            </span>
          </div>
        </div>

        <Link
          href="/pricing"
          className="px-6 py-3 rounded-xl bg-[var(--neon-cyan)] text-black font-bold font-mono text-sm hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Zap size={16} />
          View All Enterprise Plans <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
