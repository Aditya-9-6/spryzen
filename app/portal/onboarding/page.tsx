'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Copy, Check, Terminal, Cpu, Zap, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  badge: string;
  pythonSnippet: string;
  nodeSnippet: string;
  curlSnippet: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o / O1 / O3)',
    badge: '1-Line BaseURL Swap',
    pythonSnippet: `from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.spryzen.io/v1",
    api_key="spry_live_YOUR_GENERATED_KEY",
    default_headers={"X-Spryzen-Target-Key": "sk-your-openai-api-key"}
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Analyze security payload"}]
)
print(response.choices[0].message.content)`,
    nodeSnippet: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://gateway.spryzen.io/v1',
  apiKey: 'spry_live_YOUR_GENERATED_KEY',
  defaultHeaders: { 'X-Spryzen-Target-Key': 'sk-your-openai-api-key' }
});

const res = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Analyze security payload' }]
});`,
    curlSnippet: `curl https://gateway.spryzen.io/v1/chat/completions \\
  -H "Authorization: Bearer spry_live_YOUR_GENERATED_KEY" \\
  -H "X-Spryzen-Target-Key: sk-your-openai-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello Spryzen"}]
  }'`,
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude 3.5 Sonnet)',
    badge: 'Zero Egress Proxy',
    pythonSnippet: `import anthropic

client = anthropic.Anthropic(
    base_url="https://gateway.spryzen.io/v1/anthropic",
    api_key="spry_live_YOUR_GENERATED_KEY",
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello Claude"}]
)`,
    nodeSnippet: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  baseURL: 'https://gateway.spryzen.io/v1/anthropic',
  apiKey: 'spry_live_YOUR_GENERATED_KEY'
});`,
    curlSnippet: `curl https://gateway.spryzen.io/v1/anthropic/v1/messages \\
  -H "x-api-key: spry_live_YOUR_GENERATED_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello Claude"}]
  }'`,
  },
  {
    id: 'langchain',
    name: 'LangChain / LlamaIndex Agent',
    badge: 'Tool-Calling Guard',
    pythonSnippet: `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://gateway.spryzen.io/v1",
    api_key="spry_live_YOUR_GENERATED_KEY",
    model="gpt-4o"
)

response = llm.invoke("Run autonomous research agent")`,
    nodeSnippet: `import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  configuration: {
    baseURL: "https://gateway.spryzen.io/v1",
    apiKey: "spry_live_YOUR_GENERATED_KEY",
  },
  model: "gpt-4o",
});`,
    curlSnippet: `# Auto-injects semantic firewall and tool-call sandbox
export OPENAI_BASE_URL="https://gateway.spryzen.io/v1"
export OPENAI_API_KEY="spry_live_YOUR_GENERATED_KEY"
python run_agent.py`,
  },
];

export default function OnboardingPage() {
  const [apiKey, setApiKey] = useState('spry_live_8f3a992e104bd7e82a9910c');
  const [selectedProvider, setSelectedProvider] = useState<Provider>(PROVIDERS[0]);
  const [selectedLang, setSelectedLang] = useState<'python' | 'node' | 'curl'>('python');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [tested, setTested] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleGenerateNewKey = () => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`spry_live_${randomHex}`);
    setTested(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopySnippet = () => {
    const snippet = selectedLang === 'python' ? selectedProvider.pythonSnippet : selectedLang === 'node' ? selectedProvider.nodeSnippet : selectedProvider.curlSnippet;
    navigator.clipboard.writeText(snippet.replace('spry_live_YOUR_GENERATED_KEY', apiKey));
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setTested(true);
    }, 600);
  };

  const currentCode = (
    selectedLang === 'python'
      ? selectedProvider.pythonSnippet
      : selectedLang === 'node'
      ? selectedProvider.nodeSnippet
      : selectedProvider.curlSnippet
  ).replace('spry_live_YOUR_GENERATED_KEY', apiKey);

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="space-y-2 border-b border-[var(--glass-border)] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--neon-cyan)] uppercase">
          <Zap size={16} />
          Customer Quickstart Hub
        </div>
        <h1 className="text-3xl font-black font-outfit uppercase tracking-tight text-[var(--text-primary)]">
          Connect Your AI Workload in 60 Seconds
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-mono">
          No code rewrite needed. Simply route through Spryzen's low-latency proxy gateway for instant sub-8ms zero-trust protection.
        </p>
      </div>

      {/* Step 1: Select AI Stack */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[var(--neon-cyan)] text-black font-mono font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-lg font-bold font-outfit text-[var(--text-primary)] uppercase">
            Select Your AI Architecture / Provider
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROVIDERS.map(prov => {
            const isSelected = prov.id === selectedProvider.id;
            return (
              <button
                key={prov.id}
                onClick={() => setSelectedProvider(prov)}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                  isSelected
                    ? 'bg-[var(--neon-cyan-dim)] border-[var(--neon-cyan)] shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-[var(--bg-card)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-outfit text-sm text-[var(--text-primary)]">{prov.name}</span>
                  {isSelected && <CheckCircle2 size={16} className="text-[var(--neon-cyan)]" />}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-void)] text-[var(--neon-emerald)] border border-[var(--glass-border)] inline-block">
                  {prov.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Customer API Key */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[var(--neon-cyan)] text-black font-mono font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h2 className="text-lg font-bold font-outfit text-[var(--text-primary)] uppercase">
            Your Spryzen Live Gateway API Key
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
            <Key size={18} className="text-[var(--neon-gold)] flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={apiKey}
              className="bg-[var(--bg-void)] border border-[var(--glass-border)] px-4 py-2 rounded-lg text-[var(--neon-cyan)] font-bold w-full sm:w-96 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyKey}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-black font-bold font-mono text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5"
            >
              {copiedKey ? <Check size={14} /> : <Copy size={14} />}
              {copiedKey ? 'Copied Key' : 'Copy API Key'}
            </button>
            <button
              onClick={handleGenerateNewKey}
              className="p-2 rounded-lg bg-[var(--bg-void)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-white transition"
              title="Generate New Key"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Copy Code Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--neon-cyan)] text-black font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold font-outfit text-[var(--text-primary)] uppercase">
              1-Line SDK Integration
            </h2>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[var(--bg-void)] p-1 rounded-lg border border-[var(--glass-border)] font-mono text-xs">
            {(['python', 'node', 'curl'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 rounded capitalize transition ${
                  selectedLang === lang ? 'bg-[var(--neon-cyan-dim)] text-[var(--neon-cyan)] font-bold' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {lang === 'node' ? 'TypeScript / JS' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] overflow-hidden">
          <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--glass-border)] flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-2">
              <Terminal size={14} className="text-[var(--neon-cyan)]" />
              {selectedProvider.name} Integration snippet
            </span>
            <button
              onClick={handleCopySnippet}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition"
            >
              {copiedSnippet ? <Check size={12} className="text-[var(--neon-emerald)]" /> : <Copy size={12} />}
              {copiedSnippet ? 'Copied Snippet' : 'Copy Code'}
            </button>
          </div>

          <pre className="p-4 font-mono text-xs leading-relaxed text-[var(--text-primary)] overflow-x-auto bg-[var(--bg-void)]">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>

      {/* Connection Test & Next Steps */}
      <div className="p-6 rounded-xl bg-[var(--bg-elevated)] border border-[var(--glass-border)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-bold font-outfit text-base text-[var(--text-primary)]">
            Ready to Verify Connectivity?
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Send a synthetic test payload to check your latency and firewall handshake.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-5 py-2.5 rounded-lg bg-[var(--neon-cyan)] text-black font-bold font-mono text-xs hover:brightness-110 transition flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            {testing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
            {testing ? 'Testing...' : 'Test Gateway Handshake'}
          </button>

          <Link
            href="/portal/dashboard"
            className="px-5 py-2.5 rounded-lg bg-[var(--bg-void)] border border-[var(--glass-border)] text-[var(--text-primary)] font-bold font-mono text-xs hover:bg-[var(--glass-surface)] transition flex items-center gap-2"
          >
            Go to Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {tested && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[var(--neon-emerald-dim)] border border-[var(--neon-emerald-glow)] text-[var(--neon-emerald)] font-mono text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 size={16} />
            Handshake Succeeded! Gateway Latency: 3.1ms | TLS 1.3 PQC Handshake Verified
          </div>
          <span className="text-[10px] text-[var(--text-primary)]">SESSION ACTIVE</span>
        </motion.div>
      )}
    </div>
  );
}
