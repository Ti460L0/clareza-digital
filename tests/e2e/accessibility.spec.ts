import { expect, test } from '@playwright/test';

async function tabTo(page: import('@playwright/test').Page, name: string, limit = 65) {
  const target = page.getByRole('button', { name, exact: true });
  for (let i = 0; i < limit; i++) {
    if (await target.evaluate(element => document.activeElement === element)) return;
    await page.keyboard.press('Tab');
  }
  throw Error(`Controle não alcançado pelo teclado: ${name}`);
}
test('percurso de quiz só por teclado, foco e título por rota', async ({ page }) => {
  await page.goto('/cursos/seguranca/aulas/antes-de-clicar');
  await expect(page).toHaveTitle('Antes de clicar | Clareza Digital');
  await tabTo(page, '6. Praticar decisões');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Pratique suas decisões' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.quiz input').first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Conferir resposta' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.feedback')).toBeFocused();
  await tabTo(page, 'Tentar novamente');
  await page.keyboard.press('Enter');
  await expect(page.locator('.quiz legend')).toBeFocused();
  await page.goto('/cursos/ia/aulas/conversar-com-ia/consulta');
  await expect(page).toHaveTitle('Conversar e proteger informações — material de consulta | Clareza Digital');
});

test('texto ampliado a 200% sem perda horizontal e movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/cursos', '/preciso-de-ajuda', '/cursos/seguranca/aulas/antes-de-clicar', '/cursos/ia/aulas/conversar-com-ia/consulta']) {
    await page.goto(path);
    await page.addStyleTag({ content: ':root { font-size: 40px !important; }' });
    expect(await page.locator('html').evaluate(element => getComputedStyle(element).fontSize)).toBe('40px');
    const overflow = await page.evaluate(width => [...document.querySelectorAll('body *')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.right > width + 1;
    }).slice(0, 8).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 50) })), page.viewportSize()!.width);
    expect(overflow, path).toEqual([]);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    expect(await page.locator('body').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
    await expect(page.locator('video[autoplay]')).toHaveCount(0);
  }
});
