'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Download, RefreshCw, CheckCircle, AlertCircle, Clock, ArrowUpRight, Building2, Info } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount_paise: number;
  status: 'paid' | 'pending' | 'failed';
  method?: string;
  pdf_url?: string;
}

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

const PLAN_UPGRADE_OPTIONS = [
  { from: 'sentinel', to: 'fortress', label: 'Upgrade to Fortress', price: 100, color: '#7c3aed' },
  { from: 'sentinel', to: 'ironclad', label: 'Upgrade to IronClad', price: -1,   color: '#d4af37' },
];

export default function BillingPage() {
  const [invoices, setInvoices]       = useState<Invoice[]>([]);
  const [currentPlan, setCurrentPlan] = useState('sentinel');
  const [loading, setLoading]         = useState(true);
  const [payLoading, setPayLoading]   = useState(false);
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [currency, setCurrency]       = useState<'INR' | 'USD'>('USD');

  useEffect(() => {
    // Load Razorpay JS SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch billing data
    const fetchBilling = async () => {
      try {
        const res = await fetch('/api/payment/invoices');
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
          setCurrentPlan(data.plan || 'sentinel');
        } else {
          // Demo data
          setInvoices([
            { id: 'inv_1', date: '2026-05-01', amount_paise: 97740, status: 'paid',    method: 'UPI' },
            { id: 'inv_2', date: '2026-04-01', amount_paise: 97740, status: 'paid',    method: 'Card' },
            { id: 'inv_3', date: '2026-03-01', amount_paise: 97740, status: 'paid',    method: 'UPI' },
            { id: 'inv_4', date: '2026-02-01', amount_paise: 97740, status: 'failed',  method: 'UPI' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();

    return () => { document.body.removeChild(script); };
  }, []);

  // ─── Razorpay Checkout ──────────────────────────────────────────────────
  const handlePayNow = async (amountPaise: number, planId?: string) => {
    setPayLoading(true);
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_paise: amountPaise, plan: planId }),
      });

      if (!res.ok) throw new Error('Failed to create order');
      const { order_id, key_id } = await res.json();

      const rzp = new window.Razorpay({
        key: key_id,
        amount: amountPaise,
        currency: 'USD',
        name: 'Spryzen+',
        description: `${planId || 'Subscription'} Renewal`,
        order_id,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // Verify on server
          await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          window.location.reload();
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#00d4ff' },
        modal: { backdropclose: false },
      });
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  const formatAmount = (cents: number) => `$${(cents / 100).toLocaleString('en-US')}`;
  const statusIcon = (s: Invoice['status']) => {
    if (s === 'paid')    return <CheckCircle size={14} style={{ color: 'var(--neon-emerald)' }} />;
    if (s === 'pending') return <Clock size={14} style={{ color: 'var(--neon-gold)' }} />;
    return <AlertCircle size={14} style={{ color: 'var(--neon-crimson)' }} />;
  };
  const statusBadge = (s: Invoice['status']) => {
    if (s === 'paid')    return 'badge-emerald';
    if (s === 'pending') return 'badge-gold';
    return 'badge-crimson';
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>Billing & Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your subscription, invoices, and payment methods</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ─── Current Plan Card ──────────────────────────────────────────── */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet))' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  Active Plan
                </div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: 'var(--neon-cyan)' }}>Sentinel</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  $10.00/month + Tax ($10.80 total) · Renews June 1, 2026
                </div>
              </div>
              <span className="badge badge-emerald">Active</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handlePayNow(1080, 'sentinel')}
                disabled={payLoading}
              >
                <CreditCard size={14} />
                Pay Now ($10.80)
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowBankInfo(b => !b)}
              >
                <Building2 size={14} />
                Bank Transfer
              </button>
              <a href="/pricing" className="btn btn-ghost btn-sm">
                <ArrowUpRight size={14} />
                Upgrade Plan
              </a>
            </div>

            {/* Bank Transfer Panel */}
            {showBankInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  marginTop: '1.25rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--neon-gold)', fontWeight: 600, fontSize: '0.875rem' }}>
                  <Info size={14} />
                  Bank Transfer Instructions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                  {[
                    ['Account Name',   'Spryzen Security Systems Inc.'],
                    ['Account Number', '1234 5678 9012'],
                    ['Routing Number', '123456789'],
                    ['Bank',           'Chase Bank — New York'],
                    ['Amount',         '$10.80 (including Tax)'],
                    ['Reference Code', 'SPZ-USR123-MAY26'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.125rem' }}>{k}</div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: k === 'Reference Code' ? 700 : 400, fontFamily: k === 'Reference Code' ? 'JetBrains Mono' : 'Inter' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', background: 'var(--neon-gold-dim)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--neon-gold)' }}>
                  ⚠ Include the reference code in your transfer remarks. Payment typically activates within 1-2 business days after confirmation.
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ─── Invoice History ───────────────────────────────────────────── */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.75rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>Invoice History</h2>
              <button className="btn btn-ghost btn-sm">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.map(inv => (
                    <tr key={inv.id}>
                      <td>{new Date(inv.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td style={{ fontWeight: 600 }}>{formatAmount(inv.amount_paise)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{inv.method || '—'}</td>
                      <td>
                        <span className={`badge ${statusBadge(inv.status)}`} style={{ fontSize: '0.65rem' }}>
                          {statusIcon(inv.status)}
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {inv.pdf_url ? (
                          <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}>
                            <Download size={12} /> PDF
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-disabled)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ─── GST Summary ──────────────────────────────────────────────── */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Tax Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                ['Base Amount', '$10.00'],
                ['Sales Tax / VAT (8%)', '$0.80'],
                ['Total',      '$10.80'],
              ].map(([k, v], i) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  paddingTop: i === 2 ? '0.75rem' : 0,
                  marginTop: i === 2 ? '0.25rem' : 0,
                  borderTop: i === 2 ? '1px solid var(--glass-border)' : 'none',
                  fontWeight: i === 2 ? 700 : 400,
                  color: i === 2 ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                  <span>{k}</span>
                  <span style={{ color: i === 2 ? 'var(--neon-cyan)' : undefined }}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── Payment Methods ──────────────────────────────────────────── */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Pay Via</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '💳', label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, RuPay' },
                { icon: '📱', label: 'UPI',                   sub: 'GPay, PhonePe, Paytm, BHIM' },
                { icon: '🏦', label: 'Net Banking',           sub: 'All major Indian banks' },
                { icon: '🏛️', label: 'Bank Transfer',        sub: 'NEFT/RTGS/IMPS' },
              ].map(method => (
                <div
                  key={method.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)', border: '1px solid var(--glass-border)',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{method.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{method.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
               className="btn btn-primary mt-4"
               style={{ width: '100%', justifyContent: 'center' }}
               onClick={() => handlePayNow(1080)}
               disabled={payLoading}
             >
               <Banknote size={16} />
               {payLoading ? 'Opening Payment...' : 'Pay $10.80'}
             </button>
          </motion.div>

          {/* ─── Upgrade Options ─────────────────────────────────────────── */}
          <motion.div
            className="glass-card"
            style={{ padding: '1.5rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Upgrade Your Plan</h3>
            {PLAN_UPGRADE_OPTIONS.map(opt => (
              <button
                key={opt.to}
                onClick={() => opt.price === -1 ? window.location.href = '/contact' : handlePayNow(opt.price * 100, opt.to)}
                disabled={payLoading}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.875rem',
                  border: `1px solid ${opt.color}30`,
                  borderRadius: 'var(--radius-sm)',
                  background: `${opt.color}08`,
                  cursor: 'pointer', marginBottom: '0.75rem',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: 700, color: opt.color, fontSize: '0.9rem' }}>{opt.label}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.125rem' }}>
                  {opt.price === -1 ? 'Custom pricing — Contact sales' : `$${opt.price.toLocaleString('en-US')}/mo + Tax`}
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
