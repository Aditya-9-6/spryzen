import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Database, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-gray-300 py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-12">
          Last Updated: February 2026 | Strict Zero-Data-Retention Policy for In-Flight Traffic
        </p>

        <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-cyan-400" /> 1. Zero-Retention Traffic Privacy Architecture
            </h2>
            <p>
              Spryzen operates under a foundational principle of <strong>Zero Data Retention (ZDR)</strong> for customer payload traffic. When HTTP/HTTPS, gRPC, or WebSocket traffic traverses our edge network:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
              <li>Request and response bodies are inspected in volatile memory (RAM) only by our streaming parser and AI classifiers.</li>
              <li>Payloads are <strong>never stored, logged to disk, or cached</strong> without explicit customer-configured logging rules.</li>
              <li>Customer LLM prompts and completions passing through our AI Gateway are never used to train our models or any third-party models.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" /> 2. Information We Collect
            </h2>
            <p className="mb-2">We collect only the minimum metadata necessary to provide, secure, and invoice the Service:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li><strong>Account Data</strong>: Name, business email address, company name, and hashed credentials.</li>
              <li><strong>Billing Information</strong>: Payment transaction tokens, payment IDs, and tax IDs processed through our PCI-DSS compliant partners (Razorpay, Stripe). We never store raw credit card numbers.</li>
              <li><strong>Operational Telemetry</strong>: High-level metrics such as request volume, blocked threat counts, origin response latency, and token consumption aggregates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> 3. Data Protection & Cryptographic Vaults
            </h2>
            <p>
              All customer API keys (OpenAI, Anthropic, Custom LLMs) saved in our platform are encrypted at rest using <strong>Spryzen Vault</strong> with AES-256-GCM / ChaCha20-Poly1305 hardware-grade encryption. Decryption occurs exclusively in isolated memory at the exact moment of upstream proxy forwarding.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Information Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or monetize your personal or organization data. Data is shared solely with trusted service providers required to deliver the Service:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
              <li>Payment gateways (Razorpay, Stripe) for subscription billing.</li>
              <li>Transactional email providers (Resend) for OTP authentication codes and security receipts.</li>
              <li>Infrastructure hosting providers (AWS, Hetzner, GCP) for dedicated edge compute nodes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention & Account Deletion</h2>
            <p>
              You may request complete deletion of your account, organizations, virtual keys, and associated metadata at any time by navigating to <em>Settings &rarr; Delete Organization</em> in your portal or by emailing{' '}
              <a href="mailto:privacy@spryzen.com" className="text-cyan-400 hover:underline">
                privacy@spryzen.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact Our Privacy Officer</h2>
            <p>
              For any questions regarding GDPR, CCPA, or data governance, reach out to our team at{' '}
              <a href="mailto:support@spryzen.com" className="text-cyan-400 hover:underline">
                support@spryzen.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
