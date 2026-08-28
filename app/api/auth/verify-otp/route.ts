import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: otp }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || 'Invalid code' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
