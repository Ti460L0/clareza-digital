import { describe, it, expect } from "vitest";
import { validateContent, pilot, lessonSchema } from "../packages/content";
import {
  emptyProgress,
  readProgress,
  writeProgress,
  progressKey,
} from "../apps/web/src/progress";
describe("conteúdo", () => {
  it("valida catálogo e referências", () =>
    expect(validateContent()).toBe(true));
  it("rejeita questão sem resposta correta", () => {
    const bad = structuredClone(pilot);
    bad.questions[0].options.forEach((o) => (o.correct = false));
    expect(lessonSchema.safeParse(bad).success).toBe(false);
  });
});
describe("progresso", () => {
  it("preserva dados válidos", () => {
    const data = emptyProgress();
    data.lessons.piloto = {
      contentVersion: 1,
      reviewRequired: false,
      step: 2,
      completed: false,
      attempts: { q: { first: "a", last: "b", count: 2 } },
    };
    let stored = "";
    expect(
      writeProgress(
        {
          setItem: (key, value) => {
            expect(key).toBe(progressKey);
            stored = value;
          },
        },
        data,
      ),
    ).toBe(true);
    expect(readProgress({ getItem: () => stored }).data).toEqual(data);
  });
  it("tolera armazenamento bloqueado", () => {
    expect(
      readProgress({
        getItem: () => {
          throw Error("blocked");
        },
      }).warning,
    ).not.toBe("");
    expect(
      writeProgress(
        {
          setItem: () => {
            throw Error("blocked");
          },
        },
        emptyProgress(),
      ),
    ).toBe(false);
  });
  it("preserva formato futuro sem falhar", () => {
    expect(
      readProgress({ getItem: () => '{"schemaVersion":20}' }).warning,
    ).toContain("incompatível");
  });
  it("tolera JSON corrompido", () =>
    expect(readProgress({ getItem: () => "{" }).data).toEqual(emptyProgress()));
});
