import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { courses } from '../../packages/content';

for (const width of [320, 1280]) test(`dois cursos completos no build público sem IA/vídeo em ${width}px`, async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width, height: 900 });
  const forbidden: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (request.method() === 'POST' || url.pathname.startsWith('/api/') || url.pathname.endsWith('.mp4')) forbidden.push(request.url());
  });
  for (const course of courses) {
    for (const lesson of course.lessons) {
      await page.goto(`/cursos/${course.id}/aulas/${lesson.id}`);
      await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
      for (const slide of lesson.slides) await expect(page.getByRole('heading', { name: slide.title, exact: true })).toBeVisible();
      for (const [index, question] of lesson.questions.entries()) {
        await page.getByLabel(question.options.find(option => option.correct)!.text, { exact: true }).check();
        await page.getByRole('button', { name: 'Conferir resposta', exact: true }).click();
        for (const option of question.options) await expect(page.locator('.feedback').getByText(option.explanation, { exact: false })).toBeVisible();
        if (index < lesson.questions.length - 1) await page.getByRole('button', { name: 'Próxima questão' }).click();
      }
      await page.getByRole('button', { name: 'Concluir aula', exact: true }).click();
      await expect(page.getByText('Aula concluída. Você pode revisar e praticar quantas vezes quiser.')).toBeVisible();
      await expect(page.getByRole('region', { name: 'Assistente da aula' })).toHaveCount(0);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(audit.violations, lesson.id).toEqual([]);
    }
    await page.goto(`/cursos/${course.id}`);
    await expect(page.getByText('Concluída', { exact: true })).toHaveCount(course.lessons.length);
  }
  expect(forbidden).toEqual([]);
});
