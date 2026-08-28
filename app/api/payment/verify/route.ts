import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id, email, customer_name } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret || secret === 'mock') {
      // Mock mode for local testing
      return NextResponse.json({
        success: true,
        verified: true,
        mock: true,
        license_token: `SPRYZEN-LIC-${Date.now()}`,
        message: 'Mock payment verified successfully.',
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // 1. Verify HMAC-SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    // 2. Generate Cryptographic License Token for the customer
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + 365 * 86400; // 1-year default
    const licenseId = `SPRYZEN-LIC-${crypto.createHash('sha256').update(`${email}-${issuedAt}`).digest('hex').substring(0, 12).toUpperCase()}`;

    const licensePayload = {
      client_name: customer_name || email || 'Valued Customer',
      license_id: licenseId,
      issued_at: issuedAt,
      expires_at: expiresAt,
      plan_id: plan_id || 'starter',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      status: 'ACTIVE_PAID',
    };

    return NextResponse.json({
      success: true,
      verified: true,
      license: licensePayload,
      message: 'Payment verified and license activated successfully!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    );
  }
}
