import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('spryzen_token')?.value;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
}

// GET /api/portal/stats
export async function GET(req: NextRequest) {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${BACKEND_URL}/api/info`, { headers });
    if (!res.ok) return NextResponse.json({}, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}
