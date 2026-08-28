'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Check, Zap, Eye, EyeOff, Building, Globe, Server } from 'lucide-react';
import OTPInput from '@/components/ui/OTPInput';

// ─── Plans ────────────────────────────────────────────────────────────────
const PLANS = [
  { id: 'scout',    name: 'Scout',    price: 0,    priceUSD: 0,    color: '#64748b', desc: 'Free Forever' },
  { id: 'sentinel', name: 'Sentinel', price: 10,   priceUSD: 10,   color: '#00d4ff', desc: '$10/mo + Tax', popular: true },
  { id: 'fortress', name: 'Fortress', price: 100,  priceUSD: 100,  color: '#7c3aed', desc: '$100/mo + Tax' },
  { id: 'ironclad', name: 'IronClad', price: -1,   priceUSD: -1,   color: '#d4af37', desc: 'Custom Pricing' },
];

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan  = searchParams.get('plan') || 'sentinel';

  const [step, setStep]         = useState<Step>(1);
  const [loading, setLoading]   = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name:    '',
    email:   '',
    password: '',
    company: '',
    plan:    defaultPlan,
  });

  const [routing, setRouting] = useState({
    domain:      '',
    originIp:    '',
    originPort:  '443',
    protocol:    'https',
    monthlyReqs: '1M-5M',
  });

  // ─── Step 1: Submit basic info ─────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep(2);
    } catch (err: unknown) {
      alert((err as Error).message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ────────────────────────────────────────────────
  const handleOTP = async (otp: string) => {
    setLoading(true);
    setOtpError(null);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStep(3);
    } catch (err: unknown) {
      setOtpError((err as Error).message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });
  };

  // ─── Step 3: Save routing config ──────────────────────────────────────
  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/portal/routing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routing),
      });
      router.push('/portal/dashboard?welcome=1');
    } catch {
      router.push('/portal/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem var(--section-px)',
        position: 'relative',
      }}
    >
      {/* Background orbs */}
      <div className="glow-orb glow-orb-cyan" style={{ width: 500, height: 500, top: -100, right: -100 }} />
      <div className="glow-orb glow-orb-violet" style={{ width: 400, height: 400, bottom: -100, left: -100 }} />

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield size={32} style={{ color: 'var(--neon-cyan)' }} strokeWidth={1.5} />
          <span
            style={{
              fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem',
              background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            SPRYZEN+
          </span>
        </div>

        {/* Step indicator */}
        <div className="step-indicator mb-8">
          {(['Account', 'Verify', 'Setup'] as const).map((label, i) => {
            const stepNum = (i + 1) as Step;
            const isDone   = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={label} className="flex items-center" style={{ flex: i < 2 ? 1 : 0 }}>
                <div className={`step-dot ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}>
                  {isDone ? <Check size={16} /> : stepNum}
                </div>
                {i < 2 && (
                  <div className={`step-line ${isDone ? 'completed' : ''}`} style={{ flex: 1 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <AnimatePresence mode="wait">

            {/* ─── STEP 1: Account Info ──────────────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.375rem' }}>
                  Create Your Account
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
                  Start your free Scout trial — no credit card required.
                </p>

                <form onSubmit={handleStep1}>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Full Name</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Rajesh Kumar"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="label">Work Email</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="rajesh@company.com"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="label">Company Name</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Acme Corp"
                          style={{ paddingLeft: '2.75rem' }}
                          value={form.company}
                          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        />
                        <Building size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label className="label">Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPass ? 'text' : 'password'}
                          className="input"
                          placeholder="Min 8 characters"
                          required
                          minLength={8}
                          style={{ paddingRight: '3rem' }}
                          value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(s => !s)}
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

                    {/* Plan Selector */}
                    <div>
                      <label className="label">Select Plan</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {PLANS.map(plan => (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
                            style={{
                              padding: '0.875rem',
                              border: `1px solid ${form.plan === plan.id ? plan.color : 'var(--glass-border)'}`,
                              borderRadius: 'var(--radius-sm)',
                              background: form.plan === plan.id ? `${plan.color}10` : 'var(--bg-surface)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s',
                              position: 'relative',
                            }}
                          >
                            {plan.popular && (
                              <span
                                style={{
                                  position: 'absolute', top: '-8px', right: '8px',
                                  background: plan.color, color: '#000',
                                  fontSize: '0.6rem', fontWeight: 700,
                                  borderRadius: '10px', padding: '1px 6px',
                                  letterSpacing: '0.08em',
                                }}
                              >
                                POPULAR
                              </span>
                            )}
                            <div style={{ color: plan.color, fontWeight: 700, fontSize: '0.875rem', fontFamily: 'Outfit' }}>
                              {plan.name}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                              {plan.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full justify-center mt-6"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {loading ? 'Creating account...' : (
                      <><Zap size={16} /> Continue to Verification</>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>Log In</Link>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ─── STEP 2: OTP Verification ─────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <OTPInput
                  onComplete={handleOTP}
                  error={otpError}
                  loading={loading}
                  onResend={handleResendOTP}
                />
              </motion.div>
            )}

            {/* ─── STEP 3: Traffic Routing Config ──────────────────────────── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--neon-emerald-dim)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Check size={20} style={{ color: 'var(--neon-emerald)' }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem' }}>Email Verified!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Now let&apos;s configure your traffic routing</p>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--neon-cyan-dim)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    marginTop: '1.25rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: 'var(--neon-cyan)' }}>Required for traffic routing:</strong> Spryzen+ needs your
                  origin server details to act as a reverse proxy between the internet and your app.
                </div>

                <form onSubmit={handleStep3}>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Your Domain / URL to Protect</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="https://myapp.com"
                          required
                          style={{ paddingLeft: '2.75rem' }}
                          value={routing.domain}
                          onChange={e => setRouting(r => ({ ...r, domain: e.target.value }))}
                        />
                        <Globe size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                      <div>
                        <label className="label">Origin Server IP / Hostname</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="input"
                            placeholder="203.0.113.10 or backend.myapp.com"
                            required
                            style={{ paddingLeft: '2.75rem' }}
                            value={routing.originIp}
                            onChange={e => setRouting(r => ({ ...r, originIp: e.target.value }))}
                          />
                          <Server size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                      </div>
                      <div>
                        <label className="label">Port</label>
                        <input
                          type="number"
                          className="input"
                          style={{ width: '100px' }}
                          value={routing.originPort}
                          onChange={e => setRouting(r => ({ ...r, originPort: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Protocol</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {(['https', 'http'] as const).map(proto => (
                          <button
                            key={proto}
                            type="button"
                            onClick={() => setRouting(r => ({ ...r, protocol: proto }))}
                            style={{
                              padding: '0.75rem',
                              border: `1px solid ${routing.protocol === proto ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
                              borderRadius: 'var(--radius-sm)',
                              background: routing.protocol === proto ? 'var(--neon-cyan-dim)' : 'var(--bg-surface)',
                              color: routing.protocol === proto ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                            }}
                          >
                            {proto.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label">Expected Monthly Requests</label>
                      <select
                        className="input"
                        value={routing.monthlyReqs}
                        onChange={e => setRouting(r => ({ ...r, monthlyReqs: e.target.value }))}
                      >
                        {['<100K', '100K-1M', '1M-5M', '5M-50M', '50M-500M', '500M+'].map(v => (
                          <option key={v} value={v}>{v} requests/month</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-6"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {loading ? 'Setting up...' : (
                      <>Complete Setup <ArrowRight size={16} /></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/portal/dashboard')}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-muted)',
                      fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.75rem',
                      display: 'block', width: '100%', textAlign: 'center',
                    }}
                  >
                    Skip for now — I&apos;ll configure later
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terms */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          By signing up, you agree to our{' '}
          <Link href="#" style={{ color: 'var(--neon-cyan)' }}>Terms of Service</Link> and{' '}
          <Link href="#" style={{ color: 'var(--neon-cyan)' }}>Privacy Policy</Link>.
          GST applies for Indian businesses.
        </p>
      </div>
    </div>
  );
}
