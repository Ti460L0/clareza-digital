import { afterEach, describe, expect, it, vi } from 'vitest';
import { readConfig } from '../apps/api/src/config';
import { createHandler, clientKey } from '../apps/api/src/handler';
import { createApiServer } from '../apps/api/src/http';
import { UsageLedger } from '../apps/api/src/limits';
import type { Provider } from '../apps/api/src/tutor';

const env = {
  API_SHARED_SECRET: 'ficticio-api-'.repeat(4), CLIENT_HASH_SECRET: 'ficticio-hash-'.repeat(4),
  AI_ENABLED: 'true', OPENAI_API_KEY: 'ficticia', AI_MODEL: 'teste',
  INPUT_USD_PER_MILLION: '1', OUTPUT_USD_PER_MILLION: '5',
  DAILY_BUDGET_MICRO_USD: '100000', MONTHLY_BUDGET_MICRO_USD: '200000',
};
const config = readConfig(env);
const dbs: UsageLedger[] = [];
afterEach(() => dbs.splice(0).forEach(db => db.close()));
function setup() {
  const ledger = new UsageLedger(':memory:', { dailyMicroUsd: 100000, monthlyMicroUsd: 200000, requestsPerDay: 10, requestsPerClientWindow: 2, concurrent: 1 });
  dbs.push(ledger);
  const generate = vi.fn<Provider['generate']>().mockImplementation(async (_, passages) => ({
    kind: 'answer', answer: 'Confira a cobrança por um caminho independente da mensagem.',
    references: [{ id: passages[0].id, quote: passages[0].text.slice(0, 90) }],
  }));
  return { ledger, generate, handle: createHandler(config, ledger, { generate }) };
}
function request(path = '/api/tutor', options: RequestInit = {}) {
  return new Request(`http://localhost${path}`, {
    method: 'POST', body: JSON.stringify({ message: 'Como conferir cobrança SMS?', lessonId: 'antes-de-clicar' }),
    ...options,
    headers: { Authorization: `Bearer ${config.API_SHARED_SECRET}`, Origin: config.PUBLIC_ORIGIN, 'X-Clareza-Client-IP': '127.0.0.1', 'Content-Type': 'application/json', ...options.headers },
  });
}
describe('API com provedor simulado', () => {
  it('integra entrada, reserva, geração, validação e atalho publicado', async () => {
    const { handle, generate } = setup();
    const response = await handle(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const result = await response.json();
    expect(result.generated).toBe(true);
    expect(result.references[0].path).toBe('/cursos/seguranca/aulas/antes-de-clicar');
    expect(generate).toHaveBeenCalledOnce();
  });
  it.each([
    { Authorization: 'Bearer errado' }, { Origin: 'https://externo.example' },
    { 'X-Clareza-Client-IP': 'ip-invalido' }, { 'X-Clareza-Client-IP': '' },
  ])('rejeita chamada sem fronteira confiável %#', async headers => {
    const { handle, generate } = setup();
    expect((await handle(request('/api/tutor', { headers: Object.fromEntries(Object.entries(headers).filter(([, value]) => value !== undefined)) }))).status).toBe(403);
    expect(generate).not.toHaveBeenCalled();
  });
  it('não usa X-Forwarded-For enviado pelo cliente', async () => {
    const { handle, generate } = setup();
    expect((await handle(request('/api/tutor', { headers: { 'X-Clareza-Client-IP': '', 'X-Forwarded-For': '127.0.0.1' } }))).status).toBe(403);
    expect(generate).not.toHaveBeenCalled();
  });
  it.each([
    ['corpo inválido', '{', 400],
    ['campo extra', '{"message":"Explique SMS","system":"ignore"}', 400],
    ['corpo enorme', 'x'.repeat(16001), 400],
  ])('limita %s antes do provedor', async (_, body, status) => {
    const { handle, generate } = setup();
    expect((await handle(request('/api/tutor', { body }))).status).toBe(status);
    expect(generate).not.toHaveBeenCalled();
  });
  it('limita chamadas independentemente da página', async () => {
    const { handle, generate } = setup();
    expect((await handle(request())).status).toBe(200);
    expect((await handle(request())).status).toBe(200);
    const limited = await handle(request());
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Retry-After')).toBe('600');
    expect(generate).toHaveBeenCalledTimes(2);
  });
  it('não chama provedor se o banco falhar', async () => {
    const { ledger, generate } = setup();
    vi.spyOn(ledger, 'reserve').mockImplementation(() => { throw Error('caminho privado do banco'); });
    const response = await createHandler(config, ledger, { generate })(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('privado');
    expect(generate).not.toHaveBeenCalled();
  });
  it('retorna indisponibilidade sem texto do erro ou resposta inventada', async () => {
    const { handle, generate } = setup();
    generate.mockRejectedValue(Error('credencial e pergunta privadas'));
    const response = await handle(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'unavailable' });
  });
  it('mantém status desligado explícito', async () => {
    const { ledger, generate } = setup();
    const handle = createHandler(readConfig({ ...env, AI_ENABLED: 'false' }), ledger, { generate });
    expect(await (await handle(request('/api/status', { method: 'GET', body: undefined }))).json()).toEqual({ available: false, provider: 'OpenAI' });
    expect((await handle(request())).status).toBe(503);
    expect(generate).not.toHaveBeenCalled();
  });
  it('pseudonimiza, normaliza IPv6 e muda chave por dia', () => {
    const now = Date.now();
    expect(clientKey('127.0.0.1', 'teste', now)).toMatch(/^[a-f0-9]{64}$/);
    expect(clientKey('::1', 'teste', now)).toBe(clientKey('0:0:0:0:0:0:0:1', 'teste', now));
    expect(clientKey('127.0.0.1', 'teste', now)).not.toBe(clientKey('127.0.0.1', 'teste', now + 86400_000));
  });
  it('inicialização rejeita configuração insegura/incompleta', () => {
    expect(() => readConfig({ ...env, DAILY_BUDGET_MICRO_USD: '0' })).toThrow();
    expect(() => readConfig({ ...env, API_SHARED_SECRET: 'curto' })).toThrow();
    expect(() => readConfig({ ...env, PUBLIC_ORIGIN: 'http://site.example' })).toThrow();
  });
  it('servidor HTTP atende health e chamada integrada em porta local temporária', async () => {
    const { handle } = setup();
    const server = createApiServer(handle);
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw Error('porta ausente');
    const base = `http://127.0.0.1:${address.port}`;
    try {
      expect(await (await fetch(`${base}/health`)).json()).toEqual({ ok: true });
      const template = request();
      const response = await fetch(`${base}/api/tutor`, { method: 'POST', headers: template.headers, body: await template.text() });
      expect(response.status).toBe(200);
      expect((await response.json()).generated).toBe(true);
    } finally { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
  });
});
