import { describe, expect, it } from 'vitest';
import cases from './evaluation/cases.json';
import { parseRequest, retrieve } from '../apps/api/src/tutor';
import { providerBody, maxOutputTokens } from '../apps/api/src/openai';
import { reserveCost } from '../apps/api/src/limits';

describe('preparação da avaliação — não é avaliação do modelo', () => {
  it('tem 30 casos identificados, critérios e entrada aceita pelo contrato', () => {
    expect(cases).toHaveLength(30);
    expect(new Set(cases.map(item => item.id)).size).toBe(30);
    for (const item of cases) {
      expect(item.review.length).toBeGreaterThan(40);
      const input = parseRequest(item.request);
      const retrieved = retrieve(input);
      expect(retrieved.length).toBeGreaterThan(0);
      expect(retrieved.some(passage => passage.lessonId === input.lessonId), item.id).toBe(true);
      expect(reserveCost(providerBody('modelo-ficticio', input, retrieved), 1, 5, maxOutputTokens)).toBeGreaterThan(0);
    }
  });
});
