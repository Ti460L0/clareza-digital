// Increment only for pedagogical changes requiring renewed study, not spelling fixes.
// IDs stay stable. Unlisted published lessons are revision 1.
export const lessonRevisions: Record<string, number> = { 'conversar-com-ia': 2 };
export function lessonRevision(id: string) { return lessonRevisions[id] ?? 1; }
