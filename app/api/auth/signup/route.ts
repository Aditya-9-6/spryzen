import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, company, plan } = body;

    const res = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, company, plan }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    // Send OTP automatically after successful signup
    await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose: 'signup' }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
