import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { readConfig } from './config';
import { UsageLedger } from './limits';
import { createOpenAIProvider } from './openai';
import { createHandler } from './handler';
import { createApiServer } from './http';

try {
  const config = readConfig(process.env);
  mkdirSync(dirname(config.DATABASE_PATH), { recursive: true });
  const ledger = new UsageLedger(config.DATABASE_PATH, {
    dailyMicroUsd: config.DAILY_BUDGET_MICRO_USD,
    monthlyMicroUsd: config.MONTHLY_BUDGET_MICRO_USD,
    requestsPerDay: config.REQUESTS_PER_DAY,
    requestsPerClientWindow: config.REQUESTS_PER_CLIENT_WINDOW,
    concurrent: config.MAX_CONCURRENT,
  });
  const provider = config.enabled ? createOpenAIProvider({ key: config.OPENAI_API_KEY, model: config.AI_MODEL }) : undefined;
  const server = createApiServer(createHandler(config, ledger, provider));
  server.listen(config.PORT, config.HOST, () => console.info('API Clareza Digital iniciada.'));
  const shutdown = () => {
    server.close(() => { ledger.close(); process.exit(0); });
    setTimeout(() => process.exit(1), 30_000).unref();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
} catch {
  console.error('Não foi possível iniciar a API. Verifique a configuração e o volume de dados.');
  process.exitCode = 1;
}
