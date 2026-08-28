import React from 'react';
import Link from 'next/link';
import { CreditCard, ArrowLeft, Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RefundPage() {
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
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Refund & Cancellation Policy
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-12">
          Last Updated: February 2026 | Fair, Transparent & Automated Cancellation Policy
        </p>

        <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> 1. 14-Day Money-Back Guarantee (SaaS Subscriptions)
            </h2>
            <p>
              We want you to be completely confident in Spryzen. If you subscribe to any of our paid self-service SaaS tiers (<strong>Starter, Growth, Pro</strong>) and find that Spryzen does not meet your technical or security requirements, you may request a <strong>100% full refund within 14 days</strong> of your initial purchase date, no questions asked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-400" /> 2. Subscription Cancellation
            </h2>
            <p>
              You can cancel your subscription at any time with a single click from the <strong>Customer Portal &rarr; Billing &rarr; Cancel Plan</strong> tab:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
              <li>Upon cancellation, your subscription remains active until the end of your current paid billing period.</li>
              <li>You will not be billed again once canceled.</li>
              <li>No cancellation fees or penalties apply.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 3. Refund Processing Timeframes
            </h2>
            <p>
              Once a refund request is approved by our billing team:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400 mt-2">
              <li><strong>Cards & Netbanking (Razorpay / Stripe)</strong>: Refund is credited back to the original payment source within <strong>5 to 7 business days</strong>.</li>
              <li><strong>UPI (India)</strong>: Refund is credited instantly or within 24–48 hours depending on the issuing bank.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" /> 4. On-Premise & Custom Enterprise Licenses
            </h2>
            <p>
              For custom Enterprise Sovereign contracts where signed Ed25519 cryptographic license keys and source code binaries are delivered directly to customer air-gapped infrastructure, refunds are governed by the dedicated Master Services Agreement (MSA) signed between both parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. How to Request a Refund</h2>
            <p>
              To initiate a refund, please send an email from your registered account email to{' '}
              <a href="mailto:support@spryzen.com" className="text-cyan-400 hover:underline font-semibold">
                support@spryzen.com
              </a>{' '}
              with your <strong>Account ID</strong> or <strong>Invoice/Payment ID</strong>. Our billing desk responds within 24 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
