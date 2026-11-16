import { existsSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import cases from '../../../tests/evaluation/cases.json';
import { parseRequest, retrieve, validateOutput } from './tutor';
import { boundedJson, maxOutputTokens, providerBody } from './openai';
import { reserveCost } from './limits';

if (existsSync('.env')) process.loadEnvFile('.env');
try {
  const model = process.env.AI_MODEL;
  const inputPrice = Number(process.env.INPUT_USD_PER_MILLION);
  const outputPrice = Number(process.env.OUTPUT_USD_PER_MILLION);
  if (!model) throw Error('Configure AI_MODEL e preços verificados antes de estimar a avaliação.');
  const prepared = cases.map(item => {
    const input = parseRequest(item.request), retrieved = retrieve(input);
    return { item, input, retrieved, reservation: reserveCost(providerBody(model, input, retrieved), inputPrice, outputPrice, maxOutputTokens) };
  });
  const estimate = prepared.reduce((sum, item) => sum + item.reservation, 0);
  console.info(`30 casos preparados. Reserva estimada conservadora: ${estimate} micro-USD. Não é cobrança medida.`);
  if (process.env.EVAL_ALLOW_REAL !== 'true') {
    console.info('Somente estimativa. Nenhuma pergunta enviada; execução real exige autorização e EVAL_ALLOW_REAL=true.');
  } else {
    const cap = Number(process.env.EVAL_MAX_MICRO_USD);
    if (!Number.isSafeInteger(cap) || cap <= 0 || estimate > cap) throw Error('Estimativa excede o teto explícito da avaliação ou teto não configurado.');
    const origin = process.env.PUBLIC_ORIGIN;
    const secret = process.env.API_SHARED_SECRET;
    if (!origin || !secret || secret.length < 32) throw Error('Configure origem e segredo da API local.');
    // Fixed loopback target prevents sending the server secret to an arbitrary URL.
    const base = 'http://127.0.0.1:8788';
    const headers = { Authorization: `Bearer ${secret}`, Origin: origin, 'X-Clareza-Client-IP': '127.0.0.1', 'Content-Type': 'application/json' };
    const health = await fetch(`${base}/api/status`, { headers, signal: AbortSignal.timeout(5000), redirect: 'error' });
    const availability = await boundedJson(health, 2000) as { available?: boolean; provider?: string };
    if (!health.ok || availability.available !== true || availability.provider !== 'OpenAI') throw Error('API local não confirmou disponibilidade do provedor.');
    const directory = resolve('private/evaluations');
    mkdirSync(directory, { recursive: true });
    const output = resolve(directory, `${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`);
    writeFileSync(output, JSON.stringify({ type: 'run', at: new Date().toISOString(), model, inputPrice, outputPrice, reservedCeilingMicroUsd: estimate, caseHash: createHash('sha256').update(JSON.stringify(cases)).digest('hex'), evaluation: 'real-requested', humanReview: 'pending' }) + '\n', { flag: 'wx', mode: 0o600 });
    let successful = 0;
    for (const { item, input, retrieved } of prepared) {
      const started = performance.now();
      let status = 0, result: unknown = null, contractValid = false;
      try {
        const response = await fetch(`${base}/api/tutor`, { method: 'POST', headers, body: JSON.stringify(input), signal: AbortSignal.timeout(25_000), redirect: 'error' });
        status = response.status;
        result = await boundedJson(response, 32_000);
        if (response.ok && result && typeof result === 'object') {
          const reply = result as { kind?: unknown; answer?: unknown; references?: { id?: unknown; quote?: unknown }[]; generated?: unknown };
          validateOutput({ kind: reply.kind, answer: reply.answer, references: reply.references?.map(({ id, quote }) => ({ id, quote })) }, retrieved);
          contractValid = reply.generated === true;
          if (contractValid) successful++;
        }
      } catch { /* Persist only generic failure; never raw error/configuration. */ }
      appendFileSync(output, JSON.stringify({ id: item.id, request: input, status, latencyMs: Math.round(performance.now() - started), contractValid, result, criterion: item.review, humanReview: { utility: null, grounding: null, falseCertainty: null, improperRefusal: null, criticalFailure: null, notes: '' } }) + '\n');
      console.info(`${item.id}: HTTP ${status || 'falha'}; contrato ${contractValid ? 'válido' : 'não comprovado'}. Revisão qualitativa pendente.`);
      if (status === 429 || status === 503 || status === 0) { console.info('Execução interrompida por limite/indisponibilidade. Casos restantes não foram testados.'); break; }
    }
    console.info(`${successful}/30 respostas com contrato válido. Relatório privado salvo. Isso não aprova a qualidade do modelo.`);
  }
} catch (error) {
  console.error(error instanceof Error && !error.message.includes('fetch') ? error.message : 'Avaliação não concluída. Verifique a configuração local.');
  process.exitCode = 1;
}
