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
      {/* Official Brand Logo Icon */}
      <div
        className="relative flex items-center justify-center flex-shrink-0 overflow-hidden rounded-xl"
        style={{
          width: iconDim,
          height: iconDim,
          border: '1.5px solid rgba(0, 212, 255, 0.4)',
          boxShadow: '0 0 15px rgba(0, 212, 255, 0.35)',
          background: 'var(--bg-void)',
        }}
      >
        <img
          src="/logo.jpg"
          alt="Spryzen Logo"
          width={iconDim}
          height={iconDim}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
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
