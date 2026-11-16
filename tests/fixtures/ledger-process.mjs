import { UsageLedger } from '../../apps/api/src/limits.ts';

const [path, rawLimits, client, cost, now] = process.argv.slice(2);
const ledger = new UsageLedger(path, JSON.parse(rawLimits));
process.once('message', () => {
  try {
    ledger.reserve(client, Number(cost), Number(now));
    process.send({ accepted: true });
  } catch (error) {
    process.send({ accepted: false, code: error.code ?? error.message });
  } finally {
    // Keep the reservation active, like a request still using the provider.
    ledger.close();
    process.disconnect();
  }
});
process.send({ ready: true });
