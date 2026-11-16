import type { Lesson, Question } from "./index";
export const q = (
  id: string,
  prompt: string,
  options: [string, boolean, string][],
): Question => ({
  id,
  prompt,
  options: options.map(([text, correct, explanation], i) => ({
    id: `${id}-${i}`,
    text,
    correct,
    explanation,
  })),
});
export const lesson = (
  id: string,
  title: string,
  objective: string,
  sourceIds: string[],
  sections: [string, string[]][],
  questions: Question[],
  summary: string[],
  simulation?: Lesson["simulation"],
): Lesson => ({
  id,
  title,
  objective,
  sourceIds,
  slides: sections.map(([title, paragraphs], i) => ({
    id: `${id}-bloco-${i}`,
    title,
    paragraphs,
  })),
  questions,
  summary,
  simulation,
});
