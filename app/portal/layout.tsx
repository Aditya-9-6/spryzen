'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Swords, CreditCard, FileText,
  Bell, MessageSquare, Bot, Settings, LogOut,
  ChevronLeft, ChevronRight, Menu, X, User,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/portal/dashboard' },
  { icon: Swords,          label: 'War Room',       href: '/portal/war-room' },
  { icon: CreditCard,      label: 'Billing',        href: '/portal/billing' },
  { icon: FileText,        label: 'Reports',        href: '/portal/reports' },
  { icon: Bell,            label: 'Notifications',  href: '/portal/notifications' },
  { icon: MessageSquare,   label: 'Support',        href: '/portal/support' },
  { icon: Bot,             label: 'AI Assistant',   href: '/portal/ai' },
  { icon: Shield,          label: 'Admin Portal',   href: '/portal/admin' },
  { icon: Settings,        label: 'Settings',       href: '/portal/settings' },
];

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      style={{
        background: 'var(--neon-crimson)',
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: 700,
        borderRadius: '10px',
        padding: '1px 5px',
        minWidth: 18,
        textAlign: 'center',
        marginLeft: 'auto',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname                 = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [user, setUser]             = useState<{ name: string; email: string; plan: string } | null>(null);

  useEffect(() => {
    // Fetch notification count
    const fetchNotifCount = async () => {
      try {
        const res = await fetch('/api/portal/notifications/count');
        if (res.ok) {
          const data = await res.json();
          setNotifCount(data.count ?? 0);
        }
      } catch { /* silent */ }
    };

    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/portal/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch { /* silent */ }
    };

    fetchNotifCount();
    fetchUser();
    const interval = setInterval(fetchNotifCount, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/auth/login';
  };

  const sidebarWidth = collapsed ? '72px' : '260px';

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          height: 72, display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 1rem' : '0 1.25rem',
          borderBottom: '1px solid var(--glass-border)',
          gap: '0.75rem', flexShrink: 0,
        }}
      >
        <Shield size={28} style={{ color: 'var(--neon-cyan)', flexShrink: 0 }} strokeWidth={1.5} />
        {!collapsed && (
          <span style={{
            fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem',
            background: 'linear-gradient(135deg, var(--neon-cyan), #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            SPRYZEN+
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const isNotif = href === '/portal/notifications';
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-link ${active ? 'active' : ''}`}
              title={collapsed ? label : undefined}
              style={{ justifyContent: collapsed ? 'center' : undefined }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{label}</span>
                  {isNotif && <NotificationBadge count={notifCount} />}
                </>
              )}
              {collapsed && isNotif && notifCount > 0 && (
                <div style={{
                  position: 'absolute', top: 6, right: 8,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--neon-crimson)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{ borderTop: '1px solid var(--glass-border)', padding: '0.75rem' }}>
        {user && !collapsed && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '0.5rem',
            background: 'var(--glass-surface)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            <div style={{ marginTop: '0.375rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{user.plan} Plan</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--neon-cyan-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={16} style={{ color: 'var(--neon-cyan)' }} />
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`sidebar-link`}
          style={{
            width: '100%', justifyContent: collapsed ? 'center' : undefined,
            cursor: 'pointer', background: 'none', border: 'none',
          }}
          title={collapsed ? 'Log Out' : undefined}
        >
          <LogOut size={18} style={{ flexShrink: 0, color: 'var(--neon-crimson)' }} />
          {!collapsed && <span style={{ color: 'var(--neon-crimson)' }}>Log Out</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: 'absolute', top: '50%', right: -12,
          transform: 'translateY(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
          color: 'var(--text-muted)',
        }}
        className="hidden md:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="sidebar hidden md:flex"
        style={{
          width: sidebarWidth,
          position: 'fixed',
          top: 72, // below navbar
          bottom: 0,
          left: 0,
          flexDirection: 'column',
          zIndex: 40,
          overflow: 'hidden',
        }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                zIndex: 45, backdropFilter: 'blur(4px)',
              }}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="sidebar"
              style={{
                position: 'fixed', top: 72, bottom: 0, left: 0,
                width: 260, zIndex: 50, flexDirection: 'column',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile top bar */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', top: 72, left: 0, right: 0,
          height: 52, background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', padding: '0 1rem',
          gap: '1rem', zIndex: 39,
        }}
      >
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          {navItems.find(n => pathname.startsWith(n.href))?.label ?? 'Portal'}
        </span>
      </div>

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          padding: '2rem',
          paddingTop: '2rem',
          minWidth: 0,
          background: 'var(--bg-void)',
          transition: 'margin-left 0.25s ease',
        }}
        className="md:ml-[var(--sidebar-w)] mt-[52px] md:mt-0"
      >
        {children}
      </main>
    </div>
  );
}
