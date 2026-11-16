import { test, expect } from '@playwright/test';

const videos = [
  ['seguranca', 'antes-de-clicar', 'SmsEntrega', 40],
  ['seguranca', 'quem-esta-falando', 'FamiliarNumeroNovo', 40],
  ['seguranca', 'ofertas-e-enderecos', 'DominioEmFoco', 48],
  ['seguranca', 'falsa-central', 'CentralBancaria', 40],
  ['ia', 'conversar-com-ia', 'PrimeiraConversaIA', 48],
  ['ia', 'investigar-noticia', 'NoticiaEFontes', 48],
] as const;

test('seis vídeos decodificam e permitem percorrer início, meio e fim', async ({ page }) => {
  for (const [course, lesson, id, duration] of videos) {
    await page.goto(`/cursos/${course}/aulas/${lesson}`);
    await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
    const narrated = id !== 'NoticiaEFontes';
    await page.getByRole('button', { name: narrated ? 'Assistir à videoaula' : 'Carregar vídeo opcional' }).first().click();
    const video = page.locator('video');
    await video.evaluate((el: HTMLVideoElement) => el.load());
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(2);
    const actualDuration = await video.evaluate((el: HTMLVideoElement) => el.duration);
    if (!narrated) expect(actualDuration).toBeCloseTo(duration, 0);
    else expect(actualDuration).toBeGreaterThan(240);
    expect(await video.evaluate((el: HTMLVideoElement) => [el.videoWidth, el.videoHeight])).toEqual(narrated ? [1280, 720] : [960, 960]);
    for (const seconds of [1, actualDuration / 2, actualDuration - 1]) {
      await video.evaluate((el: HTMLVideoElement, time) => new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Tempo excedido ao buscar quadro')), 5000);
        el.addEventListener('seeked', () => { clearTimeout(timeout); resolve(); }, { once: true });
        el.currentTime = time;
      }), seconds);
      expect(await video.evaluate((el: HTMLVideoElement) => el.error)).toBeNull();
      await video.screenshot({ path: `test-results/media-${test.info().project.name}-${id}-${seconds}.png` });
    }
  }
});

test('falha de mídia preserva a alternativa textual', async ({ page }) => {
  await page.route('**/media/*.mp4', route => route.abort());
  await page.goto('/cursos/seguranca/aulas/antes-de-clicar');
  await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
  await page.getByRole('button', { name: 'Assistir à videoaula' }).click();
  await page.locator('video').evaluate((el: HTMLVideoElement) => el.load());
  await expect(page.getByRole('status').filter({ hasText: 'O vídeo não pôde ser carregado' })).toBeVisible();
  await page.getByText('Ler a transcrição da narração', { exact: true }).click();
  await expect(page.locator('.media details p').first()).toBeVisible();
});
