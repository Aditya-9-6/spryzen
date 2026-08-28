import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Spryzen+ — AI-Powered Cybersecurity Shield'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #030305 0%, #0a0a18 50%, #030305 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
            top: '-100px',
            left: '300px',
          }}
        />
        {/* Shield icon placeholder */}
        <div
          style={{
            fontSize: '80px',
            marginBottom: '24px',
          }}
        >
          🛡️
        </div>
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#f1f5f9',
              letterSpacing: '-2px',
            }}
          >
            Spryzen
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#00d4ff',
              letterSpacing: '-2px',
            }}
          >
            +
          </span>
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            fontWeight: 400,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          AI-Powered Cybersecurity for Modern Applications
        </div>
        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '40px',
          }}
        >
          {[
            { value: '10Gbps', label: 'Throughput' },
            { value: '0.8ms', label: 'Latency' },
            { value: '99.99%', label: 'Uptime' },
          ].map((stat) => (
            <div
              key={stat.value}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#00d4ff' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '18px', color: '#475569' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
