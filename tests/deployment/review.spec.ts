import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

test('capturas da versão compilada para revisão visual', async ({ page }) => {
  test.skip(process.env.CAPTURE_REVIEW !== 'true', 'Capturas somente na revisão visual explícita.');
  mkdirSync('docs/evidence/review', { recursive: true });
  for (const sample of [
    { name: 'inicio-desktop', path: '/', width: 1280, height: 1000 },
    { name: 'inicio-mobile', path: '/', width: 320, height: 1200 },
    { name: 'curso-mobile', path: '/cursos/seguranca', width: 320, height: 1200 },
    { name: 'aula-desktop', path: '/cursos/seguranca/aulas/antes-de-clicar', width: 1280, height: 1000 },
    { name: 'ajuda-desktop', path: '/preciso-de-ajuda', width: 1280, height: 1000 },
    { name: 'consulta-mobile', path: '/cursos/ia/aulas/conversar-com-ia/consulta', width: 320, height: 1200 },
  ]) {
    await page.setViewportSize({ width: sample.width, height: sample.height });
    await page.goto(sample.path);
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({ path: `docs/evidence/review/${sample.name}.png` });
  }
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.goto('/cursos/seguranca/aulas/antes-de-clicar');
  await page.locator('.lesson-topic').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/aula-mobile.png' });
  await page.getByRole('button', { name: '6. Praticar decisões' }).click();
  await page.locator('.quiz').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/quiz-mobile.png' });
  await page.locator('.quiz input').first().check();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await page.locator('.feedback').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/quiz-cuidado-mobile.png' });
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await page.locator('.quiz input').nth(1).check();
  await page.getByRole('button', { name: 'Conferir resposta' }).click();
  await page.locator('.feedback').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/quiz-acerto-mobile.png' });
  await page.goto('/praticar');
  await page.locator('.simulation').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/simulacao-mobile.png' });
});
