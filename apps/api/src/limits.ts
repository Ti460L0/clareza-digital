import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';

export type Limits = {
  dailyMicroUsd: number;
  monthlyMicroUsd: number;
  requestsPerDay: number;
  requestsPerClientWindow: number;
  concurrent: number;
};
export class LimitError extends Error {
  constructor(public code: 'disabled' | 'rate' | 'budget' | 'busy') { super(code); }
}

// The reservation remains charged even on failure: a lost upstream response may still incur cost.
// Amounts are conservative ceilings, not billing records. One local SQLite volume must be shared
// by every API process on the VPS; separate hosts/files would not share these limits.
export class UsageLedger {
  private db: DatabaseSync;
  constructor(path: string, private limits: Limits) {
    for (const value of Object.values(limits)) if (!Number.isSafeInteger(value) || value < 0) throw new Error('invalid_limits');
    this.db = new DatabaseSync(path, { timeout: 5000 });
    this.db.exec(`PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY, client TEXT NOT NULL, created INTEGER NOT NULL,
        day TEXT NOT NULL, month TEXT NOT NULL, micro_usd INTEGER NOT NULL,
        active_until INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS reservation_month ON reservations(month);
      CREATE INDEX IF NOT EXISTS reservation_client ON reservations(client, created);
      CREATE INDEX IF NOT EXISTS reservation_active ON reservations(active_until);`);
  }
  reserve(client: string, microUsd: number, now = Date.now()) {
    if (!/^[a-f0-9]{64}$/.test(client) || !Number.isSafeInteger(microUsd) || microUsd <= 0) throw new Error('invalid_reservation');
    if (Object.values(this.limits).some(value => value === 0)) throw new LimitError('disabled');
    const date = new Date(now).toISOString();
    const day = date.slice(0, 10), month = date.slice(0, 7);
    this.db.exec('BEGIN IMMEDIATE');
    try {
      this.db.prepare('DELETE FROM reservations WHERE created < ? AND active_until < ?').run(now - 35 * 86400_000, now);
      const recent = this.db.prepare('SELECT COUNT(*) AS n FROM reservations WHERE client = ? AND created > ?').get(client, now - 600_000) as { n: number };
      const today = this.db.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(micro_usd), 0) AS cost FROM reservations WHERE day = ?').get(day) as { n: number; cost: number };
      const monthly = this.db.prepare('SELECT COALESCE(SUM(micro_usd), 0) AS cost FROM reservations WHERE month = ?').get(month) as { cost: number };
      const active = this.db.prepare('SELECT COUNT(*) AS n FROM reservations WHERE active_until > ?').get(now) as { n: number };
      if (recent.n >= this.limits.requestsPerClientWindow || today.n >= this.limits.requestsPerDay) throw new LimitError('rate');
      if (today.cost + microUsd > this.limits.dailyMicroUsd || monthly.cost + microUsd > this.limits.monthlyMicroUsd) throw new LimitError('budget');
      if (active.n >= this.limits.concurrent) throw new LimitError('busy');
      const id = randomUUID();
      this.db.prepare('INSERT INTO reservations VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, client, now, day, month, microUsd, now + 60_000);
      this.db.exec('COMMIT');
      return id;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  finish(id: string) {
    this.db.prepare('UPDATE reservations SET active_until = 0 WHERE id = ?').run(id);
  }
  close() { this.db.close(); }
}

export function reserveCost(body: unknown, inputUsdPerMillion: number, outputUsdPerMillion: number, maxOutput: number) {
  if (![inputUsdPerMillion, outputUsdPerMillion, maxOutput].every(n => Number.isFinite(n) && n > 0)) throw new Error('invalid_pricing');
  // UTF-8 byte count upper-bounds byte-token input; include schema/envelope plus margin.
  const inputCeiling = Buffer.byteLength(JSON.stringify(body), 'utf8') + 1024;
  const microUsd = Math.ceil(inputCeiling * inputUsdPerMillion + maxOutput * outputUsdPerMillion);
  if (!Number.isSafeInteger(microUsd)) throw new Error('invalid_pricing');
  return microUsd;
}
