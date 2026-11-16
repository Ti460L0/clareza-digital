import { describe, expect, it } from 'vitest';
import { readProgress, writeProgress } from '../apps/web/src/progress';
const state = { step: 5, completed: true, attempts: { q1: { first: 'a', last: 'b', count: 2 } } };
const old = JSON.stringify({ schemaVersion: 1, lessons: { 'antes-de-clicar': state } });
describe('migração de progresso', () => {
  it('converte formato inicial preservando conclusão, posição e tentativas', () => {
    const migrated = readProgress({ getItem: () => old });
    expect(migrated.warning).toBe('');
    expect(migrated.data.schemaVersion).toBe(2);
    expect(migrated.data.lessons['antes-de-clicar']).toEqual({ ...state, contentVersion: 1, reviewRequired: false });
  });
  it('mudança pedagógica arquiva versão antiga e pede revisão sem apagar evidência', () => {
    const revisions = { 'antes-de-clicar': 2 };
    const migrated = readProgress({ getItem: () => old }, revisions);
    expect(migrated.data.archive['antes-de-clicar'][0]).toMatchObject(state);
    expect(migrated.data.lessons['antes-de-clicar']).toMatchObject({ completed: false, step: 0, contentVersion: 2, reviewRequired: true });
    let saved = '';
    expect(writeProgress({ setItem: (_, value) => { saved = value; } }, migrated.data)).toBe(true);
    const reread = readProgress({ getItem: () => saved }, revisions);
    expect(reread.data.archive['antes-de-clicar']).toHaveLength(1);
    expect(reread.data).toEqual(migrated.data);
  });
  it('não aceita sobrescrever dados de revisão mais nova após rollback', () => {
    const newer = readProgress({ getItem: () => old }, { 'antes-de-clicar': 2 }).data;
    const result = readProgress({ getItem: () => JSON.stringify(newer) });
    expect(result.warning).toContain('versão mais nova');
    expect(result.data.lessons).toEqual({});
  });
});
