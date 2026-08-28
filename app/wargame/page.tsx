'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Cpu, Activity, Award, UserCheck, Flame, Skull, RefreshCw } from 'lucide-react';

const AttackDome = dynamic(() => import('@/components/3d/AttackDome'), { ssr: false });

interface ThreatLog {
  id: string;
  time: string;
  ip: string;
  country: string;
  type: string;
  uri: string;
  score: string;
  action: string;
}

const COUNTRIES = ['IN', 'US', 'RU', 'CN', 'BR', 'DE', 'UA', 'KP', 'SG', 'NL'];
const ATTACK_TYPES = [
  'SQL Injection (UNION SELECT)',
  'XSS Payload Script Injection',
  'GraphQL Nested Bomb (Depth 14)',
  'DDoS SYN Flood Volumetric Attack',
  'Remote Code Execution (RCE) Exploit',
  'Path Traversal Attempt (../etc/passwd)',
  'Automated Credential Stuffing Bot',
  'Malicious User-Agent Fingerprint Match'
];
const URIS = [
  '/api/v1/auth/login',
  '/wp-admin/admin-ajax.php',
  '/graphql',
  '/api/v2/payment/checkout',
  '/admin/config/.env',
  '/users/profile/update'
];

function generateRandomIP() {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

export default function WarGamePage() {
  const [stats, setStats] = useState({
    blocked: 124792,
    rate: 154,
    integrity: 100,
    banished: 843,
  });

  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [mirrorDimensionActive, setMirrorDimensionActive] = useState(false);
  const [targetIpToBanish, setTargetIpToBanish] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Stats tick animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const hits = Math.floor(Math.random() * 3) + 1;
        return {
          blocked: prev.blocked + hits,
          rate: Math.floor(130 + Math.random() * 50),
          integrity: 99.98 + Math.random() * 0.02,
          banished: prev.banished + (Math.random() > 0.85 ? 1 : 0),
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Initialize and append logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 8 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      time: new Date(Date.now() - (8 - i) * 3000).toLocaleTimeString(),
      ip: generateRandomIP(),
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
      uri: URIS[Math.floor(Math.random() * URIS.length)],
      score: (0.85 + Math.random() * 0.14).toFixed(2),
      action: Math.random() > 0.4 ? 'Blocked' : 'Banished to Tartarus',
    }));
    setLogs(initialLogs);
  }, []);

  // Live incoming attack logger
  useEffect(() => {
    const interval = setInterval(() => {
      const isTartarus = Math.random() > 0.6;
      const newLog: ThreatLog = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        ip: generateRandomIP(),
        country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
        type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
        uri: URIS[Math.floor(Math.random() * URIS.length)],
        score: (0.88 + Math.random() * 0.11).toFixed(2),
        action: isTartarus ? 'Banished to Tartarus' : 'Blocked',
      };
      setLogs(prev => [...prev.slice(1), newLog]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleBanishIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIpToBanish) return;
    
    // Add custom block log
    const newLog: ThreatLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      ip: targetIpToBanish,
      country: 'LOCAL',
      type: 'Admin Forced Session Quarantine Action',
      uri: '/*',
      score: '1.00',
      action: 'Banished to Tartarus',
    };
    
    setLogs(prev => [...prev.slice(1), newLog]);
    setStats(prev => ({ ...prev, banished: prev.banished + 1 }));
    setTargetIpToBanish('');
    setMirrorDimensionActive(true);

    // Auto-disable mirror mode after 10s
    setTimeout(() => {
      setMirrorDimensionActive(false);
    }, 10000);
  };

  return (
    <div style={{
      background: mirrorDimensionActive ? '#090000' : 'var(--bg-void)',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      
      {/* ─── TITLE SECTION ─── */}
      <section className="section" style={{ paddingBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <span className="section-eyebrow" style={{ color: mirrorDimensionActive ? 'var(--neon-crimson)' : 'var(--neon-cyan)' }}>
            {mirrorDimensionActive ? 'MIRROR DIMENSION SANDBOX ACTIVE' : 'Simulated Defensive Demonstration'}
          </span>
          <h1 className="text-h1" style={{ marginBottom: '1rem' }}>
            The Great <span className={mirrorDimensionActive ? 'text-gradient-crimson' : 'text-gradient-cyan'}>War Game</span>
          </h1>
          <p className="text-lead" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            A continuous real-time playback of volumetric penetration testing deflected by Spryzen+. Watch the shield neutralize attacks instantly.
          </p>
        </div>
      </section>

      {/* ─── INTERACTIVE WAR ROOM GRID ─── */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: '6rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Left Panel: 3D Dome and Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 3D Attack Dome Box */}
            <div className="glass-card" style={{
              height: '420px',
              position: 'relative',
              overflow: 'hidden',
              borderColor: mirrorDimensionActive ? 'rgba(255, 23, 68, 0.4)' : 'var(--glass-border)',
              boxShadow: mirrorDimensionActive ? '0 0 40px rgba(255, 23, 68, 0.25)' : 'var(--shadow-card)',
              background: mirrorDimensionActive ? '#050000' : 'var(--bg-card)',
              transition: 'all 0.5s'
            }}>
              {/* Tactical grid background overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(var(--glass-border) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                opacity: 0.2, pointerEvents: 'none', zIndex: 1
              }} />

              {/* Real-time feed of hits inside dome */}
              <div style={{
                position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 2,
                fontFamily: 'JetBrains Mono', fontSize: '0.75rem',
                color: mirrorDimensionActive ? 'var(--neon-crimson)' : 'var(--neon-cyan)',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: mirrorDimensionActive ? 'var(--neon-crimson)' : 'var(--neon-cyan)',
                  boxShadow: `0 0 10px ${mirrorDimensionActive ? 'var(--neon-crimson)' : 'var(--neon-cyan)'}`,
                  animation: 'blink 1s infinite'
                }} />
                TACTICAL SHELTER LIVE METRICS
              </div>

              {/* 3D Attack Dome Component */}
              <div style={{ width: '100%', height: '100%' }}>
                <AttackDome />
              </div>
            </div>

            {/* Tactical Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { icon: Shield, label: 'TOTAL DEFLECTED', value: stats.blocked.toLocaleString(), color: mirrorDimensionActive ? 'var(--neon-crimson)' : 'var(--neon-cyan)' },
                { icon: Activity, label: 'ATTACK RATE', value: `${stats.rate} req/s`, color: '#a855f7' },
                { icon: ShieldAlert, label: 'SHIELD HEALTH', value: `${stats.integrity.toFixed(2)}%`, color: 'var(--neon-emerald)' },
                { icon: Flame, label: 'BANISHED IPS', value: stats.banished, color: 'var(--neon-gold)' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="glass-card" style={{
                    padding: '1.25rem',
                    textAlign: 'center',
                    borderColor: mirrorDimensionActive ? 'rgba(255,23,68,0.2)' : 'var(--glass-border)'
                  }}>
                    <div style={{ display: 'inline-flex', padding: '0.375rem', borderRadius: 'var(--radius-sm)', background: `${stat.color}15`, border: `1px solid ${stat.color}30`, marginBottom: '0.5rem', color: stat.color }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', color: stat.color, marginBottom: '0.25rem' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Live Logs and Admin Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Terminal Intrusion Logs */}
            <div className="glass-card" style={{
              flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column',
              minHeight: '380px',
              borderColor: mirrorDimensionActive ? 'rgba(255,23,68,0.3)' : 'var(--glass-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                <span className="text-label" style={{ color: 'var(--text-secondary)' }}>Live Deflection Log</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  Consensus sync: OK
                </span>
              </div>

              {/* Scrolling Log Stream */}
              <div
                ref={logContainerRef}
                style={{
                  flex: 1, overflowY: 'auto',
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem',
                  lineHeight: '1.65', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  maxHeight: '300px', paddingRight: '0.5rem'
                }}
              >
                {logs.map((log) => {
                  const actionColor = log.action.includes('Banish') ? 'var(--neon-crimson)' : 'var(--neon-emerald)';
                  return (
                    <div key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '0.15rem' }}>
                        <span>[{log.time}] [{log.country}]</span>
                        <span style={{ color: 'var(--neon-gold)' }}>Score: {log.score}</span>
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {log.ip} → <span style={{ color: 'var(--neon-cyan)' }}>{log.uri}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{log.type}</span>
                        <span style={{ color: actionColor, fontWeight: 700 }}>{log.action.toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Admin Banishment Console */}
            <div className="glass-card" style={{
              padding: '1.5rem',
              borderColor: mirrorDimensionActive ? 'rgba(255,23,68,0.4)' : 'var(--glass-border)'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Skull size={14} style={{ color: 'var(--neon-crimson)' }} />
                Admin Force Sandbox Banishment
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.45 }}>
                Manually quarantine a suspicious IP address and route their session into the virtual Mirror Dimension. Watch the system construct telemetry cages.
              </p>

              <form onSubmit={handleBanishIP} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. 198.51.100.12"
                  value={targetIpToBanish}
                  onChange={(e) => setTargetIpToBanish(e.target.value)}
                  className="input"
                  style={{
                    padding: '0.5rem 0.75rem', fontSize: '0.8rem', flex: 1,
                    background: 'var(--bg-void)'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-sm btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Flame size={12} />
                  Banish IP
                </button>
              </form>

              <AnimatePresence>
                {mirrorDimensionActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--neon-crimson)', fontFamily: 'JetBrains Mono' }}
                  >
                    ⚡ Telemetry construct online. Banishment cage loaded. Capturing payload fingerprints...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
