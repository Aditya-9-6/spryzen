import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-12">
          Last Updated: February 2026 | Effective Date: Immediately upon account registration
        </p>

        <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing, browsing, or using the Spryzen platform, edge network, APIs, customer portals, or software appliances (&ldquo;Service&rdquo;), provided by Spryzen / IronWall+ (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the Service immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              Spryzen provides high-performance API security, Web Application Firewall (WAF), AI inference gateways, real-time threat intelligence, and on-premise security appliances. We reserve the right to modify, upgrade, or temporarily suspend aspects of the Service to perform essential security maintenance or platform updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Account Registration & Security</h2>
            <p>
              To access the Service, you must create an account. You agree to provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your account credentials and virtual API keys (<code>iw_live_...</code>). You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property & Trade Secret Ownership</h2>
            <p>
              The Service, including all compiled native binaries, container images, eBPF kernel drivers, neural model weights (Phi-3/14B), mathematical formal proofs, and algorithms, are the exclusive intellectual property of Spryzen / Aditya Dahale. All rights not expressly granted are reserved. Zero source code is conveyed or licensed under any agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. On-Premise Software License & Strict Anti-Reverse-Engineering</h2>
            <p className="mb-2">
              For on-premise and private cloud deployments, you are granted a non-exclusive, non-transferable, revocable license strictly bounded to authorized hardware instances. You explicitly agree NOT to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-400">
              <li>Decompile, disassemble, reverse engineer, or attempt to derive the source code from the compiled binary appliances or container layers.</li>
              <li>Attach dynamic debuggers (GDB, LLDB, IDA Pro, Ghidra, Strace) or execute physical RAM memory dumpers against the proxy processes.</li>
              <li>Circumvent or tamper with the cryptographic Ed25519 license validation, TPM 2.0 PCR attestation, or AMD SEV-SNP hardware memory encryption.</li>
              <li>Clone, copy, mirror, or transfer the software appliances to unauthorized hardware nodes, virtual machines, or third parties.</li>
            </ul>
            <p className="mt-2 text-xs text-amber-400/90 font-mono">
              ⚠️ Automated Anti-Tamper Notice: Spryzen contains active kernel-level anti-tracing guards. Detection of unauthorized debugger attachment triggers immediate cryptographic key zeroization and process termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Subscriptions, Metered Overage & Autopay</h2>
            <p>
              Cloud and on-premise subscriptions are billed in advance on a recurring monthly or annual basis via authorized payment gateways (Razorpay, Stripe) or enterprise invoice. Routing requests exceeding included plan quotas are metered via internal eBPF ledgers and billed automatically via Autopay at published rates ($0.15 per 1M extra requests). All add-on modules are hot-swappable and billed on activation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. License Revocation & Termination</h2>
            <p>
              Any breach of intellectual property restrictions, unauthorized software copying, or reverse-engineering attempts will result in immediate, automatic revocation of the license, remote service termination, and pursuit of statutory damages under applicable trade secret and copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Spryzen or its founders be liable for any indirect, incidental, special, or consequential damages. Maximum aggregate liability under any claim shall not exceed the total fees paid by the Customer in the preceding twelve (12) months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Governing Law & Arbitration</h2>
            <p>
              These Terms and any enterprise EULA contracts shall be governed by and construed in accordance with the laws of India, with binding arbitration in Mumbai / Pune, enforceable globally under the New York Convention.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact & Legal Inquiries</h2>
            <p>
              For enterprise licensing agreements, Master Services Agreements (MSA), or legal inquiries, contact our executive team at{' '}
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
