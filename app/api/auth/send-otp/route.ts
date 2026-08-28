import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'signup' }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
