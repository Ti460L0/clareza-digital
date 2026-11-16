import { z } from 'zod';
import { outputSchema, tutorInstructions, type Passage, type Provider, type TutorRequest } from './tutor';

export const maxOutputTokens = 900;
export function providerBody(model: string, request: TutorRequest, retrieved: Passage[]) {
  return {
    model, store: false, max_output_tokens: maxOutputTokens,
    input: [
      { role: 'developer', content: tutorInstructions },
      { role: 'user', content: JSON.stringify({ request, passages: retrieved }) },
    ],
    text: { format: { type: 'json_schema', name: 'tutor_response', strict: true, schema: z.toJSONSchema(outputSchema, { target: 'draft-7' }) } },
  };
}

export async function boundedJson(response: Response | Request, maxBytes = 64_000): Promise<unknown> {
  if (!response.body) throw new Error('provider_empty');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) throw new Error('provider_oversize');
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

const envelope = z.object({
  status: z.literal('completed'),
  output: z.array(z.object({
    type: z.string(),
    content: z.array(z.object({ type: z.string(), text: z.string().optional() })).optional(),
  })),
});

export function createOpenAIProvider(config: { key: string; model: string }, fetcher: typeof fetch = fetch): Provider {
  if (!config.key || !config.model) throw new Error('provider_not_configured');
  return {
    async generate(request, retrieved, signal) {
      const timeout = AbortSignal.timeout(20_000);
      const response = await fetcher('https://api.openai.com/v1/responses', {
        method: 'POST', redirect: 'error',
        headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
        signal: signal ? AbortSignal.any([timeout, signal]) : timeout,
        body: JSON.stringify(providerBody(config.model, request, retrieved)),
      });
      // Never surface/log upstream bodies: they may contain question text or provider metadata.
      if (!response.ok) { await response.body?.cancel(); throw new Error('provider_unavailable'); }
      const parsed = envelope.parse(await boundedJson(response));
      const content = parsed.output.filter(item => item.type === 'message').flatMap(item => item.content ?? []);
      if (content.some(item => item.type === 'refusal')) throw new Error('provider_refusal');
      const text = content.filter(item => item.type === 'output_text').map(item => item.text ?? '').join('');
      if (!text) throw new Error('provider_empty');
      return JSON.parse(text);
    },
  };
}
