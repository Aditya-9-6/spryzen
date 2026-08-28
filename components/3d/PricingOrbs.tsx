'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    period: 'Free Forever',
    color: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.4)',
    features: ['10K requests/mo', '0.5B fast gate only', 'REST API', 'JSON verdict output', 'Discord community'],
    missing: ['7B supreme court', 'Dashboard', 'Webhooks', 'Ouroboros evolution'],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceUSD: 35,
    period: '/month',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    features: ['100K req/mo', 'L0 eBPF/XDP + L1 SIMD', '0.5B + Semantic Index', 'Python SDK', 'Basic dashboard'],
    missing: ['7B model', 'Ouroboros evolution', 'SLA guarantee'],
  },
  {
    id: 'growth',
    name: 'Growth',
    priceUSD: 120,
    period: '/month',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.6)',
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
    glowColor: 'rgba(74, 222, 128, 0.5)',
    features: ['5M req/mo', 'Global Ouroboros feed', 'Cross-customer threat intel', 'gRPC + Protobuf', 'SIEM export', 'Datadog/Grafana', '99.9% SLA · 4hr'],
    missing: ['80B supreme model', 'On-premise deployment'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceUSD: 999,
    period: 'Custom Contract',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    features: ['Unlimited req/mo', 'Custom fine-tuned 80B model', 'Air-gapped on-prem deploy', 'Quantum PQC keys', 'Dedicated Security Architect', '99.999% SLA · 15min'],
    missing: [],
  },
];

export default function PricingOrbs() {
  const [selected, setSelected] = useState<string>('growth');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedPlan = PLANS.find(p => p.id === selected) || PLANS[2];
  const isEnterprise = selectedPlan.id === 'enterprise';

  // Canvas particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 140;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cy = canvas.height / 2;

      // Draw subtle wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < canvas.width; x += 10) {
        const y = cy + Math.sin(x * 0.015 + t) * 16 + Math.cos(x * 0.03 - t * 0.5) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Interactive Orbs Selector */}
      <div className="relative p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-[var(--neon-cyan)] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              Interactive Tier Selector
            </span>
            <h4 className="text-lg font-black font-outfit uppercase text-[var(--text-primary)]">
              Select an Operational Tier
            </h4>
          </div>

          {/* Interactive Tier Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
            {PLANS.map(plan => {
              const isSelected = plan.id === selected;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  className={`group relative flex flex-col items-center transition-all duration-300 transform ${
                    isSelected ? 'scale-110' : 'hover:scale-105 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Floating Orb */}
                  <div
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-lg"
                    style={{
                      backgroundColor: `${plan.color}20`,
                      border: `2px solid ${isSelected ? plan.color : `${plan.color}50`}`,
                      boxShadow: isSelected ? `0 0 25px ${plan.glowColor}` : 'none',
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full blur-[2px] transition-all"
                      style={{ backgroundColor: plan.color, opacity: isSelected ? 0.9 : 0.4 }}
                    />
                    {plan.recommended && (
                      <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-[var(--neon-cyan)] text-black uppercase shadow-md">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <span
                    className="mt-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                    style={{ color: isSelected ? plan.color : 'var(--text-secondary)' }}
                  >
                    {plan.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Plan Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlan.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-8 rounded-2xl border bg-[var(--bg-card)] shadow-2xl backdrop-blur-xl space-y-6"
          style={{
            borderColor: `${selectedPlan.color}40`,
            boxShadow: `0 0 35px ${selectedPlan.glowColor}`,
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded uppercase"
                  style={{
                    backgroundColor: `${selectedPlan.color}20`,
                    color: selectedPlan.color,
                  }}
                >
                  {selectedPlan.name} Plan
                </span>
                {selectedPlan.recommended && (
                  <span className="text-xs font-mono text-[var(--neon-cyan)] font-bold">
                    ⭐ Most Popular for Teams
                  </span>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-black font-outfit text-[var(--text-primary)] mt-2">
                {isEnterprise ? (
                  <span style={{ color: selectedPlan.color }}>Custom Enterprise</span>
                ) : (
                  <>
                    <span style={{ color: selectedPlan.color }}>${selectedPlan.priceUSD}</span>
                    <span className="text-sm font-mono text-[var(--text-muted)] font-normal">
                      {' '}{selectedPlan.period}
                    </span>
                  </>
                )}
              </div>
            </div>

            <Link
              href={isEnterprise ? '/contact' : `/auth/signup?plan=${selectedPlan.id}`}
              className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg text-black hover:brightness-110"
              style={{ backgroundColor: selectedPlan.color }}
            >
              <Zap size={14} />
              {selectedPlan.priceUSD === 0 ? 'Start Free Forever' : isEnterprise ? 'Talk to Enterprise Sales' : 'Start 14-Day Free Trial'}
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Included */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--neon-emerald)] font-bold block">
                Included Capabilities
              </span>
              <div className="space-y-2">
                {selectedPlan.features.map(f => (
                  <div key={f} className="flex items-start gap-2 font-mono text-xs text-[var(--text-primary)]">
                    <Check size={14} className="text-[var(--neon-emerald)] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Included */}
            {selectedPlan.missing.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold block">
                  Excluded
                </span>
                <div className="space-y-2">
                  {selectedPlan.missing.map(m => (
                    <div key={m} className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)] opacity-60">
                      <X size={14} className="flex-shrink-0 mt-0.5" />
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
