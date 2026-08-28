'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Lock, Globe, Key, Bell, Users, Eye, EyeOff, ShieldAlert, Check,
  ChevronRight, RefreshCcw, LogOut, Trash2, Download
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'routing' | 'security' | 'api' | 'notifications' | 'team'>('profile');
  const [apiKey, setApiKey] = useState('spz_live_53a623a22414433f922aca687056888b');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Aditya',
    email: 'aditya@spryzen.plus',
    company: 'Sovereign Lab India',
    role: 'System Administrator'
  });

  // Routing config state
  const [routing, setRouting] = useState({
    domain: 'https://sovereignlab.in',
    originIp: '198.51.100.42',
    originPort: '443',
    protocol: 'https',
    headerName: 'X-Spryzen-Origin-Auth',
    headerValue: 't5a623a22414433f922a'
  });

  // Notification toggles
  const [notifyPrefs, setNotifyPrefs] = useState({
    critical: true,
    warning: true,
    invoice: true,
    report: true,
    newsletter: false
  });

  // Team state
  const [team, setTeam] = useState([
    { id: 1, name: 'Aditya', email: 'aditya@spryzen.plus', role: 'Owner', active: true },
    { id: 2, name: 'Karan Singh', email: 'karan@spryzen.plus', role: 'Security Analyst', active: true },
    { id: 3, name: 'Priya Nair', email: 'priya@spryzen.plus', role: 'Observer (Read-Only)', active: false },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('analyst');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleRegenApiKey = () => {
    if (confirm('Are you absolutely sure you want to regenerate your live API key? All current proxies using this key will immediately fail validation.')) {
      setApiKey(`spz_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`);
      alert('API key regenerated successfully. Please update your environment configurations.');
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole === 'analyst' ? 'Security Analyst' : 'Observer (Read-Only)',
      active: false
    };
    setTeam([...team, newMember]);
    setInviteEmail('');
    alert(`Invitation sent to ${inviteEmail}`);
  };

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', marginBottom: '0.375rem' }}>
          System Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your fortress preferences, traffic routing rules, API credentials, and seats
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {[
            { id: 'profile', label: 'Client Profile', icon: User },
            { id: 'routing', label: 'Traffic Routing', icon: Globe },
            { id: 'security', label: 'Credentials & Security', icon: Lock },
            { id: 'api', label: 'Access Keys', icon: Key },
            { id: 'notifications', label: 'Notification Rules', icon: Bell },
            { id: 'team', label: 'Team Seats', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                  border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                  background: active ? 'var(--neon-cyan-dim)' : 'transparent',
                  color: active ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="glass-card" style={{ padding: '2.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet))' }} />

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h2 className="text-h3" style={{ marginBottom: '1.5rem' }}>Client Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Registered Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="input"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label className="label">Company / Business Name</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Assigned Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="input"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Saving...' : saveSuccess ? 'Profile Saved ✓' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TRAFFIC ROUTING */}
          {activeTab === 'routing' && (
            <form onSubmit={handleSave}>
              <h2 className="text-h3" style={{ marginBottom: '0.375rem' }}>Traffic Routing</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Configure where our reverse-proxy shield forwards filtered clean traffic
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="label">Protected Domain</label>
                  <input
                    type="text"
                    value={routing.domain}
                    onChange={(e) => setRouting({ ...routing, domain: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Origin Host / Server IP</label>
                  <input
                    type="text"
                    value={routing.originIp}
                    onChange={(e) => setRouting({ ...routing, originIp: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Origin Port</label>
                  <input
                    type="text"
                    value={routing.originPort}
                    onChange={(e) => setRouting({ ...routing, originPort: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Forwarding Protocol</label>
                  <select
                    value={routing.protocol}
                    onChange={(e) => setRouting({ ...routing, protocol: e.target.value })}
                    className="input"
                    style={{ background: 'var(--bg-surface)' }}
                  >
                    <option value="https">HTTPS (Recommended)</option>
                    <option value="http">HTTP Plain</option>
                  </select>
                </div>
              </div>

              <div className="terminal" style={{ marginBottom: '1.5rem', background: '#030305' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Inject Origin Authentication Headers
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                  <div>
                    <label className="label" style={{ fontSize: '0.65rem' }}>Header Name</label>
                    <input
                      type="text"
                      value={routing.headerName}
                      onChange={(e) => setRouting({ ...routing, headerName: e.target.value })}
                      className="input"
                      style={{ padding: '0.4rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label className="label" style={{ fontSize: '0.65rem' }}>Header Value / Token</label>
                    <input
                      type="text"
                      value={routing.headerValue}
                      onChange={(e) => setRouting({ ...routing, headerValue: e.target.value })}
                      className="input"
                      style={{ padding: '0.4rem', fontSize: '0.75rem', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Syncing Network Configuration...' : saveSuccess ? 'Network Configurations Deployed ✓' : 'Deploy Configurations'}
                </button>
              </div>
            </form>
          )}

          {/* CREDENTIALS & SECURITY */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-h3" style={{ marginBottom: '1.5rem' }}>Credentials & Security</h2>

              <div className="space-y-6">
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>Password Alteration</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <input type="password" placeholder="Existing Password" className="input" />
                    <input type="password" placeholder="New Password" className="input" />
                    <input type="password" placeholder="Confirm Password" className="input" />
                  </div>
                  <button className="btn btn-secondary btn-sm">Update Password</button>
                </div>

                <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', margin: '1.5rem 0' }} />

                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--neon-crimson)' }}>
                    Active Sessions (DEFCON-1 Dashboard Access)
                  </h4>
                  <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
                    <table className="data-table" style={{ width: '100%', fontSize: '0.8rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                          <th style={{ padding: '0.75rem' }}>DEVICE / LOCATION</th>
                          <th style={{ padding: '0.75rem' }}>IP ADDRESS</th>
                          <th style={{ padding: '0.75rem' }}>LAST ACTION</th>
                          <th style={{ padding: '0.75rem' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '0.75rem' }}>Windows (Chrome) · Bengaluru</td>
                          <td style={{ padding: '0.75rem' }}>103.117.20.144</td>
                          <td style={{ padding: '0.75rem', color: 'var(--neon-emerald)', fontWeight: 600 }}>Active (Current Session)</td>
                          <td style={{ padding: '0.75rem' }}>—</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.75rem' }}>Linux Server Proxy Instance</td>
                          <td style={{ padding: '0.75rem' }}>198.51.100.42</td>
                          <td style={{ padding: '0.75rem' }}>4 hours ago</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button className="btn btn-sm btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                              Revoke
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCESS KEYS */}
          {activeTab === 'api' && (
            <div>
              <h2 className="text-h3" style={{ marginBottom: '0.375rem' }}>Access Keys</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Use this credential to verify your local proxy nodes with Spryzen&apos;s live billing and consensus database
              </p>

              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
                <label className="label" style={{ fontSize: '0.7rem' }}>L7 PROXY ENDPOINT LIVE ACCESS KEY</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    disabled
                    className="input"
                    style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', background: '#000', border: '1px solid var(--glass-border-strong)' }}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.75rem' }}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(apiKey); alert('API key copied to clipboard!'); }}
                    className="btn btn-secondary btn-sm"
                  >
                    Copy Key
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Created on May 20, 2026 · Never expires
                  </div>
                  <button
                    onClick={handleRegenApiKey}
                    className="btn btn-sm btn-danger"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <RefreshCcw size={12} />
                    Regenerate Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION RULES */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSave}>
              <h2 className="text-h3" style={{ marginBottom: '0.375rem' }}>Notification Rules</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Define what security events trigger immediate email/in-app DEFCON warnings
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { key: 'critical', title: 'DEFCON-1 Critical Incidents', desc: 'Alert immediately via Email + SMS if traffic patterns trigger a level 8+ anomaly score (coordinates brute force/WAF breaches)' },
                  { key: 'warning', title: 'Resource & Quota Thresholds', desc: 'Alert when monthly request usage crosses 80% and 95% of plan capacity limits' },
                  { key: 'invoice', title: 'Billing & Invoice Confirmations', desc: 'Receive Razorpay invoice receipts and bank transfer confirmation receipt reports' },
                  { key: 'report', title: 'Monthly Security Audit PDF', desc: 'Notify instantly as soon as our automated compliance generator produces your monthly report' },
                  { key: 'newsletter', title: 'Spryzen System Product Releases', desc: 'Receive occasional releases, patch summaries, and technical guidelines updates' }
                ].map(pref => (
                  <div key={pref.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>{pref.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>{pref.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifyPrefs as any)[pref.key]}
                      onChange={(e) => setNotifyPrefs({ ...notifyPrefs, [pref.key]: e.target.checked })}
                      style={{
                        width: '42px', height: '22px', appearance: 'none', background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-full)', border: '1px solid var(--glass-border)',
                        position: 'relative', cursor: 'pointer', outline: 'none', transition: 'background 0.2s',
                        alignSelf: 'center'
                      }}
                      className="toggle-switch"
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Deploying Rules...' : saveSuccess ? 'Notification Preferences Saved ✓' : 'Save Rules'}
                </button>
              </div>
            </form>
          )}

          {/* TEAM SEATS */}
          {activeTab === 'team' && (
            <div>
              <h2 className="text-h3" style={{ marginBottom: '0.375rem' }}>Team Seats</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Invite secondary administrators and security analysts to view the war-room
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label className="label">Invite Member Email</label>
                    <input
                      type="email"
                      required
                      placeholder="analyst@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Assigned Privilege Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="input"
                      style={{ background: 'var(--bg-surface)', minWidth: '180px' }}
                    >
                      <option value="analyst">Security Analyst</option>
                      <option value="observer">Observer (Read-Only)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Invite Member
                  </button>
                </form>
              </div>

              <div className="table-wrapper">
                <table className="data-table" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '0.75rem' }}>MEMBER NAME</th>
                      <th style={{ padding: '0.75rem' }}>EMAIL ADDRESS</th>
                      <th style={{ padding: '0.75rem' }}>ROLE PRIVILEGES</th>
                      <th style={{ padding: '0.75rem' }}>CONNECTION STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map(member => (
                      <tr key={member.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{member.name}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{member.email}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${member.role.includes('Owner') ? 'badge-cyan' : member.role.includes('Analyst') ? 'badge-violet' : 'badge-muted'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ color: member.active ? 'var(--neon-emerald)' : 'var(--text-muted)' }}>
                            {member.active ? '● Connected' : '○ Invited'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
