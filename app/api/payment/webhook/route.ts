import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const BACKEND_URL         = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

// Razorpay Webhook handler
export async function POST(req: NextRequest) {
  try {
    const body      = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature (HMAC-SHA256)
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expected) {
      console.warn('Razorpay webhook signature mismatch');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Forward to Rust backend for DB update
    await fetch(`${BACKEND_URL}/api/v1/payment/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-webhook-verified': 'true' },
      body: JSON.stringify(event),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
