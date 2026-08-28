'use client';

import { motion } from 'framer-motion';
import { Shield, Building2, Lock, Zap, CheckCircle2, ArrowRight, Star, Globe, Database, Terminal } from 'lucide-react';
import Link from 'next/link';

const CASE_STUDIES = [
  {
    client: 'Nexus Global FinTech',
    industry: 'Banking & Payments',
    badge: 'Zero-PII Leakage',
    metrics: ['100% DPDP & GDPR Compliance', '<4.2ms PII Masking Overhead', '0 Data Breaches'],
    quote: 'Spryzen sanitized millions of banking prompt queries at kernel level before reaching OpenAI. We eliminated all third-party compliance risk without modifying our backend agent code.',
    author: 'Chief Information Security Officer',
    highlightColor: 'var(--neon-cyan)',
    tags: ['PII Redaction', 'Zero Data Egress', 'On-Premises'],
  },
  {
    client: 'OmniAI Autonomous Systems',
    industry: 'Multi-Agent Enterprise Robotics',
    badge: 'Tool-Call Sandbox',
    metrics: ['12,400+ Prompt Injections Neutralized', '99.999% SLA Uptime', 'Formal Z3 Verification'],
    quote: 'Our autonomous agents execute shell tools and SQL pipelines. Spryzen’s Layer 8 sandbox mathematically verified and blocked 42 zero-day prompt hijacking attempts in our first 90 days.',
    author: 'VP of AI Infrastructure',
    highlightColor: 'var(--neon-violet)',
    tags: ['Agent Security', 'Formal Verification', 'Shadow Red Teaming'],
  },
  {
    client: 'Apex Health Systems',
    industry: 'Healthcare Diagnostics',
    badge: 'HIPAA Certified',
    metrics: ['Sub-Millisecond eBPF Filter', 'Zero Cloud Hop', '200M+ Monthly Queries'],
    quote: 'Patient telemetry cannot touch commercial proxy servers. Spryzen runs 100% air-gapped in our Kubernetes cluster, shielding clinical diagnostic LLMs from jailbreak attempts.',
    author: 'Head of Clinical Cyber Defense',
    highlightColor: 'var(--neon-emerald)',
    tags: ['HIPAA / DPDP', 'Air-Gapped', 'Kubernetes Native'],
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[var(--neon-cyan-dim)] text-[var(--neon-cyan)] border border-[var(--neon-cyan-glow)] uppercase tracking-wider inline-flex items-center gap-1.5">
          <Building2 size={12} />
          Enterprise Customer Trust
        </span>
        <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-[var(--text-primary)]">
          Securing the World's Most Critical <span className="text-gradient-cyan">AI Workloads</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] font-mono">
          See how leading FinTech, Healthcare, and Autonomous AI platforms eliminate prompt injection, PII leakage, and zero-day threats with Spryzen.
        </p>
      </section>

      {/* Case Studies Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CASE_STUDIES.map((study, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] p-6 space-y-6 flex flex-col justify-between hover:border-[var(--neon-cyan)] transition-all shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold font-outfit text-xl text-[var(--text-primary)]">{study.client}</h3>
                  <p className="text-xs font-mono text-[var(--text-secondary)]">{study.industry}</p>
                </div>
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                  style={{
                    backgroundColor: `${study.highlightColor}15`,
                    borderColor: study.highlightColor,
                    color: study.highlightColor,
                  }}
                >
                  {study.badge}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-2 bg-[var(--bg-void)] p-3 rounded-xl border border-[var(--glass-border)] font-mono text-xs">
                {study.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-2 text-[var(--text-primary)]">
                    <CheckCircle2 size={13} className="text-[var(--neon-emerald)] flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xs text-[var(--text-secondary)] italic leading-relaxed border-l-2 border-[var(--glass-border)] pl-3">
                "{study.quote}"
              </blockquote>
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
              <div className="text-[11px] font-mono text-[var(--text-muted)]">{study.author}</div>
              <div className="flex gap-1.5">
                {study.tags.map((t, tIdx) => (
                  <span key={tIdx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--glass-surface)] text-[var(--text-secondary)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Enterprise SLA & Architecture Guarantee */}
      <section className="p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--neon-cyan)] uppercase">
            <Lock size={16} />
            Data Sovereignty Pledge
          </div>
          <h3 className="text-2xl font-black font-outfit text-[var(--text-primary)]">
            Your Prompt Data Never Leaves Your Environment
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
            Spryzen is native to on-premises VPCs, air-gapped clusters, and edge nodes. We never store, train, or mirror customer prompt tokens.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-[var(--neon-cyan)] text-black font-bold font-mono text-xs hover:brightness-110 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Shield size={14} />
            Request Enterprise POC
          </Link>
          <Link
            href="/docs"
            className="px-6 py-3 rounded-xl bg-[var(--bg-void)] border border-[var(--glass-border)] text-[var(--text-primary)] font-bold font-mono text-xs hover:bg-[var(--glass-surface)] transition flex items-center justify-center gap-2"
          >
            View Documentation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
