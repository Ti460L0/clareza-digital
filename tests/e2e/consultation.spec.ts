import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { courses } from '../../packages/content';

test('consulta rápida cobre situações sem coletar dados e pode ser impressa', async ({ page }) => {
  await page.goto('/preciso-de-ajuda');
  for (const title of ['Só abri uma página', 'Informei senha ou código', 'Instalei um aplicativo indicado', 'Paguei ou fiz uma transferência']) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await expect(page.locator('input, textarea, form')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(width => document.documentElement.scrollWidth <= width, page.viewportSize()!.width)).toBe(true);
  await page.evaluate(() => { window.print = () => document.body.setAttribute('data-print-requested', 'true'); });
  await page.getByRole('button', { name: 'Imprimir consulta rápida' }).click();
  await expect(page.locator('body')).toHaveAttribute('data-print-requested', 'true');
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 794, height: 1123 });
  await expect(page.locator('header')).toBeHidden();
  await expect(page.locator('.print-url').first()).toBeVisible();
  await page.screenshot({ path: `test-results/consulta-ajuda-print-${test.info().project.name}.png`, fullPage: true });
  if (process.env.CHECK_PRINT_PDF === 'true' && test.info().project.name === 'desktop') await page.pdf({ path: 'output/pdf/consulta-ajuda.pdf', preferCSSPageSize: true, printBackground: false, tagged: true });
});

test('treze materiais independentes preservam resumo, fontes e retorno à aula', async ({ page }) => {
  for (const course of courses) for (const lesson of course.lessons) {
    const path = `/cursos/${course.id}/aulas/${lesson.id}`;
    await page.goto(`${path}/consulta`);
    await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
    for (const text of lesson.summary) await expect(page.getByText(text, { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar à aula' })).toHaveAttribute('href', path);
    await expect(page.locator('.consultation-sources a')).toHaveCount(lesson.sourceIds.length);
    expect(await page.evaluate(width => document.documentElement.scrollWidth <= width, page.viewportSize()!.width)).toBe(true);
  }
  await page.goto('/cursos/seguranca/aulas/antes-de-clicar');
  await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
  await page.getByRole('link', { name: 'Abrir material de consulta para imprimir' }).click();
  await expect(page).toHaveURL(/\/consulta$/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: `test-results/consulta-aula-print-${test.info().project.name}.png`, fullPage: true });
  if (process.env.CHECK_PRINT_PDF === 'true' && test.info().project.name === 'desktop') await page.pdf({ path: 'output/pdf/antes-de-clicar.pdf', preferCSSPageSize: true, printBackground: false, tagged: true });
});
