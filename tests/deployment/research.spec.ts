import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('oficina de pesquisa explica prompt, fontes e limites sem enviar dados', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') sent.push(request.url()); });
  await page.goto('/cursos/ia/aulas/conversar-com-ia');
  await expect(page.getByRole('button', { name: 'Assistir à videoaula' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
  await page.getByLabel('Escolha um assunto de exemplo').selectOption('Como funciona a energia solar');
  await page.getByRole('button', { name: 'Montar um pedido mais completo' }).click();
  await expect(page.locator('.research-result')).toContainText('como funciona a energia solar');
  await expect(page.locator('.research-result')).toContainText('Nenhuma pesquisa foi realizada aqui');
  await expect(page.locator('.research-result')).toContainText('não garante que ela esteja correta');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  expect(sent).toEqual([]);
  await page.locator('.research-practice').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/evidence/review/pesquisa-mobile.png' });
});
