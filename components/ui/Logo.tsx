'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withTagline?: boolean;
  className?: string;
}

export default function Logo({
  size = 'md',
  withText = true,
  withTagline = false,
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 60,
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const iconDim = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Quantum Shield Mark */}
      <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: iconDim, height: iconDim }}>
        {/* Outer Glow */}
        <div
          className="absolute inset-0 rounded-full blur-[10px] opacity-70 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--neon-cyan) 0%, rgba(124, 58, 237, 0.4) 60%, transparent 80%)',
          }}
        />

        {/* SVG Shield & Quantum Lattice */}
        <svg
          width={iconDim}
          height={iconDim}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:scale-105"
        >
          {/* Shield Outline */}
          <path
            d="M24 4L40 10V22C40 33.2 33.2 41.5 24 44C14.8 41.5 8 33.2 8 22V10L24 4Z"
            stroke="url(#shield_grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(6, 182, 212, 0.08)"
          />

          {/* Inner Quantum Core */}
          <path
            d="M24 14L32 18V25C32 30.5 28.5 35 24 36.5C19.5 35 16 30.5 16 25V18L24 14Z"
            stroke="url(#core_grad)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            fill="rgba(124, 58, 237, 0.18)"
          />

          {/* Center Lattice Cross / Spark */}
          <circle cx="24" cy="25" r="3" fill="#00d4ff" />
          <line x1="24" y1="19" x2="24" y2="31" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="25" x2="30" y2="25" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />

          {/* Gradients */}
          <defs>
            <linearGradient id="shield_grad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00d4ff" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="core_grad" x1="16" y1="14" x2="32" y2="36.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {withText && (
        <div className="flex flex-col">
          <div
            className={`font-black tracking-tight leading-none font-outfit uppercase ${textSizes[size]}`}
            style={{
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              SPRYZEN
            </span>
            <span
              style={{
                color: '#00d4ff',
                textShadow: '0 0 12px rgba(0, 212, 255, 0.6)',
                marginLeft: '1px',
              }}
            >
              +
            </span>
          </div>

          {withTagline && (
            <span className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest uppercase mt-0.5">
              Sovereign AI Security
            </span>
          )}
        </div>
      )}
    </div>
  );
}
