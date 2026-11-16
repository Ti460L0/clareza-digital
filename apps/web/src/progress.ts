import { z } from "zod";
import { lessonRevisions } from '../../../packages/content/versions';
const oldLesson = z.object({
      step: z.number().int().nonnegative(),
      completed: z.boolean(),
      attempts: z.record(
        z.string(),
        z.object({
          first: z.string(),
          last: z.string(),
          count: z.number().int().positive(),
        }),
      ),
    });
const lessonState = oldLesson.extend({ contentVersion: z.number().int().positive(), reviewRequired: z.boolean() });
const legacy = z.object({ schemaVersion: z.literal(1), lessons: z.record(z.string(), oldLesson) });
const schema = z.object({
  schemaVersion: z.literal(2),
  lessons: z.record(z.string(), lessonState),
  archive: z.record(z.string(), z.array(lessonState)),
  lastLessonId: z.string().optional(),
});
export type Progress = z.infer<typeof schema>;
export const progressKey = "clareza-digital:progress";
export const emptyProgress = (): Progress => ({
  schemaVersion: 2,
  lessons: {},
  archive: {},
});
export function readProgress(storage: Pick<Storage, "getItem">, revisions = lessonRevisions): {
  data: Progress;
  warning: string;
} {
  try {
    const raw = storage.getItem(progressKey);
    if (!raw) return { data: emptyProgress(), warning: "" };
    const value = JSON.parse(raw);
    const old = legacy.safeParse(value);
    const parsed = old.success ? schema.safeParse({
      schemaVersion: 2, archive: {},
      lessons: Object.fromEntries(Object.entries(old.data.lessons).map(([id, state]) => [id, { ...state, contentVersion: 1, reviewRequired: false }])),
    }) : schema.safeParse(value);
    if (!parsed.success)
      return {
        data: emptyProgress(),
        warning:
          "O progresso salvo usa um formato incompatível. Ele foi preservado; você pode estudar nesta sessão.",
      };
    const data = parsed.data;
    if (Object.entries(data.lessons).some(([id, state]) => state.contentVersion > (revisions[id] ?? 1))) return {
      data: emptyProgress(), warning: 'O progresso salvo pertence a uma versão mais nova das aulas. Ele foi preservado; atualize a página ou estude nesta sessão.',
    };
    for (const [id, state] of Object.entries(data.lessons)) {
      const current = revisions[id] ?? 1;
      if (state.contentVersion < current) {
        data.archive[id] = [...(data.archive[id] ?? []), state];
        data.lessons[id] = { step: 0, completed: false, attempts: {}, contentVersion: current, reviewRequired: true };
      }
    }
    return { data, warning: "" };
  } catch {
    return {
      data: emptyProgress(),
      warning:
        "Não foi possível ler o progresso. Você pode estudar nesta sessão.",
    };
  }
}
export function writeProgress(
  storage: Pick<Storage, "setItem">,
  data: Progress,
): boolean {
  try {
    storage.setItem(progressKey, JSON.stringify(schema.parse(data)));
    return true;
  } catch {
    return false;
  }
}
