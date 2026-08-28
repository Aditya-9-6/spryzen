import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // ─── Turbopack (default in Next.js 16) ────────────────────────────────
  // Set root explicitly to fix workspace detection on Google Drive paths.
  turbopack: {
    root: process.cwd(),
  },

  // ─── Image Optimization ───────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.spryzen.plus' },
      { protocol: 'https', hostname: 'api.razorpay.com' },
    ],
  },

  // ─── Security Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://api.spryzen.plus http://localhost:3001 https://checkout.razorpay.com",
              "frame-src https://api.razorpay.com",
              "worker-src blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/dashboard', destination: '/portal/dashboard', permanent: false },
      { source: '/login',     destination: '/auth/login',       permanent: false },
      { source: '/signup',    destination: '/auth/signup',      permanent: false },
    ];
  },
};

export default nextConfig;

