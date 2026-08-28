import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

// Streaming SSE proxy — pipes the Rust backend SSE stream to the client
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('spryzen_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const upstream = await fetch(`${BACKEND_URL}/api/v1/stream/threats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
        });

        if (!upstream.ok || !upstream.body) {
          controller.enqueue(encoder.encode('data: {"error":"Backend stream unavailable"}\n\n'));
          controller.close();
          return;
        }

        const reader = upstream.body.getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        controller.enqueue(encoder.encode('data: {"error":"Stream error"}\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
