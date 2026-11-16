import { describe, expect, it, vi } from 'vitest';
import { proxyApi } from '../apps/worker';
const env = { PUBLIC_ORIGIN: 'https://site.example', BACKEND_ORIGIN: 'https://backend.example', API_SHARED_SECRET: 'ficticio-teste-apenas' };
function request(headers: Record<string, string> = {}, path = '/api/tutor', body = '{}') {
  return new Request(`${env.PUBLIC_ORIGIN}${path}`, { method: 'POST', body, headers: {
    Origin: env.PUBLIC_ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers,
  } });
}
describe('proxy Worker com transporte simulado', () => {
  it('constrói cabeçalhos, sem encaminhar autorização, cookies ou IP arbitrários', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ generated: true }));
    const result = await proxyApi(request({ Authorization: 'cliente', Cookie: 'privado', 'X-Clareza-Client-IP': '192.0.2.9', 'X-Forwarded-For': '192.0.2.8' }), env, fetcher);
    expect(result.status).toBe(200);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('https://backend.example/api/tutor');
    const headers = new Headers(init?.headers);
    expect(headers.get('Authorization')).toBe(`Bearer ${env.API_SHARED_SECRET}`);
    expect(headers.get('X-Clareza-Client-IP')).toBe('192.0.2.1');
    expect(headers.has('Cookie')).toBe(false);
    expect(headers.has('X-Forwarded-For')).toBe(false);
    expect(init?.redirect).toBe('error');
  });
  it.each([
    { Origin: 'https://externo.example' }, { 'CF-Worker': 'externo.example' }, { 'CF-Connecting-IP': '' },
  ])('rejeita origem ou fronteira de IP inválida %#', async values => {
    const fetcher = vi.fn<typeof fetch>();
    const headers = Object.fromEntries(Object.entries(values).filter(([,value]) => value !== undefined));
    expect((await proxyApi(request(headers), env, fetcher)).status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each(['http://backend.example', 'https://user:secret@backend.example', 'https://backend.example/path', '', env.PUBLIC_ORIGIN])('recusa destino inseguro ou não configurado %s', async origin => {
    const fetcher = vi.fn<typeof fetch>();
    expect((await proxyApi(request(), { ...env, BACKEND_ORIGIN: origin }, fetcher)).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('limita corpo antes do envio e não encaminha caminhos arbitrários', async () => {
    const fetcher = vi.fn<typeof fetch>();
    expect((await proxyApi(request({}, '/api/tutor', 'a'.repeat(16001)), env, fetcher)).status).toBe(413);
    expect((await proxyApi(request({}, '/api/private'), env, fetcher)).status).toBe(404);
    expect((await proxyApi(request({}, '/api/tutor?destino=outro'), env, fetcher)).status).toBe(404);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('não expõe erro upstream e preserva indicação de limite', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('detalhe privado', { status: 500 }));
    expect(await (await proxyApi(request(), env, fetcher)).json()).toEqual({ error: 'unavailable' });
    fetcher.mockResolvedValue(new Response('detalhe privado', { status: 429 }));
    const limited = await proxyApi(request(), env, fetcher);
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).toBe('600');
  });
  it('rejeita resposta enorme e não exige Origin no GET same-origin', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('a'.repeat(32001)));
    expect((await proxyApi(request(), env, fetcher)).status).toBe(503);
    fetcher.mockResolvedValue(Response.json({ available: false, provider: 'OpenAI' }));
    const status = new Request(`${env.PUBLIC_ORIGIN}/api/status`, { headers: { 'CF-Connecting-IP': '192.0.2.1' } });
    expect((await proxyApi(status, env, fetcher)).status).toBe(200);
  });
});
