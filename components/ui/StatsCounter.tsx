'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

const STATS: StatItem[] = [
  { value: 99.9, suffix: '%', label: 'Detection Rate',    decimals: 1 },
  { value: 11,   suffix: 'ms', label: 'Avg Latency',     decimals: 0 },
  { value: 62.8, suffix: '%', label: 'Cost Savings',      decimals: 1 },
  { value: 1500, suffix: '+', label: 'Attack Patterns',   decimals: 0 },
];

function AnimatedNumber({ value, suffix = '', prefix = '', decimals = 0, duration = 2000 }: {
  value: number; suffix?: string; prefix?: string; decimals?: number; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref       = useRef<HTMLSpanElement>(null);
  const inView    = useInView(ref, { once: true, margin: '-50px' });
  const startRef  = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    startRef.current = null;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((eased * value).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, value, decimals, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <div
      ref={containerRef}
      style={{
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scan line animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)',
          animation: 'scan-line 4s linear infinite',
        }}
      />

      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="stat-value">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                decimals={stat.decimals}
                duration={2200}
              />
            </div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Dividers between stats */}
      <style jsx>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
