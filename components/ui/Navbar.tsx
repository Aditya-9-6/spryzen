'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Menu, X, ChevronRight, Zap } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const navLinks = [
  { label: 'Technology', href: '/features' },
  { label: 'Live Demo', href: '/#playground' },
  { label: 'Customers', href: '/customers' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing & ROI', href: '/pricing' },
  { label: 'Log Inspector', href: '/analyzer' },
  { label: 'War Game', href: '/wargame' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const lastScroll                = useRef(0);
  const [visible, setVisible]     = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      setVisible(current < lastScroll.current || current < 80);
      lastScroll.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Spryzen+ Home">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface)] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="btn btn-ghost btn-sm text-sm"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="btn btn-primary btn-sm text-sm flex items-center gap-2"
          >
            <Zap size={14} />
            Start Free Trial
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface)] transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-50 md:hidden"
          >
            <div className="glass-strong m-4 rounded-2xl overflow-hidden">
              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-surface)] transition-all"
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost w-full justify-center"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary w-full justify-center"
                >
                  <Zap size={16} />
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
