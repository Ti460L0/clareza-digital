import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { UsageLedger, reserveCost, type Limits } from '../apps/api/src/limits';

const base: Limits = { dailyMicroUsd: 100, monthlyMicroUsd: 150, requestsPerDay: 10, requestsPerClientWindow: 3, concurrent: 2 };
const client = 'a'.repeat(64);
const now = Date.parse('2026-11-14T12:00:00Z');
const ledgers: UsageLedger[] = [];
const directories: string[] = [];
function ledger(limits = base, path = ':memory:') { const ledger = new UsageLedger(path, limits); ledgers.push(ledger); return ledger; }
afterEach(() => { ledgers.splice(0).forEach(l => l.close()); directories.splice(0).forEach(d => rmSync(d, { recursive: true, force: true })); });
describe('limites persistentes', () => {
  it.each([
    { name: 'orçamento', concurrent: 10, dailyMicroUsd: 100, expected: 'budget' },
    { name: 'concorrência', concurrent: 1, dailyMicroUsd: 1000, expected: 'busy' },
  ])('serializa $name entre quatro processos reais', async ({ concurrent, dailyMicroUsd, expected }) => {
    const directory = mkdtempSync(join(tmpdir(), 'clareza-ledger-')); directories.push(directory);
    const path = join(directory, 'usage.sqlite');
    const limits = { ...base, concurrent, dailyMicroUsd, monthlyMicroUsd: 1000 };
    // Initialize schema before processes contend for the same budget.
    new UsageLedger(path, limits).close();
    const children = Array.from({ length: 4 }, (_, i) => fork(
      fileURLToPath(new URL('./fixtures/ledger-process.mjs', import.meta.url)),
      [path, JSON.stringify(limits), String(i).repeat(64), '60', String(now)],
      { execArgv: ['--experimental-transform-types'], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] },
    ));
    let ready = 0;
    try {
      const results = await Promise.all(children.map(child => new Promise<{ accepted: boolean; code?: string }>((resolve, reject) => {
        let result: { accepted: boolean; code?: string } | undefined;
        const timer = setTimeout(() => { child.kill(); reject(new Error('child_timeout')); }, 10_000);
        child.on('message', (message: { ready?: boolean; accepted?: boolean; code?: string }) => {
          if (message.ready) {
            if (++ready === children.length) children.forEach(process => process.send('reserve'));
          } else result = { accepted: message.accepted === true, code: message.code };
        });
        child.once('error', error => { clearTimeout(timer); reject(error); });
        child.once('exit', code => {
          clearTimeout(timer);
          if (code === 0 && result) resolve(result);
          else reject(new Error(`child_exit_${code}`));
        });
      })));
      expect(results.filter(result => result.accepted)).toHaveLength(1);
      expect(results.filter(result => !result.accepted).map(result => result.code)).toEqual([expected, expected, expected]);
    } finally { children.forEach(child => { if (child.exitCode === null) child.kill(); }); }
  }, 15_000);
  it('fica desligado sem orçamento', () => {
    expect(() => ledger({ ...base, dailyMicroUsd: 0 }).reserve(client, 1, now)).toThrow('disabled');
  });
  it('reserva antes da chamada, mantém cobrança conservadora após falha', () => {
    const db = ledger();
    const first = db.reserve(client, 70, now);
    db.finish(first);
    expect(() => db.reserve(client, 31, now)).toThrow('budget');
    expect(() => db.reserve(client, 30, now)).not.toThrow();
  });
  it('limita concorrência e libera apenas vaga ao finalizar', () => {
    const db = ledger();
    const first = db.reserve(client, 1, now);
    db.reserve(client, 1, now);
    expect(() => db.reserve(client, 1, now)).toThrow('busy');
    db.finish(first);
    expect(() => db.reserve(client, 1, now)).not.toThrow();
  });
  it('limita cliente em janela móvel de dez minutos', () => {
    const db = ledger();
    for (let i = 0; i < 3; i++) db.finish(db.reserve(client, 1, now));
    expect(() => db.reserve(client, 1, now + 599_000)).toThrow('rate');
    expect(() => db.reserve(client, 1, now + 600_001)).not.toThrow();
  });
  it('preserva orçamento mensal ao mudar o dia', () => {
    const db = ledger();
    db.finish(db.reserve(client, 100, now));
    expect(() => db.reserve(client, 51, now + 86400_000)).toThrow('budget');
  });
  it('recupera vagas após queda sem devolver reserva de custo', () => {
    const db = ledger({ ...base, concurrent: 1 });
    db.reserve(client, 60, now);
    expect(() => db.reserve(client, 1, now + 59_999)).toThrow('busy');
    expect(() => db.reserve(client, 41, now + 60_001)).toThrow('budget');
    expect(() => db.reserve(client, 40, now + 60_001)).not.toThrow();
  });
  it('compartilha saldo entre conexões ao mesmo arquivo', () => {
    const directory = mkdtempSync(join(tmpdir(), 'clareza-ledger-')); directories.push(directory);
    const path = join(directory, 'usage.sqlite');
    const a = ledger(base, path), b = ledger(base, path);
    a.finish(a.reserve(client, 80, now));
    expect(() => b.reserve('b'.repeat(64), 21, now)).toThrow('budget');
    expect(() => b.reserve('b'.repeat(64), 20, now)).not.toThrow();
  });
  it('não aceita identificador pessoal, custo negativo ou configuração inválida', () => {
    const db = ledger();
    expect(() => db.reserve('127.0.0.1', 1, now)).toThrow('invalid_reservation');
    expect(() => db.reserve(client, -1, now)).toThrow('invalid_reservation');
    expect(() => new UsageLedger(':memory:', { ...base, concurrent: NaN })).toThrow('invalid_limits');
  });
  it('estima teto em unidades inteiras e exige preço explícito', () => {
    expect(reserveCost({ input: 'Olá' }, 1, 5, 900)).toBeGreaterThan(5500);
    expect(() => reserveCost({}, 0, 5, 900)).toThrow('invalid_pricing');
  });
});
