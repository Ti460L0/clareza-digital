const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    ...(status === 429 ? { 'Retry-After': '600' } : {}),
  },
});
async function readBounded(body: ReadableStream<Uint8Array> | null, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  if (!body) return new Uint8Array();
  const reader = body.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw Error('too_large');
      chunks.push(value);
    }
    const result = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
    return result;
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}

// fetcher is injectable only in local tests; no request controls the upstream address.
export async function proxyApi(request: Request, env: Pick<Env, 'PUBLIC_ORIGIN' | 'BACKEND_ORIGIN' | 'API_SHARED_SECRET'>, fetcher: typeof fetch = fetch) {
  const url = new URL(request.url);
  if (!['/api/tutor', '/api/status'].includes(url.pathname) || url.search) return json({ error: 'not_found' }, 404);
  const method = url.pathname === '/api/status' ? 'GET' : 'POST';
  if (request.method !== method) return json({ error: 'method_not_allowed' }, 405);
  if (url.origin !== env.PUBLIC_ORIGIN || request.headers.has('CF-Worker')) return json({ error: 'forbidden' }, 403);
  if (method === 'POST' && request.headers.get('Origin') !== env.PUBLIC_ORIGIN) return json({ error: 'forbidden' }, 403);
  if (method === 'POST' && request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'invalid_request' }, 415);
  if (!env.BACKEND_ORIGIN || !env.API_SHARED_SECRET) return json({ error: 'unavailable' }, 503);
  let backend: URL;
  try {
    backend = new URL(env.BACKEND_ORIGIN);
    if (backend.protocol !== 'https:' || backend.origin !== env.BACKEND_ORIGIN || backend.username || backend.password || backend.origin === url.origin) throw Error();
  } catch { return json({ error: 'unavailable' }, 503); }
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (!clientIp || clientIp.length > 45 || !/^[a-fA-F0-9:.]+$/.test(clientIp)) return json({ error: 'forbidden' }, 403);
  let body: Uint8Array<ArrayBuffer> | undefined;
  try { if (method === 'POST') body = await readBounded(request.body, 16_000); }
  catch { return json({ error: 'too_large' }, 413); }
  try {
    const response = await fetcher(`${backend.origin}${url.pathname}`, {
      method, body, redirect: 'error', signal: AbortSignal.any([request.signal, AbortSignal.timeout(23_000)]),
      headers: {
        'Content-Type': 'application/json', Origin: env.PUBLIC_ORIGIN,
        Authorization: `Bearer ${env.API_SHARED_SECRET}`, 'X-Clareza-Client-IP': clientIp,
      },
    });
    if (!response.ok) {
      await response.body?.cancel();
      return response.status === 429 ? json({ error: 'limited' }, 429) : json({ error: 'unavailable' }, 503);
    }
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(await readBounded(response.body, 32_000)));
    return json(data);
  } catch { return json({ error: 'unavailable' }, 503); }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname.startsWith('/api')) return proxyApi(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
