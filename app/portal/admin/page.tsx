'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Shield, Users, CreditCard, Activity, Globe, Download, AlertTriangle,
  Search, RefreshCw, Send, Server, Bot, CheckCircle, X, ArrowUpRight, BarChart2
} from 'lucide-react';

interface Stats {
  total_customers: number;
  active_customers: number;
  blocked_customers: number;
  plans_breakdown: {
    free: number;
    starter: number;
    growth: number;
    pro: number;
    enterprise: number;
  };
  total_payments_received_usd: number;
  pending_payments_usd: number;
  upcoming_due_dates: Array<{
    customer_name: string;
    email: string;
    amount_usd: number;
    due_date: string;
  }>;
  total_attacks_survived: number;
  regional_traffic: Array<{
    region: string;
    percentage: number;
    rps: number;
  }>;
  nodes: Array<{
    id: string;
    name: string;
    region: string;
    type: string;
    status: string;
    cpu_usage: number;
    ram_usage: number;
    active_connections: number;
  }>;
  suggestions: string[];
  retention_policy_years: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  gstin: string | null;
  plan: string;
  key_hint: string;
  requests_limit: number;
  rate_limit_per_sec: number;
  status: string;
  billing_cycle_start: string;
  total_paid_usd: number;
  recent_bills: Array<{
    invoice_no: string;
    amount_usd: number;
    billing_date: string;
    status: string;
  }>;
}

export default function AdminPortal() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'nodes' | 'licensing'>('overview');

  // Customer Editing State
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editPlan, setEditPlan] = useState('');
  const [editLimit, setEditLimit] = useState(0);
  const [editRate, setEditRate] = useState(0);
  const [editCycle, setEditCycle] = useState('');

  // Enterprise License Generator State
  const [licCustId, setLicCustId] = useState('');
  const [licTier, setLicTier] = useState('Fortress');
  const [licDays, setLicDays] = useState(365);
  const [licHwid, setLicHwid] = useState('');
  const [licGenerating, setLicGenerating] = useState(false);
  const [licSuccess, setLicSuccess] = useState<string | null>(null);

  const handleGenerateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licCustId.trim()) {
      alert('Please enter a Customer ID / Org Name');
      return;
    }
    setLicGenerating(true);
    setLicSuccess(null);
    try {
      const res = await fetch('/api/admin/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: licCustId,
          tier: licTier,
          days: licDays,
          hwid: licHwid || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate signed license');
      const licenseObj = await res.json();
      
      // Auto-trigger browser download of license.json
      const blob = new Blob([JSON.stringify(licenseObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spryzen_license_${licCustId.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLicSuccess(`✅ License generated & downloaded for ${licCustId} (${licTier} Tier)`);
    } catch (err: any) {
      alert(err.message || 'Error generating license');
    } finally {
      setLicGenerating(false);
    }
  };

  // AI Copilot State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Salutations Administrator. I am the Spryzen+ SuperAdmin Copilot, connected directly to your active database and node telemetry. How may I assist you today?' }
  ]);
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/v1/admin/dashboard');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      const custRes = await fetch('/api/v1/admin/customers');
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages]);

  const handleUpdateBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/admin/customers/${editingCustomer.id}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: editPlan,
          requests_limit: editLimit,
          rate_limit_per_sec: editRate,
          billing_cycle_start: editCycle
        })
      });
      if (res.ok) {
        setEditingCustomer(null);
        await fetchAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (customer: Customer) => {
    const nextStatus = customer.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/v1/admin/customers/${customer.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadAudit = async () => {
    try {
      const response = await fetch('/api/v1/admin/audit/download');
      if (!response.ok) throw new Error('PDF Generation failure');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spryzen_system_audit_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error downloading PDF: ' + err);
    }
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || sendingChat) return;

    const userMsg = copilotQuery;
    setCopilotMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCopilotQuery('');
    setSendingChat(true);

    try {
      const res = await fetch('/api/v1/admin/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      if (res.ok) {
        const data = await res.json();
        setCopilotMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setCopilotMessages(prev => [...prev, { sender: 'bot', text: 'Error interacting with local reasoning system.' }]);
      }
    } catch {
      setCopilotMessages(prev => [...prev, { sender: 'bot', text: 'Failed to establish connection with Spryzen AI Node.' }]);
    } finally {
      setSendingChat(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="animate-spin text-[var(--neon-cyan)]" size={32} />
        <p className="text-[var(--text-secondary)] font-mono text-sm">Aggregating SuperAdmin Intelligence State...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="text-[var(--neon-cyan)] animate-pulse" size={28} />
            <h1 className="text-3xl font-black tracking-tight font-outfit uppercase">
              SuperAdmin Command Center
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] mt-1 font-mono text-sm">
            Formal Cryptographic Verification & SaaS Plan Enforcement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan-dim)] border border-[var(--neon-cyan-glow)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan-glow)] transition font-medium text-sm font-mono"
          >
            <Bot size={16} />
            AI Copilot
          </button>
          <button 
            onClick={handleDownloadAudit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-violet-dim)] border border-[var(--neon-violet-glow)] text-[var(--text-primary)] hover:bg-[var(--neon-violet-glow)] transition font-medium text-sm font-mono"
          >
            <Download size={16} />
            Audit PDF
          </button>
          <button 
            onClick={fetchAllData}
            className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--glass-border)] hover:bg-[var(--glass-surface-hover)] text-[var(--text-secondary)] transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-[var(--glass-border)] gap-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition ${activeTab === 'overview' ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
        >
          System Overview
        </button>
        <button 
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition ${activeTab === 'customers' ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
        >
          Customer Directory ({customers.length})
        </button>
        <button 
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition ${activeTab === 'nodes' ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
        >
          Node Telemetry ({stats?.nodes.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('licensing')}
          className={`px-4 py-2 font-mono text-sm border-b-2 transition flex items-center gap-1.5 ${activeTab === 'licensing' ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
        >
          <Shield size={14} /> Enterprise Licensing
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 border border-[var(--glass-border)] rounded-xl relative overflow-hidden bg-[var(--bg-card)]">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-[var(--neon-cyan-dim)] blur-xl" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-secondary)] font-mono text-xs uppercase">Total Customers</span>
                <Users className="text-[var(--neon-cyan)]" size={18} />
              </div>
              <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-outfit">
                {stats.total_customers}
              </div>
              <div className="text-xs text-[var(--neon-cyan)] mt-2 font-mono flex items-center gap-1">
                <span>{stats.active_customers} Active Keys Deployed</span>
              </div>
            </div>

            <div className="glass-card p-6 border border-[var(--glass-border)] rounded-xl relative overflow-hidden bg-[var(--bg-card)]">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-[var(--neon-emerald-dim)] blur-xl" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-secondary)] font-mono text-xs uppercase">Payments Received</span>
                <CreditCard className="text-[var(--neon-emerald)]" size={18} />
              </div>
              <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-outfit">
                ${stats.total_payments_received_usd.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2 font-mono flex items-center justify-between">
                <span>Pending: ${stats.pending_payments_usd}</span>
                <span className="text-[var(--neon-emerald)]">Tax Incl</span>
              </div>
            </div>

            <div className="glass-card p-6 border border-[var(--glass-border)] rounded-xl relative overflow-hidden bg-[var(--bg-card)]">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-[var(--neon-violet-dim)] blur-xl" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-secondary)] font-mono text-xs uppercase">Threats Survied</span>
                <Activity className="text-[var(--neon-violet)]" size={18} />
              </div>
              <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-outfit text-glow">
                {stats.total_attacks_survived.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--neon-violet)] mt-2 font-mono">
                Real-time WAF Deception Shield Neutralized
              </div>
            </div>

            <div className="glass-card p-6 border border-[var(--glass-border)] rounded-xl relative overflow-hidden bg-[var(--bg-card)]">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-[var(--neon-gold-dim)] blur-xl" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-secondary)] font-mono text-xs uppercase">Compliance Archival</span>
                <Globe className="text-[var(--neon-gold)]" size={18} />
              </div>
              <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] font-outfit">
                {stats.retention_policy_years} Years
              </div>
              <div className="text-xs text-[var(--neon-gold)] mt-2 font-mono">
                Log retention compliant with DPDP Act 2023
              </div>
            </div>
          </div>

          {/* Central Diagnostics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plans Distribution & Regional Traffic */}
            <div className="lg:col-span-2 space-y-8">
              {/* Node Needed Suggestions Box */}
              <div className="bg-[var(--glass-surface)] border border-[var(--neon-cyan-glow)] p-6 rounded-xl relative">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--neon-cyan-dim)] text-[var(--neon-cyan)] rounded-lg">
                    <Server size={22} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-outfit uppercase tracking-wider text-[var(--text-primary)]">
                      Node Recommendations & Auto-Scaling Directives
                    </h3>
                    <div className="mt-3 space-y-2">
                      {stats.suggestions.map((s, idx) => (
                        <p key={idx} className="text-sm font-mono text-[var(--text-secondary)] leading-relaxed">
                          {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Traffic distribution */}
              <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold uppercase tracking-wider font-outfit text-[var(--text-primary)]">
                    Regional Traffic Spectrum (Global Hubs)
                  </h3>
                  <Globe className="text-[var(--text-muted)]" size={18} />
                </div>
                <div className="space-y-4">
                  {stats.regional_traffic.map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                        <span>{t.region}</span>
                        <span>{t.rps} req/sec · {t.percentage}%</span>
                      </div>
                      <div className="h-3 bg-[var(--bg-void)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] rounded-full"
                          style={{ width: `${t.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing Ledger and Arrears */}
            <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] p-6 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold uppercase tracking-wider font-outfit text-[var(--text-primary)]">
                    Upcoming Billings Due
                  </h3>
                  <CreditCard className="text-[var(--text-muted)]" size={18} />
                </div>
                <div className="space-y-4">
                  {stats.upcoming_due_dates.map((due, idx) => (
                    <div key={idx} className="p-4 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-lg space-y-1 relative">
                      <div className="absolute top-4 right-4 text-xs font-mono text-[var(--neon-crimson)] bg-[var(--neon-crimson-dim)] px-2 py-0.5 rounded">
                        Due
                      </div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">{due.customer_name}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-mono">{due.email}</div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--glass-border)] text-xs font-mono text-[var(--text-primary)]">
                        <span>Amount Due:</span>
                        <span className="font-bold">${due.amount_usd.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        Cycle starts: {due.due_date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--glass-border)] space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)]">
                  <span>Starter count ($35):</span>
                  <span className="text-[var(--text-primary)]">{stats.plans_breakdown.starter}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)]">
                  <span>Growth count ($120):</span>
                  <span className="text-[var(--text-primary)]">{stats.plans_breakdown.growth}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)]">
                  <span>Pro count ($360):</span>
                  <span className="text-[var(--text-primary)]">{stats.plans_breakdown.pro}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[var(--text-secondary)]">
                  <span>Enterprise ($3,000+):</span>
                  <span className="text-[var(--text-primary)]">{stats.plans_breakdown.enterprise}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input 
                type="text"
                placeholder="Search Client Profile by Company, Admin Email, or plan tier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--glass-border)] rounded-lg pl-10 pr-4 py-2 font-mono text-sm focus:outline-none focus:border-[var(--neon-cyan)] text-[var(--text-primary)] transition"
              />
            </div>
          </div>

          {/* Customers Directory Table */}
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-elevated)] border-b border-[var(--glass-border)] text-[var(--text-secondary)] font-bold">
                    <th className="p-4">Customer ID / Hint</th>
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Billing Plan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Limit / Rate</th>
                    <th className="p-4">Billing Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-primary)]">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                        No clients found matching the search ledger inquiry.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-[var(--glass-surface)] transition">
                        <td className="p-4">
                          <div className="font-bold text-[var(--text-secondary)]">{cust.id.substring(0, 8)}...</div>
                          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">key hint: ...{cust.key_hint}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-sm">{cust.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{cust.email}</div>
                          {cust.gstin && (
                            <div className="text-[9px] text-[var(--neon-cyan)] mt-0.5 font-sans font-semibold">GSTIN: {cust.gstin}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                            cust.plan === 'enterprise' ? 'bg-[var(--neon-gold-dim)] text-[var(--neon-gold)] border border-[var(--neon-gold-glow)]' :
                            cust.plan === 'pro' ? 'bg-[var(--neon-violet-dim)] text-[var(--neon-violet)] border border-[var(--neon-violet-glow)]' :
                            cust.plan === 'growth' ? 'bg-[var(--neon-cyan-dim)] text-[var(--neon-cyan)] border border-[var(--neon-cyan-glow)]' :
                            cust.plan === 'starter' ? 'bg-[var(--neon-emerald-dim)] text-[var(--neon-emerald)] border border-[var(--neon-emerald-dim)]' :
                            'bg-[var(--glass-surface)] text-[var(--text-secondary)] border border-[var(--glass-border)]'
                          }`}>
                            {cust.plan}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.status === 'active' ? 'bg-[var(--neon-emerald-dim)] text-[var(--neon-emerald)]' : 'bg-[var(--neon-crimson-dim)] text-[var(--neon-crimson)]'
                          }`}>
                            {cust.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div>
                            {cust.requests_limit === -1 ? 'Unlimited' : `${(cust.requests_limit / 1000).toFixed(0)}k/mo`}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">{cust.rate_limit_per_sec} req/sec limit</div>
                        </td>
                        <td className="p-4 text-[var(--text-secondary)]">
                          {cust.billing_cycle_start}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCustomer(cust);
                              setEditPlan(cust.plan);
                              setEditLimit(cust.requests_limit);
                              setEditRate(cust.rate_limit_per_sec);
                              setEditCycle(cust.billing_cycle_start);
                            }}
                            className="px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--glass-border)] text-xs text-[var(--text-primary)] hover:bg-[var(--glass-surface-hover)] transition"
                          >
                            Edit Billing
                          </button>
                          <button
                            onClick={() => handleToggleStatus(cust)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                              cust.status === 'active' 
                                ? 'bg-[var(--neon-crimson-dim)] text-[var(--neon-crimson)] hover:bg-[var(--neon-crimson)] hover:text-white' 
                                : 'bg-[var(--neon-emerald-dim)] text-[var(--neon-emerald)] hover:bg-[var(--neon-emerald)] hover:text-white'
                            }`}
                          >
                            {cust.status === 'active' ? 'Block Access' : 'Restore'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NODES TELEMETRY TAB */}
      {activeTab === 'nodes' && stats && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stats.nodes.map((node, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] border border-[var(--glass-border)] p-6 rounded-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-lg font-outfit text-[var(--text-primary)]">{node.name}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-mono flex items-center gap-1.5">
                      <Globe size={12} />
                      {node.region}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider ${
                    node.status === 'healthy' ? 'bg-[var(--neon-emerald-dim)] text-[var(--neon-emerald)]' :
                    node.status === 'overloaded' ? 'bg-[var(--neon-gold-dim)] text-[var(--neon-gold)] border border-[var(--neon-gold-glow)]' :
                    'bg-[var(--neon-crimson-dim)] text-[var(--neon-crimson)]'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-[var(--glass-border)] py-4 my-2 text-xs font-mono">
                  <div>
                    <span className="text-[var(--text-secondary)] uppercase block text-[10px]">NodeType</span>
                    <span className="font-bold text-[var(--text-primary)] capitalize">{node.type} node</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)] uppercase block text-[10px]">Connections</span>
                    <span className="font-bold text-[var(--text-primary)]">{node.active_connections.toLocaleString()} active</span>
                  </div>
                </div>

                {/* Utilization Sliders */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>CPU Utilization</span>
                      <span className={node.cpu_usage > 80 ? 'text-[var(--neon-gold)] font-bold' : 'text-[var(--text-primary)]'}>
                        {node.cpu_usage}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--bg-void)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          node.cpu_usage > 85 ? 'bg-[var(--neon-gold)]' :
                          node.cpu_usage > 60 ? 'bg-[var(--neon-violet)]' :
                          'bg-[var(--neon-cyan)]'
                        }`}
                        style={{ width: `${node.cpu_usage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>RAM Utilization</span>
                      <span>{node.ram_usage}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-void)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                      <div 
                        className="h-full bg-[var(--neon-cyan)] rounded-full"
                        style={{ width: `${node.ram_usage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENTERPRISE LICENSING TAB */}
      {activeTab === 'licensing' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-card p-8 border border-[var(--glass-border)] rounded-2xl bg-[var(--bg-card)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--glass-border)]">
              <div>
                <h2 className="text-2xl font-black font-outfit text-[var(--text-primary)] flex items-center gap-3">
                  <Shield className="text-[var(--neon-cyan)]" size={26} />
                  Enterprise Sovereign License Authority
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 font-mono">
                  Issue cryptographically signed Ed25519 offline license files for On-Premise & Sovereign deployments.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--neon-emerald-dim)] text-[var(--neon-emerald)] border border-[var(--neon-emerald-glow)]">
                Authority Key: ACTIVE
              </span>
            </div>

            <form onSubmit={handleGenerateLicense} className="max-w-2xl space-y-6">
              {licSuccess && (
                <div className="p-4 rounded-xl bg-[var(--neon-emerald-dim)] border border-[var(--neon-emerald-glow)] text-[var(--neon-emerald)] font-mono text-sm">
                  {licSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] block uppercase font-bold text-[11px]">
                    Customer ID / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACME-GLOBAL-001"
                    value={licCustId}
                    onChange={(e) => setLicCustId(e.target.value)}
                    className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)] font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] block uppercase font-bold text-[11px]">
                    Subscription Tier *
                  </label>
                  <select
                    value={licTier}
                    onChange={(e) => setLicTier(e.target.value)}
                    className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)] font-mono"
                  >
                    <option value="Scout">Scout (WAF Basic)</option>
                    <option value="Sentinel">Sentinel (WAF + ML Inference)</option>
                    <option value="Fortress">Fortress (WAF + ML + Consensus)</option>
                    <option value="IronClad">IronClad / Sovereign (Unlimited Enterprise)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] block uppercase font-bold text-[11px]">
                    License Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={licDays}
                    onChange={(e) => setLicDays(parseInt(e.target.value) || 365)}
                    className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)] font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[var(--text-secondary)] block uppercase font-bold text-[11px]">
                    Hardware Fingerprint (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for auto-generate"
                    value={licHwid}
                    onChange={(e) => setLicHwid(e.target.value)}
                    className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)] font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] space-y-2 text-xs font-mono text-[var(--text-muted)]">
                <p className="font-bold text-[var(--text-secondary)]">🔒 What happens on generate:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Calculates exact expiration epoch and hardware constraints.</li>
                  <li>Cryptographically signs the payload with your master Ed25519 signing key.</li>
                  <li>Automatically downloads the ready-to-deploy <code className="text-[var(--neon-cyan)]">license.json</code> file to your browser.</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={licGenerating}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold font-mono text-sm hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {licGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Signing Cryptographic License...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Generate & Download License File (.json)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-xl p-6 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
              <h3 className="text-xl font-bold font-outfit uppercase tracking-wider text-[var(--text-primary)]">
                Manage Client Billing
              </h3>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="p-1 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateBilling} className="space-y-4 font-mono text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] block uppercase text-[10px]">Client Company</label>
                <input 
                  type="text" 
                  disabled 
                  value={editingCustomer.name}
                  className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded p-2 text-[var(--text-muted)] focus:outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] block uppercase text-[10px]">Select Plan Tier</label>
                <select 
                  value={editPlan} 
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
                >
                  <option value="free">Free ($0)</option>
                  <option value="starter">Starter ($35)</option>
                  <option value="growth">Growth ($120)</option>
                  <option value="pro">Pro ($360)</option>
                  <option value="enterprise">Enterprise ($3,000+)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] block uppercase text-[10px]">Monthly Requests Limit (-1 = Unlimited)</label>
                <input 
                  type="number"
                  value={editLimit}
                  onChange={e => setEditLimit(parseInt(e.target.value))}
                  className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] block uppercase text-[10px]">Per-Second Rate Limit (RPS)</label>
                <input 
                  type="number"
                  value={editRate}
                  onChange={e => setEditRate(parseInt(e.target.value))}
                  className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--text-secondary)] block uppercase text-[10px]">Billing Cycle Start Date (YYYY-MM-DD)</label>
                <input 
                  type="text"
                  value={editCycle}
                  onChange={e => setEditCycle(e.target.value)}
                  className="w-full bg-[var(--bg-void)] border border-[var(--glass-border)] rounded p-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 mt-4 rounded bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Updating Ledger...
                  </>
                ) : (
                  'Commit Changes'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI COPILOT SLIDE OUT DRAWER */}
      {copilotOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-fadeIn flex justify-end">
          <div className="w-full max-w-md bg-[var(--bg-card)] border-l border-[var(--glass-border)] h-full flex flex-col shadow-2xl animate-slideLeft">
            
            {/* Copilot Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-[var(--bg-elevated)]">
              <div className="flex items-center gap-2">
                <Bot className="text-[var(--neon-cyan)]" size={20} />
                <span className="font-bold font-outfit uppercase tracking-wider text-sm text-[var(--text-primary)]">
                  SuperAdmin AI Copilot
                </span>
              </div>
              <button 
                onClick={() => setCopilotOpen(false)}
                className="p-1 rounded bg-[var(--bg-void)] text-[var(--text-secondary)] hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {copilotMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 leading-relaxed border ${
                    msg.sender === 'user' 
                      ? 'bg-[var(--neon-cyan-dim)] border-[var(--neon-cyan-glow)] text-[var(--text-primary)] text-right' 
                      : 'bg-[var(--glass-surface)] border-[var(--glass-border)] text-[var(--text-secondary)] text-left'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex justify-start">
                  <div className="bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-lg p-3 flex items-center gap-2">
                    <RefreshCw className="animate-spin text-[var(--neon-cyan)]" size={12} />
                    <span className="text-[var(--text-muted)]">Consulting database ledger telemetry...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleAskCopilot} className="p-4 border-t border-[var(--glass-border)] bg-[var(--bg-elevated)] flex gap-2">
              <input 
                type="text"
                placeholder="Ask details: e.g. Which node has high load?"
                value={copilotQuery}
                onChange={e => setCopilotQuery(e.target.value)}
                disabled={sendingChat}
                className="flex-1 bg-[var(--bg-void)] border border-[var(--glass-border)] rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-[var(--neon-cyan)] text-[var(--text-primary)]"
              />
              <button
                type="submit"
                disabled={sendingChat || !copilotQuery.trim()}
                className="p-2 rounded-lg bg-[var(--neon-cyan-dim)] text-[var(--neon-cyan)] border border-[var(--neon-cyan-glow)] hover:bg-[var(--neon-cyan)] hover:text-white transition disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
