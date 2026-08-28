'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Terminal, Code2, Copy, Check, ArrowRight, Shield, Cpu, Server, Lock } from 'lucide-react';

const SNIPPETS = {
  python: `# 1. Install standard openai client
# pip install openai

import os
from openai import OpenAI

# Point client to Spryzen Sovereign AI Gateway
client = OpenAI(
    base_url="https://gateway.spryzen.cloud/v1",
    api_key="iw_live_your_spryzen_virtual_key"
)

# Traffic is inspected for prompt injections & data exfiltration in <1ms
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Analyze our quarterly security telemetry."}]
)

print(response.choices[0].message.content)`,

  nodejs: `// 1. Install official SDK
// npm install openai

import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://gateway.spryzen.cloud/v1',
  apiKey: process.env.SPRYZEN_VIRTUAL_KEY, // iw_live_...
});

async function main() {
  const completion = await client.chat.completions.create({
    model: 'claude-3-5-sonnet',
    messages: [{ role: 'user', content: 'Generate WAF rules for GraphQL API.' }],
  });

  console.log(completion.choices[0].message.content);
}

main();`,

  curl: `# Direct cURL Inspection Gateway Request
curl -X POST https://gateway.spryzen.cloud/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer iw_live_your_virtual_key" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello Spryzen Security Gateway"}]
  }'`,

  onprem: `# One-Line Bare-Metal / Docker Enterprise Appliance Deployment
curl -fsSL https://get.spryzen.com/install.sh | bash -s -- \\
  --license-key="YOUR_ED25519_SIGNED_LICENSE_OR_KEY"`
};

export default function DocsPage() {
  const [activeLang, setActiveLang] = useState<'python' | 'nodejs' | 'curl' | 'onprem'>('python');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(SNIPPETS[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-300 py-16 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest">Developer Reference</span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Spryzen Integration Guide & SDKs
            </h1>
          </div>
        </div>
        <p className="text-sm text-gray-400 max-w-2xl mb-12">
          Connect your web applications, LLMs, and API origins to Spryzen in 2 lines of code with zero architecture changes.
        </p>

        {/* Integration Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. AI Gateway Proxy</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Swap your SDK <code>baseURL</code> to <code className="text-cyan-400">gateway.spryzen.cloud</code>. Injects stored vault keys and screens prompts in &lt;1ms.
            </p>
            <span className="text-xs font-mono text-cyan-400">Zero Code Refactoring &rarr;</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. DNS CNAME Edge Proxy</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Point your domain CNAME <code>api.yourdomain.com</code> to <code>edge.spryzen.cloud</code> for full Layer 2–9 WAF and DDoS mitigation.
            </p>
            <span className="text-xs font-mono text-purple-400">Full Origin Cloaking &rarr;</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. On-Premise Appliance</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Deploy our pre-compiled Rust binary or Docker container inside your sovereign private VPC with an Ed25519 offline license.
            </p>
            <span className="text-xs font-mono text-emerald-400">100% Air-Gapped &rarr;</span>
          </div>
        </div>

        {/* Interactive Code Switcher */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1322] overflow-hidden shadow-2xl mb-12">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveLang('python')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeLang === 'python' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveLang('nodejs')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeLang === 'nodejs' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                Node.js / TypeScript
              </button>
              <button
                onClick={() => setActiveLang('curl')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeLang === 'curl' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveLang('onprem')}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeLang === 'onprem' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                On-Premise Shell
              </button>
            </div>

            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-xs leading-relaxed text-cyan-300">
              <code>{SNIPPETS[activeLang]}</code>
            </pre>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to Deploy Spryzen?</h3>
            <p className="text-xs text-gray-400">Generate your virtual API key in 30 seconds with no credit card required.</p>
          </div>
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
