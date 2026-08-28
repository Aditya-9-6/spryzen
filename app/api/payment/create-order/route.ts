import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const BACKEND_URL         = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

export async function POST(req: NextRequest) {
  try {
    const { amount_paise, plan, currency = 'USD' } = await req.json();

    // 🛠️ If no keys provided yet, operate in zero-friction Mock/Dev mode
    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'mock' || RAZORPAY_KEY_ID.startsWith('rzp_test_placeholder')) {
      const mockOrderId = `order_mock_${crypto.randomBytes(6).toString('hex')}`;
      console.log(`💳 [Razorpay Dev Mode] Created mock order ${mockOrderId} for plan ${plan} (${amount_paise} ${currency})`);
      return NextResponse.json({
        order_id: mockOrderId,
        key_id: RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: amount_paise,
        currency,
        is_mock: true,
      });
    }

    // Call live Razorpay Orders API
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount_paise,
        currency,
        notes: { plan },
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.text();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const order = await rzpRes.json();

    return NextResponse.json({
      order_id: order.id,
      key_id: RAZORPAY_KEY_ID,
      amount: amount_paise,
      currency,
    });
  } catch (err) {
    console.error('create-order error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
