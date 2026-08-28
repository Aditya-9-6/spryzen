'use client';

import { useRef, useState, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string | null;
  loading?: boolean;
  onResend?: () => void;
  resendCooldown?: number; // seconds
}

export default function OTPInput({
  length = 6,
  onComplete,
  error,
  loading = false,
  onResend,
  resendCooldown = 60,
}: OTPInputProps) {
  const [values, setValues]           = useState<string[]>(Array(length).fill(''));
  const [cooldown, setCooldown]       = useState(resendCooldown);
  const [canResend, setCanResend]     = useState(false);
  const inputRefs                     = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newValues = [...values];
    // Handle paste of full OTP
    if (value.length > 1) {
      const digits = value.slice(0, length).split('');
      digits.forEach((d, i) => { if (i < length) newValues[i] = d; });
      setValues(newValues);
      inputRefs.current[Math.min(digits.length, length - 1)]?.focus();
      if (digits.length === length) onComplete(newValues.join(''));
      return;
    }

    newValues[index] = value;
    setValues(newValues);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v !== '')) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (values[index]) {
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValues = Array(length).fill('');
    pasted.split('').forEach((d, i) => { newValues[i] = d; });
    setValues(newValues);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (pasted.length === length) onComplete(newValues.join(''));
  };

  const handleResend = () => {
    if (!canResend) return;
    setValues(Array(length).fill(''));
    setCooldown(resendCooldown);
    setCanResend(false);
    onResend?.();
    inputRefs.current[0]?.focus();
  };

  const isComplete = values.every(v => v !== '');

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Icon */}
      <div
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--neon-cyan-dim)',
          border: '1px solid rgba(0,212,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 32px rgba(0,212,255,0.2)',
        }}
      >
        <Shield size={28} style={{ color: 'var(--neon-cyan)' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.375rem' }}>
          Verify Your Identity
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="otp-container" onPaste={handlePaste}>
        {values.map((val, i) => (
          <motion.input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`otp-box ${val ? 'filled' : ''} ${error ? 'error' : ''}`}
            disabled={loading}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2"
            style={{ color: 'var(--neon-crimson)', fontSize: '0.875rem' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <XCircle size={16} />
            {error}
          </motion.div>
        )}
        {isComplete && !error && !loading && (
          <motion.div
            className="flex items-center gap-2"
            style={{ color: 'var(--neon-emerald)', fontSize: '0.875rem' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={16} />
            Code entered — verifying...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resend */}
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Didn&apos;t receive the code?{' '}
        <button
          onClick={handleResend}
          disabled={!canResend}
          style={{
            background: 'none',
            border: 'none',
            cursor: canResend ? 'pointer' : 'default',
            color: canResend ? 'var(--neon-cyan)' : 'var(--text-disabled)',
            fontWeight: 600,
            fontSize: 'inherit',
            padding: 0,
          }}
        >
          {canResend ? 'Resend Code' : `Resend in ${cooldown}s`}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <div
            style={{
              width: 16, height: 16, border: '2px solid var(--glass-border)',
              borderTopColor: 'var(--neon-cyan)', borderRadius: '50%',
              animation: 'spin-slow 0.8s linear infinite',
            }}
          />
          Verifying...
        </div>
      )}
    </div>
  );
}
