'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/portal/dashboard');
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem var(--section-px)', position: 'relative',
    }}>
      <div className="glow-orb glow-orb-cyan" style={{ width: 500, height: 500, top: -100, right: -100 }} />
      <div className="glow-orb glow-orb-violet" style={{ width: 400, height: 400, bottom: -100, left: -100 }} />

      <motion.div
        style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield size={32} style={{ color: 'var(--neon-cyan)' }} strokeWidth={1.5} />
          <span style={{
            fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem',
            background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SPRYZEN+</span>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.375rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Sign in to your Spryzen+ account
          </p>

          {error && (
            <div style={{
              background: 'var(--neon-crimson-dim)', border: '1px solid rgba(255,23,68,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
              color: 'var(--neon-crimson)', fontSize: '0.875rem', marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email" className="input" placeholder="you@company.com"
                  required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label" style={{ margin: 0 }}>Password</label>
                  <Link href="/auth/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--neon-cyan)' }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input" placeholder="Your password"
                    required style={{ paddingRight: '3rem' }}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button" onClick={() => setShowPass(s => !s)}
                    style={{
                      position: 'absolute', right: '0.875rem', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" className="btn btn-primary mt-6"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Signing in...' : <><Zap size={16} /> Sign In to Portal</>}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>Start free trial</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
