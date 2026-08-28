'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Mail, Eye, Clock, CheckCircle, Loader2, Calendar, RefreshCw } from 'lucide-react';

interface Report {
  id: string;
  report_month: string;
  title: string;
  pdf_url?: string;
  status: 'ready' | 'generating' | 'scheduled';
  threats_blocked?: number;
  uptime_pct?: number;
  generated_at?: string;
  emailed_at?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [nextGenDays, setNextGenDays] = useState(11);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/portal/reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data.reports);
        } else {
          // Demo data
          setReports([
            { id: 'r1', report_month: '2026-05', title: 'Security Audit — May 2026',   status: 'generating', threats_blocked: undefined },
            { id: 'r2', report_month: '2026-04', title: 'Security Audit — April 2026', status: 'ready',      threats_blocked: 14203, uptime_pct: 99.97, generated_at: '2026-05-01T00:15:00Z', emailed_at: '2026-05-01T00:20:00Z', pdf_url: '#' },
            { id: 'r3', report_month: '2026-03', title: 'Security Audit — March 2026', status: 'ready',      threats_blocked: 9847,  uptime_pct: 99.91, generated_at: '2026-04-01T00:10:00Z', emailed_at: '2026-04-01T00:14:00Z', pdf_url: '#' },
            { id: 'r4', report_month: '2026-02', title: 'Security Audit — Feb 2026',   status: 'ready',      threats_blocked: 7203,  uptime_pct: 99.88, generated_at: '2026-03-01T00:08:00Z', emailed_at: '2026-03-01T00:12:00Z', pdf_url: '#' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleEmailReport = async (reportId: string) => {
    setEmailingId(reportId);
    try {
      await fetch(`/api/portal/reports/${reportId}/email`, { method: 'POST' });
      alert('Report sent to your registered email!');
    } catch {
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailingId(null);
    }
  };

  const statusBadge = (s: Report['status']) => {
    if (s === 'ready')      return { cls: 'badge-emerald', label: 'Ready',      icon: <CheckCircle size={10} /> };
    if (s === 'generating') return { cls: 'badge-gold',    label: 'Generating', icon: <Loader2 size={10} style={{ animation: 'spin-slow 1s linear infinite' }} /> };
    return                         { cls: 'badge-muted',   label: 'Scheduled',  icon: <Clock size={10} /> };
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>Security Reports</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monthly PDF audit reports — auto-generated and delivered to your inbox</p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Next report countdown */}
      <motion.div
        className="glass-card"
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, var(--neon-cyan-dim), rgba(124,58,237,0.08))',
          border: '1px solid rgba(0,212,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar size={28} style={{ color: 'var(--neon-cyan)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              June 2026 Report
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Generates automatically on <strong>June 1, 2026 at 00:00 IST</strong>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: 'var(--neon-cyan)', lineHeight: 1 }}>
            {nextGenDays}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            days until generation
          </div>
        </div>
      </motion.div>

      {/* Reports list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin-slow 1s linear infinite', marginBottom: '1rem', color: 'var(--neon-cyan)', display: 'block', margin: '0 auto 1rem' }} />
          Loading reports...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.map((report, i) => {
            const badge = statusBadge(report.status);
            return (
              <motion.div
                key={report.id}
                className="glass-card"
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                  background: report.status === 'ready' ? 'var(--neon-cyan-dim)' : 'var(--neon-gold-dim)',
                  border: `1px solid ${report.status === 'ready' ? 'rgba(0,212,255,0.2)' : 'rgba(212,175,55,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={24} style={{ color: report.status === 'ready' ? 'var(--neon-cyan)' : 'var(--neon-gold)' }} />
                </div>

                {/* Report info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>{report.title}</h3>
                    <span className={`badge ${badge.cls}`} style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {badge.icon}{badge.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {report.threats_blocked !== undefined && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        🛡 {report.threats_blocked.toLocaleString()} threats blocked
                      </span>
                    )}
                    {report.uptime_pct !== undefined && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        📡 {report.uptime_pct}% uptime
                      </span>
                    )}
                    {report.generated_at && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Generated {new Date(report.generated_at).toLocaleDateString('en-IN')}
                      </span>
                    )}
                    {report.emailed_at && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--neon-emerald)' }}>
                        ✓ Emailed {new Date(report.emailed_at).toLocaleDateString('en-IN')}
                      </span>
                    )}
                    {report.status === 'generating' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--neon-gold)' }}>
                        ⏳ Pulling data from your proxy...
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {report.status === 'ready' && (
                  <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
                    <a
                      href={report.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} /> View
                    </a>
                    <a
                      href={report.pdf_url}
                      download
                      className="btn btn-secondary btn-sm"
                    >
                      <Download size={14} /> PDF
                    </a>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEmailReport(report.id)}
                      disabled={emailingId === report.id}
                    >
                      {emailingId === report.id
                        ? <Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} />
                        : <Mail size={14} />
                      }
                      Email
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
