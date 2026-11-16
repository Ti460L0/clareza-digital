import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import type { Config } from './config';
import { LimitError, reserveCost, type UsageLedger } from './limits';
import { boundedJson, maxOutputTokens, providerBody } from './openai';
import { parseRequest, retrieve, validateOutput, type Provider } from './tutor';

export const apiJson = (data: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra },
});
const failure = (code: string, status: number, extra = {}) => apiJson({ error: code }, status, extra);
function authorized(request: Request, config: Config) {
  const actual = Buffer.from(request.headers.get('Authorization') ?? '');
  const expected = Buffer.from(`Bearer ${config.API_SHARED_SECRET}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function clientKey(ip: string, secret: string, now: number) {
  // Coalesce equivalent textual IPv6 addresses before hashing; no raw IP is persisted.
  const canonical = isIP(ip) === 6 ? new URL(`http://[${ip}]/`).hostname : ip;
  return createHmac('sha256', secret).update(`${new Date(now).toISOString().slice(0, 10)}:${canonical}`).digest('hex');
}
export function createHandler(config: Config, ledger: Pick<UsageLedger, 'reserve' | 'finish'>, provider?: Provider, clock = Date.now) {
  return async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') return apiJson({ ok: true });
    if (!['/api/tutor', '/api/status'].includes(url.pathname) || url.search) return failure('not_found', 404);
    if (!authorized(request, config) || request.headers.get('Origin') !== config.PUBLIC_ORIGIN) return failure('forbidden', 403);
    if (url.pathname === '/api/status' && request.method === 'GET') return apiJson({ available: config.enabled && !!provider, provider: 'OpenAI' });
    if (request.method !== 'POST' || url.pathname !== '/api/tutor') return failure('method_not_allowed', 405, { Allow: url.pathname === '/api/status' ? 'GET' : 'POST' });
    if (!config.enabled || !provider) return failure('unavailable', 503);
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return failure('invalid_request', 415);
    const ip = request.headers.get('X-Clareza-Client-IP') ?? '';
    if (!isIP(ip)) return failure('forbidden', 403);
    const length = request.headers.get('Content-Length');
    if (length && (!/^\d+$/.test(length) || Number(length) > 16_000)) return failure('too_large', 413);
    let input;
    try { input = parseRequest(await boundedJson(request, 16_000)); }
    catch { return failure('invalid_request', 400); }
    const retrieved = retrieve(input);
    if (!retrieved.length) return apiJson({
      kind: 'insufficient', generated: false, references: [],
      answer: 'Não encontrei uma referência nas aulas para explicar isso com segurança. Reformule sua dúvida ou abra uma aula relacionada.',
    });
    let reservation: string;
    try {
      const amount = reserveCost(providerBody(config.AI_MODEL, input, retrieved), config.INPUT_USD_PER_MILLION, config.OUTPUT_USD_PER_MILLION, maxOutputTokens);
      reservation = ledger.reserve(clientKey(ip, config.CLIENT_HASH_SECRET, clock()), amount, clock());
    } catch (error) {
      if (error instanceof LimitError && ['rate', 'busy'].includes(error.code)) return failure('limited', 429, { 'Retry-After': '600' });
      return failure('unavailable', 503);
    }
    try {
      const result = await provider.generate(input, retrieved, request.signal);
      return apiJson({ ...validateOutput(result, retrieved), generated: true });
    } catch { return failure('unavailable', 503); }
    finally {
      // A failed release must never refund cost or expose the underlying database error.
      try { ledger.finish(reservation); } catch { /* lease expires conservatively */ }
    }
  };
}
