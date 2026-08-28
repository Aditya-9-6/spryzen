import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.SPRYZEN_API_URL || 'http://localhost:3030';

// Streaming AI response — proxies SSE token stream from Rust backend
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('spryzen_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const upstream = await fetch(`${BACKEND_URL}/api/v1/rag/ask`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(body),
        });

        if (!upstream.ok || !upstream.body) {
          controller.enqueue(encoder.encode('Unable to connect to AI engine. Please try again.'));
          controller.close();
          return;
        }

        const reader  = upstream.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          // Parse SSE "data: <token>" and forward raw text
          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.token) controller.enqueue(encoder.encode(parsed.token));
              } catch {
                // pass through raw
                controller.enqueue(encoder.encode(line.slice(6)));
              }
            }
          }
        }
      } catch {
        controller.enqueue(encoder.encode('\n[Error connecting to AI engine]'));
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  });
}
