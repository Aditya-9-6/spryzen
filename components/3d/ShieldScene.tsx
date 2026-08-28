'use client';

import { useRef, useEffect, useState, Component, ReactNode } from 'react';
import * as THREE from 'three';

// ─── Error Boundary ───────────────────────────────────────────────────────
class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('WebGL ShieldScene fallback triggered:', error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Lightweight SVG/CSS Particle Shield Fallback ─────────────────────────
function ShieldFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px]">
        {/* Glowing concentric shield rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-violet-500/30 animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute inset-12 rounded-full border border-cyan-400/40 animate-[spin_10s_linear_infinite]" />
        
        {/* Core energy sphere */}
        <div className="absolute inset-24 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/30 to-cyan-400/20 blur-xl animate-pulse" />
        <div className="absolute inset-28 rounded-full border border-cyan-300/60 shadow-[0_0_50px_rgba(0,212,255,0.4)] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-400/30 blur-md" />
        </div>
      </div>
    </div>
  );
}

// ─── Canvas Particle Shield ───────────────────────────────────────────────
function InteractiveParticleShield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const numParticles = 60;
    const particles = Array.from({ length: numParticles }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 300,
      y: height / 2 + (Math.random() - 0.5) * 300,
      radius: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
      distance: 100 + Math.random() * 120,
      color: Math.random() > 0.5 ? '#00d4ff' : '#a855f7',
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw outer glowing rings
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140 + Math.sin(t) * 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 180 + Math.cos(t * 0.8) * 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw rotating particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.distance;
        const py = centerY + Math.sin(p.angle) * (p.distance * 0.55);

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none" />;
}

export default function ShieldScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <ShieldFallback />;

  return (
    <CanvasErrorBoundary fallback={<ShieldFallback />}>
      <div className="w-full h-full absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <ShieldFallback />
        <InteractiveParticleShield />
      </div>
    </CanvasErrorBoundary>
  );
}
