'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AlertTriangle, Wifi, WifiOff, Terminal, Brain } from 'lucide-react';

const AttackDome = dynamic(() => import('@/components/3d/AttackDome'), { ssr: false });
const GlobeAttackMap = dynamic(() => import('@/components/3d/GlobeAttackMap'), { ssr: false });

interface ThreatEvent {
  id: string;
  timestamp: string;
  ip: string;
  uri: string;
  attack_type: string;
  score: number;
  blocked: boolean;
  narrative?: string;
  country?: string;
}

const typeColor = (t: string) => {
  if (t.includes('sql') || t.includes('SQL'))  return 'var(--neon-crimson)';
  if (t.includes('XSS') || t.includes('xss'))  return 'var(--neon-orange)';
  if (t.includes('Bot') || t.includes('bot'))  return 'var(--neon-gold)';
  if (t.includes('DDoS'))                       return '#a855f7';
  return 'var(--neon-cyan)';
};

export default function WarRoomPage() {
  const [events, setEvents]     = useState<ThreatEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [hitCount, setHitCount]   = useState(0);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [rps, setRps]             = useState(0);
  const logRef                    = useRef<HTMLDivElement>(null);
  const esRef                     = useRef<EventSource | null>(null);
  const rpsTimer                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const rpsBuffer                 = useRef(0);

  useEffect(() => {
    // Connect to SSE threat stream (proxied through our BFF)
    const es = new EventSource('/api/portal/war-room/stream');
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (e) => {
      try {
        const event: ThreatEvent = JSON.parse(e.data);
        setEvents(prev => [event, ...prev].slice(0, 120));
        if (event.blocked) {
          setTotalBlocked(c => c + 1);
          setHitCount(c => c + 1);
          rpsBuffer.current += 1;
        }

        // Auto-scroll terminal
        if (logRef.current) {
          logRef.current.scrollTop = 0;
        }
      } catch { /* skip malformed events */ }
    };

    // RPS counter
    rpsTimer.current = setInterval(() => {
      setRps(rpsBuffer.current);
      rpsBuffer.current = 0;
    }, 1000);

    return () => {
      es.close();
      if (rpsTimer.current) clearInterval(rpsTimer.current);
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>
            War Room
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live threat intelligence from your Spryzen+ proxy</p>
        </div>

        {/* Connection status */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
            background: connected ? 'var(--neon-emerald-dim)' : 'var(--neon-crimson-dim)',
            border: `1px solid ${connected ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}`,
            fontSize: '0.8125rem', fontWeight: 600,
            color: connected ? 'var(--neon-emerald)' : 'var(--neon-crimson)',
          }}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? 'LIVE' : 'Connecting...'}
        </div>
      </div>

      {/* ─── Top stats ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Attacks Blocked', value: totalBlocked.toLocaleString(), color: 'var(--neon-crimson)' },
          { label: 'Attacks/sec',     value: rps,                            color: 'var(--neon-orange)' },
          { label: 'Shield Hits',     value: hitCount.toLocaleString(),      color: 'var(--neon-cyan)' },
          { label: 'Live Events',     value: events.length,                  color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main layout ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* 3D Attack Dome */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', minHeight: 380 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-emerald)', boxShadow: '0 0 8px var(--neon-emerald)', animation: 'attack-pulse 2s infinite' }} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Live Shield Visualization</span>
          </div>
          <div style={{ height: 340 }}>
            <AttackDome onHitCallback={() => {}} />
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={16} style={{ color: 'var(--neon-cyan)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Threat Log</span>
            {connected && (
              <span className="animate-blink" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-emerald)', display: 'inline-block', marginLeft: 'auto' }} />
            )}
          </div>
          <div
            ref={logRef}
            style={{
              flex: 1, overflowY: 'auto', padding: '1rem',
              fontFamily: 'JetBrains Mono', fontSize: '0.75rem', lineHeight: 1.8,
              maxHeight: 320,
            }}
          >
            {events.length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '3rem' }}>
                {connected ? 'Waiting for threats...' : 'Connecting to live stream...'}
              </div>
            )}
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '0.25rem', display: 'flex', gap: '0.75rem' }}
              >
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
                <span style={{ color: typeColor(ev.attack_type) }}>[{ev.attack_type}]</span>
                <span style={{ color: 'var(--neon-cyan)', flexShrink: 0 }}>{ev.ip}</span>
                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.uri}
                </span>
                {ev.blocked && (
                  <span style={{ color: 'var(--neon-emerald)', flexShrink: 0 }}>✓ BLOCKED</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Globe Attack Map ─────────────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginTop: '1.25rem' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-crimson)', boxShadow: '0 0 8px var(--neon-crimson)', animation: 'attack-pulse 1.5s infinite' }} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Global Attack Origin Map</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time arc visualization</span>
        </div>
        <div style={{ height: 380 }}>
          <GlobeAttackMap
            attacks={events.map(ev => ({
              id: ev.id,
              sourceCountry: ev.country || 'CN',
              attackType: ev.attack_type,
              timestamp: new Date(ev.timestamp).getTime(),
            }))}
          />
        </div>
      </div>

      {/* ─── AI Narratives ────────────────────────────────────────────────── */}
      {events.filter(e => e.narrative).length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Brain size={18} style={{ color: '#a855f7' }} />
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>Sovereign AI Reports</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.filter(e => e.narrative).slice(0, 3).map(ev => (
              <div
                key={ev.id}
                style={{
                  padding: '0.875rem 1rem',
                  background: 'rgba(168,85,247,0.05)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  borderLeft: '3px solid #a855f7',
                }}
              >
                <span style={{ color: '#a855f7', fontWeight: 600 }}>[PHI-3]</span> {ev.narrative}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No events placeholder */}
      {!connected && events.length === 0 && (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '1.25rem' }}>
          <AlertTriangle size={40} style={{ color: 'var(--neon-gold)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '0.5rem' }}>Connecting to your proxy...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Make sure your Spryzen+ proxy is running and your API key is configured in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
