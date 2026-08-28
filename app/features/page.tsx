'use client';

import { motion } from 'framer-motion';
import {
  Shield, Brain, Lock, Globe2, Terminal, Zap,
  Server, Cpu, Eye, Code, Activity, Layers, Play
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ENGINES = [
  {
    id: 'waf',
    title: 'WAF Core',
    icon: Shield,
    color: 'var(--neon-cyan)',
    tagline: 'Self-Evolving HTTP/S Layer Protection',
    desc: 'WAF Core uses our custom pattern compiler to scan request bodies, headers, and query parameters in sub-milliseconds. It detects SQL Injection, XSS, Path Traversal, and complex nested JSON/GraphQL denial of service payloads.',
    features: ['1,500+ Compiled Rulesets', 'Sub-millisecond latency', 'Regex-less semantic analysis', 'Zero heap-allocation filter loops'],
    code: `// Sovereign WAF Core Engine - Wasm Hot-Patch
fn filter_request(req: &Request) -> Result<Action, Error> {
    let score = match ml_anomaly_score(req) {
        s if s > 0.95 => return Ok(Action::Banish),
        s if s > 0.70 => Action::Triage,
        _ => Action::Pass
    };
    Ok(score)
}`
  },
  {
    id: 'tartarus',
    title: 'Tartarus Engine',
    icon: Terminal,
    color: 'var(--neon-crimson)',
    tagline: 'Honeypot Deception & Mirror Dimension',
    desc: 'Persistent malicious actors are silently routed into Tartarus — an isolated, infinite honeypot simulating real system vulnerabilities. This consumes their computational resources and rate-limits them to zero bandwidth while tracing their origins.',
    features: ['Infinite Virtual Filesystems', 'Delay injection (0 to 180s)', 'Signature harvesting agents', 'Real-time proxy sandbox redirection'],
    code: `// Tartarus Deception Redirection Trap
pub async fn banish_to_mirror_dimension(session: &mut Session) {
    session.set_delay_ms(45_000); // Infinitely drag connections
    session.feed_fake_database_responses().await;
    session.log_defcon_level(1).await;
}`
  },
  {
    id: 'medusa',
    title: 'Medusa Rate Limiter',
    icon: Brain,
    color: '#a855f7',
    tagline: 'Behavioral & Volumetric DDoS Barrier',
    desc: 'Medusa protects your origin servers from application-layer DDoS, credential stuffing, and scraping. It monitors token velocity per client fingerprint and dynamically throttles requests at the TCP/eBPF level.',
    features: ['TCP fingerprints profiling', 'Zero-overhead sliding-window counts', 'Redis-backed global session limits', 'Autonomous IP greylisting'],
    code: `// Medusa sliding window token bucket
impl RateLimiter for Medusa {
    fn allow_request(&self, client_ip: IpAddr) -> bool {
        let now = SystemTime::now();
        let bucket = self.redis.get_bucket(client_ip);
        bucket.count < self.max_requests_per_min
    }
}`
  },
  {
    id: 'aegis',
    title: 'Aegis Prime',
    icon: Lock,
    color: 'var(--neon-emerald)',
    tagline: 'eBPF / XDP Kernel-level Packet Shield',
    desc: 'For ultimate performance, Aegis Prime filters malicious IPs, protocol-violating packets, and UDP amplification attacks directly in the Linux kernel network card driver before the OS even allocates memory.',
    features: ['Kernel-level drop instructions', 'eBPF program hot-swap', 'Deflects 10M+ packets per second', 'Zero CPU overhead in user space'],
    code: `// Aegis Prime Kernel eBPF/XDP Hook
SEC("xdp")
int xdp_filter_packets(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    if (is_blacklisted(data)) {
        return XDP_DROP; // Deny instantly
    }
    return XDP_PASS;
}`
  },
  {
    id: 'ghost',
    title: 'Ghost Engine',
    icon: Cpu,
    color: 'var(--neon-gold)',
    tagline: 'Wasm-Native Security Plugins',
    desc: 'Ghost runs custom WebAssembly filters inside the Spryzen proxy pipeline, allowing you to write your own proprietary request body validation, authorization, or response manipulation logic in Rust, Go, or C.',
    features: ['Near-native speed executions', 'Safe isolation memory sandbox', 'Hot-loadable without proxy reload', 'Custom request/response headers hooks'],
    code: `// Ghost Wasm Custom Auth Filter
#[no_mangle]
pub extern "C" fn on_request_headers() -> i32 {
    let token = get_header("X-Sovereign-Token");
    if token.is_empty() { 401 } else { 200 }
}`
  },
  {
    id: 'ouroboros',
    title: 'Ouroboros Engine',
    icon: Zap,
    color: 'var(--neon-orange)',
    tagline: 'AI Shadow Red-Teaming & Evolution',
    desc: 'Ouroboros runs a continuous adversarial simulation cycle. Our Phi-3 model plays the "attacker" against a shadow proxy deployment, automatically compiles Wasm hot-patches for any discovered gaps, and deploys them to production.',
    features: ['Autonomous 0-day patch generation', 'LLM threat vector synthesis', 'Continuous shadow regression tests', 'Self-evolving rule-tree synthesis'],
    code: `// Ouroboros Self-Evolving Rule Generation
async fn generate_hotpatch(attack_vector: &str) -> String {
    let prompt = format!("Generate a Wasm rule for Spryzen WAF to block: {}", attack_vector);
    let patch = phi3.generate(&prompt).await;
    compile_wasm_and_verify(patch).await
}`
  }
];

export default function FeaturesPage() {
  const [selectedEngine, setSelectedEngine] = useState(ENGINES[0]);
  const [showCode, setShowCode] = useState(true);

  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* ─── HEADER ─── */}
      <section className="section" style={{ paddingBottom: '2rem', textAlign: 'center', position: 'relative' }}>
        <div className="glow-orb glow-orb-cyan" style={{ width: 600, height: 600, top: -200, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <span className="section-eyebrow">Indestructible Core</span>
          <h1 className="text-h1" style={{ marginBottom: '1.25rem' }}>
            The Spryzen+ <span className="text-gradient-cyan">Security Suite</span>
          </h1>
          <p className="text-lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Explore the six custom engines working in total consensus to protect your digital assets with mathematical precision.
          </p>
        </div>
      </section>

      {/* ─── CORE PIPELINE VISUALIZATION ─── */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '1100px', margin: '0 auto', overflow: 'hidden' }}>
          <h2 className="text-h3" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Request Pipeline Flow
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
            {/* Background line connecting pipeline nodes */}
            <div style={{
              position: 'absolute', top: '24px', left: '5%', right: '5%', height: '2px',
              background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet), var(--neon-emerald), var(--neon-gold))',
              zIndex: 1, opacity: 0.3
            }} />

            {[
              { num: '01', title: 'Aegis Prime', desc: 'Kernel Filter', color: 'var(--neon-emerald)' },
              { num: '02', title: 'Medusa', desc: 'Behavior DDoS', color: '#a855f7' },
              { num: '03', title: 'WAF Core', desc: 'L7 Payload Scan', color: 'var(--neon-cyan)' },
              { num: '04', title: 'Ghost Wasm', desc: 'Custom Filters', color: 'var(--neon-gold)' },
              { num: '05', title: 'Tartarus', desc: 'Mirror Trap', color: 'var(--neon-crimson)' },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  zIndex: 2, flex: 1, minWidth: '150px'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  border: `2px solid ${step.color}`,
                  boxShadow: `0 0 15px ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Outfit', fontWeight: 900, color: step.color,
                  fontSize: '1rem', marginBottom: '0.75rem'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.25rem 0' }}>{step.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ENGINE EXPLORER ─── */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Left panel: Engine list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="text-label" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Select an Engine
            </div>

            {ENGINES.map((engine) => {
              const Icon = engine.icon;
              const isSelected = selectedEngine.id === engine.id;

              return (
                <button
                  key={engine.id}
                  onClick={() => setSelectedEngine(engine)}
                  className={`glass-card`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1.25rem', width: '100%', textAlign: 'left',
                    background: isSelected ? `${engine.color}10` : 'var(--bg-card)',
                    borderColor: isSelected ? engine.color : 'var(--glass-border)',
                    boxShadow: isSelected ? `0 0 20px ${engine.color}25` : 'none',
                    cursor: 'pointer', transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                    background: `${engine.color}15`,
                    border: `1px solid ${engine.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: engine.color, flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: isSelected ? engine.color : 'var(--text-primary)' }}>
                      {engine.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {engine.tagline.split(' ')[0]} Engine
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right panel: Deep dive & code snippet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div
              key={selectedEngine.id}
              className="glass-card"
              style={{ padding: '2.5rem', flex: 1, position: 'relative' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: selectedEngine.color,
                boxShadow: `0 0 15px ${selectedEngine.color}`
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 'var(--radius-sm)',
                  background: `${selectedEngine.color}15`,
                  border: `1px solid ${selectedEngine.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selectedEngine.color
                }}>
                  <selectedEngine.icon size={26} />
                </div>
                <div>
                  <span style={{ color: selectedEngine.color, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {selectedEngine.tagline}
                  </span>
                  <h2 className="text-h2" style={{ fontSize: '1.8rem', margin: 0 }}>
                    {selectedEngine.title}
                  </h2>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {selectedEngine.desc}
              </p>

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Key Capabilities
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                {selectedEngine.features.map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedEngine.color, boxShadow: `0 0 8px ${selectedEngine.color}` }} />
                    {feat}
                  </div>
                ))}
              </div>

              {/* Code Sandbox Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  // Engine Implementation Sandbox
                </span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowCode(!showCode)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                >
                  <Code size={14} />
                  {showCode ? 'Hide Code' : 'View Code'}
                </button>
              </div>

              {showCode && (
                <motion.div
                  className="terminal"
                  style={{ marginTop: '1rem', background: '#030305' }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="terminal-header" style={{ marginBottom: '0.75rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                      {selectedEngine.id}.rs
                    </span>
                  </div>
                  <pre style={{ margin: 0, overflowX: 'auto' }}>
                    <code style={{ fontSize: '0.75rem', color: '#c9d1d9' }}>{selectedEngine.code}</code>
                  </pre>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION ─── */}
      <section className="section" style={{ textAlign: 'center', position: 'relative', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-surface)' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
            Empower Your Applications Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 2rem' }}>
            Start with the free Scout plan or talk to our experts for tailor-made enterprise deployment models.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Talk to Security Architect
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
