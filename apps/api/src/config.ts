import { z } from 'zod';
const nonnegative = z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(8788),
  HOST: z.string().default('127.0.0.1'),
  PUBLIC_ORIGIN: z.string().url().default('http://127.0.0.1:5173'),
  API_SHARED_SECRET: z.string().min(32),
  CLIENT_HASH_SECRET: z.string().min(32),
  AI_ENABLED: z.enum(['true', 'false']).default('false'),
  OPENAI_API_KEY: z.string().default(''),
  AI_MODEL: z.string().max(100).default(''),
  INPUT_USD_PER_MILLION: z.coerce.number().min(0).default(0),
  OUTPUT_USD_PER_MILLION: z.coerce.number().min(0).default(0),
  DAILY_BUDGET_MICRO_USD: nonnegative.default(0),
  MONTHLY_BUDGET_MICRO_USD: nonnegative.default(0),
  REQUESTS_PER_DAY: nonnegative.default(100),
  REQUESTS_PER_CLIENT_WINDOW: nonnegative.default(5),
  MAX_CONCURRENT: nonnegative.default(2),
  DATABASE_PATH: z.string().default('data/usage.sqlite'),
});
export function readConfig(env: Record<string, string | undefined>) {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) throw new Error('invalid_configuration');
  const config = parsed.data;
  const origin = new URL(config.PUBLIC_ORIGIN);
  if (origin.origin !== config.PUBLIC_ORIGIN || !['https:', 'http:'].includes(origin.protocol)) throw new Error('invalid_configuration');
  if (origin.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(origin.hostname)) throw new Error('https_required');
  if (config.API_SHARED_SECRET === config.CLIENT_HASH_SECRET) throw new Error('distinct_secrets_required');
  const enabled = config.AI_ENABLED === 'true';
  if (enabled && (!config.OPENAI_API_KEY || !config.AI_MODEL || config.INPUT_USD_PER_MILLION <= 0 || config.OUTPUT_USD_PER_MILLION <= 0 || !config.DAILY_BUDGET_MICRO_USD || !config.MONTHLY_BUDGET_MICRO_USD)) throw new Error('incomplete_ai_configuration');
  return { ...config, enabled };
}
export type Config = ReturnType<typeof readConfig>;
