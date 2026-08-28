'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Clock, CheckCircle, Loader2, ChevronRight, AlertCircle, X, Paperclip, Send } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: 'billing' | 'technical' | 'general';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  updated_at: string;
  message_count: number;
}

const catColor = (c: string) => {
  if (c === 'billing')   return { bg: 'var(--neon-gold-dim)',    color: 'var(--neon-gold)',    label: 'Billing' };
  if (c === 'technical') return { bg: 'var(--neon-cyan-dim)',    color: 'var(--neon-cyan)',    label: 'Technical' };
  return                        { bg: 'var(--neon-violet-dim)',  color: '#a855f7',             label: 'General' };
};

const statusConfig = (s: string) => {
  if (s === 'open')        return { badge: 'badge-crimson', label: 'Open' };
  if (s === 'in_progress') return { badge: 'badge-gold',   label: 'In Progress' };
  if (s === 'resolved')    return { badge: 'badge-emerald', label: 'Resolved' };
  return                          { badge: 'badge-muted',   label: 'Closed' };
};

export default function SupportPage() {
  const [tickets] = useState<Ticket[]>([
    { id: 't1', subject: 'WAF blocking legitimate API requests',    category: 'technical', status: 'in_progress', priority: 'high',   updated_at: new Date(Date.now() - 3600000).toISOString(),   message_count: 4 },
    { id: 't2', subject: 'Need GST invoice for April payment',      category: 'billing',   status: 'resolved',   priority: 'normal', updated_at: new Date(Date.now() - 86400000).toISOString(),  message_count: 3 },
    { id: 't3', subject: 'How to add team member with ReadOnly role?', category: 'general', status: 'open',     priority: 'low',    updated_at: new Date(Date.now() - 172800000).toISOString(), message_count: 1 },
  ]);

  const [showNew, setShowNew]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [newTicket, setNewTicket]     = useState({ subject: '', category: 'technical', message: '' });
  const [submitted, setSubmitted]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/portal/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });
      setSubmitted(true);
      setShowNew(false);
      setNewTicket({ subject: '', category: 'technical', message: '' });
    } catch {
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>Support</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Get help from the Spryzen+ team. We typically respond within your plan SLA.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
          <Plus size={14} /> New Ticket
        </button>
      </div>

      {/* SLA Info */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem',
        }}
      >
        {[
          { tier: 'Scout',    sla: 'Community', color: '#64748b' },
          { tier: 'Sentinel', sla: '24 hours',  color: 'var(--neon-cyan)', active: true },
          { tier: 'Fortress', sla: '4 hours',   color: '#7c3aed' },
          { tier: 'IronClad', sla: 'Dedicated', color: 'var(--neon-gold)' },
        ].map(s => (
          <div
            key={s.tier}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: s.active ? `${s.color}10` : 'var(--bg-card)',
              border: `1px solid ${s.active ? s.color + '40' : 'var(--glass-border)'}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{s.tier}</div>
            <div style={{ fontWeight: 700, color: s.active ? s.color : 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.sla}</div>
            {s.active && <div style={{ fontSize: '0.65rem', color: s.color, marginTop: '0.25rem' }}>Your Plan</div>}
          </div>
        ))}
      </div>

      {/* Success message */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--neon-emerald-dim)', border: '1px solid rgba(0,230,118,0.3)',
            borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem',
            color: 'var(--neon-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem', fontSize: '0.9rem',
          }}
        >
          <CheckCircle size={16} />
          Ticket submitted! We&apos;ll respond within your plan SLA (24 hours for Sentinel).
        </motion.div>
      )}

      {/* New ticket form */}
      {showNew && (
        <motion.div
          className="glass-card"
          style={{ padding: '2rem', marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.25rem' }}>Open a New Ticket</h2>
            <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label">Subject</label>
                <input
                  type="text" className="input" required
                  placeholder="Describe your issue briefly"
                  value={newTicket.subject}
                  onChange={e => setNewTicket(t => ({ ...t, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={newTicket.category}
                  onChange={e => setNewTicket(t => ({ ...t, category: e.target.value }))}
                >
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="general">General Question</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="label">Describe Your Issue</label>
              <textarea
                className="input"
                required
                rows={5}
                placeholder="Please include: steps to reproduce, what you expected, what actually happened, and any error messages."
                value={newTicket.message}
                onChange={e => setNewTicket(t => ({ ...t, message: e.target.value }))}
                style={{ resize: 'vertical', minHeight: 120 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} /> Submitting...</> : <><Send size={14} /> Submit Ticket</>}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tickets list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {tickets.map((t, i) => {
          const cat = catColor(t.category);
          const sts = statusConfig(t.status);
          return (
            <motion.div
              key={t.id}
              className="glass-card"
              style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ borderColor: 'rgba(0,212,255,0.2)', transform: 'translateY(-2px)' }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                background: cat.bg, border: `1px solid ${cat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageSquare size={18} style={{ color: cat.color }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.subject}</span>
                  <span className={`badge ${sts.badge}`} style={{ fontSize: '0.6rem' }}>{sts.label}</span>
                  <span className="badge badge-muted" style={{ fontSize: '0.6rem', background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}>{cat.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span><MessageSquare size={11} style={{ display: 'inline', marginRight: 3 }} />{t.message_count} messages</span>
                  <span><Clock size={11} style={{ display: 'inline', marginRight: 3 }} />Updated {new Date(t.updated_at).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </motion.div>
          );
        })}
      </div>

      {tickets.length === 0 && !showNew && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <MessageSquare size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
          <div style={{ fontSize: '0.95rem' }}>No support tickets yet</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setShowNew(true)}>
            <Plus size={14} /> Open your first ticket
          </button>
        </div>
      )}
    </div>
  );
}
