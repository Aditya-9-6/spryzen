'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, TrendingUp, Zap, AlertTriangle, CheckCircle,
  Server, Activity, ArrowUpRight, BarChart2, Globe,
  Clock, ChevronRight,
} from 'lucide-react';

interface Stats {
  requests: number;
  blocks: number;
  health: number;
  threat_level: number;
  uptime: number;
  xp: number;
  level: number;
  rank: string;
}

const TIER_FEATURES: Record<string, string[]> = {
  starter:    ['Prompt Injection Defense', 'OWASP Top 10', 'L0 XDP eBPF DDoS Guard', 'Security Dashboard'],
  growth:     ['14B Cognitive LLM Gate', 'Multimodal Scanner', 'Ouroboros Hot-Patching', 'Priority Slack'],
  pro:        ['Cross-Customer Threat Intel', 'Business Logic Anomaly', 'Automated Compliance Audits', 'SIEM Export'],
  enterprise: ['Dedicated 110-Node Mesh', 'Air-Gapped Sovereign Option', 'AMD SEV-SNP Enclave', '24/7 SOC Engineer'],
};

export default function DashboardPage() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [plan, setPlan]       = useState('sentinel');
  const [usage, setUsage]     = useState({ used: 1234567, limit: 5000000 });
  const [loading, setLoading] = useState(true);

  const [recentAlerts] = useState([
    { id: 1, type: 'blocked', msg: 'SQL injection blocked from 203.0.113.42', time: '2m ago', severity: 'high' },
    { id: 2, type: 'blocked', msg: 'XSS attempt blocked from 185.220.101.8', time: '8m ago', severity: 'medium' },
    { id: 3, type: 'info',    msg: 'Tartarus: New attacker banished to Mirror Dimension', time: '15m ago', severity: 'info' },
    { id: 4, type: 'info',    msg: 'Monthly report is ready for download', time: '1h ago', severity: 'info' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/portal/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // Demo fallback
          setStats({ requests: 1247893, blocks: 14203, health: 98, threat_level: 3, uptime: 99.97, xp: 2850, level: 3, rank: 'Autonomous SOC' });
        }
      } catch {
        setStats({ requests: 1247893, blocks: 14203, health: 98, threat_level: 3, uptime: 99.97, xp: 2850, level: 3, rank: 'Autonomous SOC' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const usagePct = Math.min((usage.used / usage.limit) * 100, 100);
  const sevColor = (s: string) => s === 'high' ? 'var(--neon-crimson)' : s === 'medium' ? 'var(--neon-orange)' : 'var(--neon-cyan)';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <div style={{ width: 20, height: 20, border: '2px solid var(--glass-border)', borderTopColor: 'var(--neon-cyan)', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite' }} />
        Loading your fortress...
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>
          Sovereign Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your Spryzen+ fortress status at a glance
        </p>
      </div>

      {/* ─── Top KPI Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Shield,    label: 'Threats Blocked', value: stats!.blocks.toLocaleString(),        color: 'var(--neon-cyan)',    sub: 'This month' },
          { icon: Activity,  label: 'Total Requests',  value: stats!.requests.toLocaleString(),       color: '#a855f7',            sub: 'Processed' },
          { icon: TrendingUp,label: 'Uptime',          value: `${stats!.uptime}%`,                   color: 'var(--neon-emerald)', sub: '30-day average' },
          { icon: AlertTriangle, label: 'Threat Level',value: `Level ${stats!.threat_level}`,         color: stats!.threat_level > 6 ? 'var(--neon-crimson)' : 'var(--neon-gold)', sub: stats!.threat_level > 6 ? 'HIGH ALERT' : 'Normal' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="glass-card"
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                background: `${kpi.color}15`,
                border: `1px solid ${kpi.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
            </div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', color: kpi.color, marginBottom: '0.25rem' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ─── Second Row ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

        {/* Usage Meter */}
        <motion.div
          className="glass-card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Request Usage</div>
            <span className={`badge ${usagePct > 80 ? 'badge-crimson' : 'badge-emerald'}`} style={{ fontSize: '0.65rem' }}>
              {usagePct > 80 ? 'Near Limit' : 'Healthy'}
            </span>
          </div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.375rem' }}>
            {(usage.used / 1_000_000).toFixed(2)}M
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              {' '}/{(usage.limit / 1_000_000).toFixed(0)}M
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
            <motion.div
              className={`progress-fill ${usagePct > 80 ? 'warning' : ''}`}
              initial={{ width: 0 }}
              animate={{ width: `${usagePct}%` }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {(100 - usagePct).toFixed(1)}% remaining · Resets Jun 1
          </div>
          {usagePct > 80 && (
            <Link href="/portal/billing" className="btn btn-sm btn-secondary mt-3" style={{ fontSize: '0.8rem' }}>
              Upgrade Plan <ArrowUpRight size={12} />
            </Link>
          )}
        </motion.div>

        {/* Sovereignty Level */}
        <motion.div
          className="glass-card"
          style={{ padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet))',
          }} />
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Sovereignty Level
          </div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '3.5rem', color: 'var(--neon-cyan)', lineHeight: 1 }}>
            {stats!.level}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--neon-violet)', fontWeight: 600, marginTop: '0.5rem' }}>
            {stats!.rank}
          </div>

          {/* XP bar */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
              {stats!.xp.toLocaleString()} XP · Next level: 5,000 XP
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(stats!.xp / 5000) * 100}%` }}
                transition={{ duration: 1.4, delay: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Health Score */}
        <motion.div
          className="glass-card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Security Health
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '3rem', color: 'var(--neon-emerald)', lineHeight: 1 }}>
              {stats!.health}
            </span>
            <span style={{ color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>/100</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={14} style={{ color: 'var(--neon-emerald)' }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--neon-emerald)', fontWeight: 600 }}>
              Grade A — Excellent
            </span>
          </div>
          {['WAF Active', 'Tartarus Online', 'Medusa Active'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon-emerald)', boxShadow: '0 0 6px var(--neon-emerald)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
          <Link href="/portal/war-room" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', color: 'var(--neon-cyan)', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>
            View War Room <ChevronRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* ─── Third Row: Alerts + Plan ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>

        {/* Recent Activity */}
        <motion.div
          className="glass-card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>Recent Activity</h3>
            <Link href="/portal/war-room" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentAlerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: sevColor(alert.severity),
                  boxShadow: `0 0 8px ${sevColor(alert.severity)}`,
                  marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{alert.msg}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          className="glass-card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.63 }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Current Plan
          </div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', color: 'var(--neon-cyan)', marginBottom: '0.375rem' }}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Renews June 1, 2026 · $10.00/mo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {(TIER_FEATURES[plan] || []).map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={12} style={{ color: 'var(--neon-emerald)' }} />
                {f}
              </div>
            ))}
          </div>
          <Link href="/portal/billing" className="btn btn-sm btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Manage Billing
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
