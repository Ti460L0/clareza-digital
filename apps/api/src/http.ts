import { createServer } from 'node:http';
import { apiJson } from './handler';

export function createApiServer(handle: (request: Request) => Promise<Response>) {
  const server = createServer({ maxHeaderSize: 8192, requestTimeout: 10_000, headersTimeout: 5000 }, async (incoming, outgoing) => {
    const controller = new AbortController();
    outgoing.on('close', () => { if (!outgoing.writableEnded) controller.abort(); });
    const timer = setTimeout(() => { controller.abort(); outgoing.destroy(); }, 30_000);
    try {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of incoming) {
        size += chunk.length;
        if (size > 16_000) {
          outgoing.writeHead(413, { 'Content-Type': 'application/json', Connection: 'close' });
          outgoing.end('{"error":"too_large"}');
          return;
        }
        chunks.push(chunk);
      }
      const headers = new Headers();
      for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      const method = incoming.method ?? 'GET';
      const request = new Request(new URL(incoming.url ?? '/', 'http://localhost'), {
        method, headers, signal: controller.signal,
        body: ['GET', 'HEAD'].includes(method) ? undefined : Buffer.concat(chunks),
      });
      const response = await handle(request);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(await response.text());
    } catch {
      if (!outgoing.headersSent && !outgoing.destroyed) {
        const error = apiJson({ error: 'unavailable' }, 503);
        outgoing.writeHead(error.status, Object.fromEntries(error.headers));
        outgoing.end(await error.text());
      }
    } finally { clearTimeout(timer); }
  });
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 100;
  return server;
}
