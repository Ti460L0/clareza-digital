import { expect, test } from '@playwright/test';

test('histórico do navegador preserva etapa e retorna entre aula, consulta e curso', async ({ page }) => {
  await page.goto('/cursos/seguranca');
  await page.getByRole('link', { name: 'Antes de clicar', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A aparência não confirma a cobrança' })).toBeVisible();

  await page.getByRole('link', { name: '← Índice do curso', exact: true }).click();
  await expect(page).toHaveURL(/\/cursos\/seguranca$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/aulas\/antes-de-clicar$/);
  await expect(page.getByRole('heading', { name: 'A aparência não confirma a cobrança' })).toBeVisible();
  // History may restore a previously focused link inside the returned page.
  await expect.poll(() => page.locator('main').evaluate(main => main.contains(document.activeElement))).toBe(true);
  await expect(page).toHaveTitle('Antes de clicar | Clareza Digital');
  await page.goForward();
  await expect(page).toHaveURL(/\/cursos\/seguranca$/);
  await expect.poll(() => page.locator('main').evaluate(main => main.contains(document.activeElement))).toBe(true);

  await page.getByRole('link', { name: 'Antes de clicar', exact: true }).click();
  await page.getByRole('button', { name: '7. Para levar com você', exact: true }).click();
  const consultation = page.locator('a[href="/cursos/seguranca/aulas/antes-de-clicar/consulta"]');
  await consultation.click();
  await expect(page).toHaveURL(/\/antes-de-clicar\/consulta$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/aulas\/antes-de-clicar$/);
  await expect(page.getByRole('heading', { name: 'Para levar com você', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Para levar com você', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '← Anterior', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pratique suas decisões' })).toBeFocused();
});
