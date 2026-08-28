'use client';

import Link from 'next/link';
import { Shield, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features',      href: '/features' },
    { label: 'Log Inspector', href: '/analyzer' },
    { label: 'Pricing',       href: '/pricing' },
    { label: 'War Game',     href: '/wargame' },
    { label: 'Developer Docs', href: '/docs' },
  ],
  Security: [
    { label: 'WAF Engine',    href: '/features#waf' },
    { label: 'Tartarus',      href: '/features#tartarus' },
    { label: 'Aegis Prime',   href: '/features#aegis' },
    { label: 'Ghost Engine',  href: '/features#ghost' },
    { label: 'CVE Sentinel',  href: '/features#sentinel' },
  ],
  Company: [
    { label: 'Contact',       href: '/contact' },
    { label: 'Support',       href: '/portal/support' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

const socialLinks = [
  { icon: Twitter,  href: '#', label: 'Twitter' },
  { icon: Github,   href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--glass-border)',
      }}
    >
      {/* Main footer content */}
      <div
        className="section-px"
        style={{ padding: '4rem var(--section-px) 2rem' }}
      >
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Shield
                size={28}
                className="text-[var(--neon-cyan)]"
                strokeWidth={1.5}
              />
              <span
                className="font-display font-black text-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SPRYZEN+
              </span>
            </Link>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '280px' }}>
              The world&apos;s first self-evolving, sovereign AI security engine. 99.9% detection. 62% cheaper than Cloudflare.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'var(--glass-surface)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--neon-cyan)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['SOC 2', 'DPDP', 'ISO 27001', 'GDPR'].map((badge) => (
                <span
                  key={badge}
                  className="badge badge-muted"
                  style={{ fontSize: '0.65rem' }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-label mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid var(--glass-border)',
          padding: '1.25rem var(--section-px)',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} Spryzen Security Systems Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-2"
              style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: 'var(--neon-emerald)', boxShadow: '0 0 8px var(--neon-emerald)' }}
              />
              All systems operational
            </span>
            <a
              href="https://status.spryzen.plus"
              className="flex items-center gap-1 transition-colors"
              style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Status <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
