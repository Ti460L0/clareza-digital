import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { backupDatabase } from '../scripts/backup-db.mjs';

test('backup consistente de banco WAL ativo e restauração preservam reservas', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'clareza-backup-'));
  const source = join(directory, 'usage.sqlite'), destination = join(directory, 'backup.sqlite');
  const db = new DatabaseSync(source);
  try {
    db.exec('PRAGMA journal_mode=WAL; CREATE TABLE reservations (id TEXT, micro_usd INTEGER); INSERT INTO reservations VALUES (\'teste\', 12345);');
    assert.deepEqual(await backupDatabase(source, destination), { reservations: 1 });
    const restored = new DatabaseSync(destination, { readOnly: true });
    try { assert.equal(restored.prepare('SELECT micro_usd FROM reservations WHERE id = ?').get('teste').micro_usd, 12345); }
    finally { restored.close(); }
    await assert.rejects(backupDatabase(source, destination));
    await assert.rejects(backupDatabase(source, source));
  } finally { db.close(); rmSync(directory, { recursive: true, force: true }); }
});
