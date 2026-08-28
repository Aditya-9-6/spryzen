import { NextResponse } from 'next/server';

// ─── 2026 MASTER OVERAGE RATES ──────────────────────────────────────────────
const TIER_RATES: Record<string, { included: number; ratePer1M: number }> = {
  starter: { included: 10_000_000, ratePer1M: 0.20 },
  growth: { included: 50_000_000, ratePer1M: 0.15 },
  pro: { included: 200_000_000, ratePer1M: 0.12 },
  enterprise: { included: 1_000_000_000, ratePer1M: 0.10 },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tenant_id, plan_id, total_requests, auto_debit = true } = body;

    if (!tenant_id || !plan_id || total_requests === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: tenant_id, plan_id, total_requests' },
        { status: 400 }
      );
    }

    const tierConfig = TIER_RATES[plan_id.toLowerCase()] || TIER_RATES.starter;
    const overageRequests = Math.max(0, total_requests - tierConfig.included);
    const overageAmountUSD = (overageRequests / 1_000_000) * tierConfig.ratePer1M;
    const overageAmountINR = Math.round(overageAmountUSD * 86.5 * 100); // Amount in paise for Razorpay

    let paymentResult = null;

    // Trigger Razorpay Autopay / Order creation if overage exists
    if (overageRequests > 0 && auto_debit && process.env.RAZORPAY_KEY_SECRET) {
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

      if (razorpayKeyId && razorpaySecret && razorpaySecret !== 'mock') {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.max(100, overageAmountINR), // Minimum 100 paise (₹1)
            currency: 'INR',
            receipt: `overage_${tenant_id}_${Date.now()}`,
            notes: {
              tenant_id,
              plan_id,
              overage_requests: overageRequests.toString(),
              overage_usd: overageAmountUSD.toFixed(2),
              autopay_type: 'metered_overage',
            },
          }),
        });

        if (response.ok) {
          paymentResult = await response.json();
        }
      }
    }

    return NextResponse.json({
      success: true,
      tenant_id,
      plan_id,
      total_requests,
      included_requests: tierConfig.included,
      overage_requests: overageRequests,
      overage_rate_per_1m: `$${tierConfig.ratePer1M.toFixed(2)}`,
      overage_amount_usd: `$${overageAmountUSD.toFixed(4)}`,
      autopay_status: paymentResult ? 'CHARGED_OR_ORDER_CREATED' : (overageRequests > 0 ? 'PENDING_RECONCILIATION' : 'NO_OVERAGE'),
      razorpay_order_id: paymentResult?.id || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process overage autopay', details: error.message },
      { status: 500 }
    );
  }
}
