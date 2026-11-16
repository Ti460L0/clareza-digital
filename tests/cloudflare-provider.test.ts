import { expect, it, vi } from 'vitest';
import { createCloudflareProvider, cloudflareModel } from '../apps/api/src/cloudflare';
import { parseRequest, retrieve } from '../apps/api/src/tutor';

const config = { key: 'ficticia', accountId: 'a'.repeat(32), freePlanConfirmed: true };
const request = parseRequest({ message: 'Como conferir uma cobrança de entrega?', lessonId: 'antes-de-clicar', mode: 'explain' });
it('exige confirmação do plano gratuito e conta válida', () => {
  expect(() => createCloudflareProvider({ ...config, freePlanConfirmed: false })).toThrow('free_provider_not_configured');
  expect(() => createCloudflareProvider({ ...config, accountId: 'https://outro.test' })).toThrow('free_provider_not_configured');
});
it('usa destino fixo, schema, limite de tokens e não segue redirecionamento', async () => {
  const output = { kind: 'insufficient', answer: 'Confira as referências da aula.', references: [] };
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success: true, result: { response: output } }));
  expect(await createCloudflareProvider(config, fetcher).generate(request, retrieve(request))).toEqual(output);
  const [url, init] = fetcher.mock.calls[0];
  expect(url).toBe(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/ai/run/${cloudflareModel}`);
  expect(init?.redirect).toBe('error');
  expect(JSON.parse(String(init?.body))).toMatchObject({ max_tokens: 600, response_format: { type: 'json_schema' } });
});
it('franquia esgotada não tenta outro provedor nem expõe a resposta remota', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('detalhes privados', { status: 429 }));
  await expect(createCloudflareProvider(config, fetcher).generate(request, retrieve(request))).rejects.toThrow('provider_unavailable');
  expect(fetcher).toHaveBeenCalledTimes(1);
});
