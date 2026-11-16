import { z } from 'zod';
import { boundedJson } from './openai';
import { outputSchema, tutorInstructions, type Passage, type Provider, type TutorRequest } from './tutor';

// Only this model is reviewed for the free allocation. No routing or paid fallback.
export const cloudflareModel = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
export const cloudflareMaxOutputTokens = 600;
export function cloudflareBody(request: TutorRequest, passages: Passage[]) {
  return {
    messages: [
      { role: 'system', content: `${tutorInstructions}\nEscreva answer em duas a quatro frases curtas, preferencialmente até 600 caracteres. Não coloque IDs ou citações no corpo da resposta: use apenas references. Copie cada quote de um único trecho identificado, sem juntar frases de trechos distintos. A citação deve apoiar a orientação principal. Se não souber o que a pessoa já fez, peça esclarecimento sem presumir a ação. Não acrescente regras técnicas ausentes dos trechos.` },
      { role: 'user', content: JSON.stringify({ request, passages }) },
    ],
    max_tokens: cloudflareMaxOutputTokens, temperature: 0,
    response_format: { type: 'json_schema', json_schema: z.toJSONSchema(outputSchema, { target: 'draft-7' }) },
  };
}

export function createCloudflareProvider(config: { key: string; accountId: string; freePlanConfirmed: boolean }, fetcher: typeof fetch = fetch): Provider {
  if (!config.freePlanConfirmed || !config.key || !/^[a-f0-9]{32}$/.test(config.accountId)) throw Error('free_provider_not_configured');
  return {
    async generate(request, passages, signal) {
      const body = JSON.stringify(cloudflareBody(request, passages));
      if (Buffer.byteLength(body) > 32_000) throw Error('provider_input_oversize');
      const timeout = AbortSignal.timeout(20_000);
      const response = await fetcher(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/ai/run/${cloudflareModel}`, {
        method: 'POST', redirect: 'error',
        headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
        body, signal: signal ? AbortSignal.any([timeout, signal]) : timeout,
      });
      if (!response.ok) { await response.body?.cancel(); throw Error('provider_unavailable'); }
      const envelope = z.object({ success: z.literal(true), result: z.object({ response: z.unknown() }) }).parse(await boundedJson(response));
      const output = envelope.result.response;
      return typeof output === 'string' ? JSON.parse(output) : output;
    },
  };
}
