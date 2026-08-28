'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Filter, Shield, AlertTriangle, Info, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'system';
  title: string;
  body: string;
  action_url?: string;
  read: boolean;
  created_at: string;
}

const typeConfig = {
  critical: { color: 'var(--neon-crimson)', icon: AlertTriangle, label: 'Critical', badge: 'badge-crimson' },
  warning:  { color: 'var(--neon-gold)',    icon: AlertTriangle, label: 'Warning',  badge: 'badge-gold' },
  info:     { color: 'var(--neon-cyan)',    icon: Info,          label: 'Info',     badge: 'badge-cyan' },
  system:   { color: '#a855f7',             icon: Zap,           label: 'System',   badge: 'badge-violet' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs]       = useState<Notification[]>([]);
  const [filter, setFilter]       = useState<'all' | Notification['type']>('all');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/portal/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifs(data.notifications);
        } else {
          // Demo data
          setNotifs([
            { id: '1', type: 'critical', title: 'New Attack Pattern Detected',          body: 'Zero-day SQL injection variant detected and signature broadcast to global mesh. All nodes protected.', read: false, created_at: new Date(Date.now() - 600000).toISOString(), action_url: '/portal/war-room' },
            { id: '2', type: 'warning',  title: 'Usage at 80% of Monthly Limit',        body: 'You have used 4M of 5M requests this month. Consider upgrading to Fortress to avoid overage charges.', read: false, created_at: new Date(Date.now() - 3600000).toISOString(), action_url: '/portal/billing' },
            { id: '3', type: 'info',     title: 'May 2026 Security Report Ready',        body: 'Your monthly security audit PDF has been generated and sent to your email. 14,203 threats blocked this month.', read: true, created_at: new Date(Date.now() - 86400000).toISOString(), action_url: '/portal/reports' },
            { id: '4', type: 'system',   title: 'Spryzen+ v2.6 Deployed',               body: 'New engine update: Ouroboros now supports autonomous Wasm patch generation. Zero downtime deployment completed.', read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: '5', type: 'info',     title: 'Tartarus Engine: 12 Attackers Banished', body: 'Coordinated bot network (12 IPs) has been banished to the Mirror Dimension. Average session in honeypot: 48 minutes.', read: true, created_at: new Date(Date.now() - 259200000).toISOString(), action_url: '/portal/war-room' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    await fetch('/api/portal/notifications/read-all', { method: 'POST' }).catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    fetch('/api/portal/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
    fetch(`/api/portal/notifications/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000)   return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                background: 'var(--neon-crimson)', color: '#fff',
                fontSize: '0.875rem', fontWeight: 700,
                borderRadius: '12px', padding: '2px 10px',
              }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Security alerts, billing updates, and system notifications</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'critical', 'warning', 'info', 'system'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${filter === f ? 'rgba(0,212,255,0.4)' : 'var(--glass-border)'}`,
              background: filter === f ? 'var(--neon-cyan-dim)' : 'var(--glass-surface)',
              color: filter === f ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              letterSpacing: '0.04em',
            }}
          >
            {f === 'all' ? `All (${notifs.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${notifs.filter(n => n.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Bell size={40} style={{ color: 'var(--text-disabled)', margin: '0 auto 1rem', display: 'block' }} />
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No notifications in this category</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {filtered.map((notif, i) => {
              const cfg = typeConfig[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="notification-item"
                  style={{
                    borderLeft: notif.read ? '1px solid var(--glass-border)' : `3px solid ${cfg.color}`,
                    cursor: notif.action_url ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    markRead(notif.id);
                    if (notif.action_url) window.location.href = notif.action_url;
                  }}
                >
                  {/* Type dot */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: `${cfg.color}15`,
                    border: `1px solid ${cfg.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '0.125rem',
                  }}>
                    <cfg.icon size={16} style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: notif.read ? 500 : 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`, flexShrink: 0 }} />
                        )}
                      </div>
                      <span className={`badge ${cfg.badge}`} style={{ fontSize: '0.6rem', flexShrink: 0 }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.375rem' }}>
                      {notif.body}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {relativeTime(notif.created_at)}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: '0.25rem', flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--neon-crimson)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
