import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

async function authFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('spryzen_token')?.value;
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

// GET /api/portal/notifications
export async function GET(req: NextRequest) {
  const res = await authFetch('/api/v1/notifications').catch(() => null);
  if (!res || !res.ok) {
    return NextResponse.json({ notifications: [] });
  }
  return NextResponse.json(await res.json());
}
