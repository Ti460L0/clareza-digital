import { expect, test } from '@playwright/test';
test('cinco videoaulas narradas carregam com legendas e sem reprodução automática', async ({ page, request }) => {
  for (const [index, lesson] of ['antes-de-clicar', 'quem-esta-falando', 'falsa-central', 'ofertas-e-enderecos', 'ja-interagi'].entries()) {
    await page.goto(`/cursos/seguranca/aulas/${lesson}`);
    await expect(page.locator('video')).toHaveCount(0);
    await page.getByRole('button', { name: 'Assistir à videoaula' }).click();
    const video = page.locator('video');
    await video.evaluate((element: HTMLVideoElement) => element.load());
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeGreaterThan(240);
    await expect(video.locator('track')).toHaveAttribute('src', `/media/Aula-S${index + 1}.pt-BR.vtt`);
    const captions = await request.get(`/media/Aula-S${index + 1}.pt-BR.vtt`);
    expect(captions.ok()).toBe(true);
    expect(await captions.text()).toMatch(/^WEBVTT/);
  }
});

test('aula de IA oferece vídeo completo e complemento vertical com legendas', async ({ page, request }) => {
  await page.goto('/cursos/ia/aulas/conversar-com-ia');
  for (const [title, file, width, height, duration] of [
    ['Conversar, pesquisar e proteger informações', 'Aula-I4', 1280, 720, 337],
    ['Como proteger dados ao usar IA', 'Aula-I4-extra', 720, 1280, 67],
  ] as const) {
    if (height > width) await page.getByText('Vídeo curto: como proteger dados ao usar IA · Vertical · 1min07s', { exact: true }).click();
    const section = page.getByRole('region', { name: `Videoaula: ${title}`, exact: true });
    await section.getByRole('button', { name: 'Assistir à videoaula' }).click();
    const video = section.locator('video');
    await video.evaluate((element: HTMLVideoElement) => element.load());
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate((element: HTMLVideoElement) => [element.videoWidth, element.videoHeight])).toEqual([width, height]);
    expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeCloseTo(duration, 0);
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await expect(video.locator('track')).toHaveAttribute('src', `/media/${file}.pt-BR.vtt`);
    const captions = await request.get(`/media/${file}.pt-BR.vtt`);
    expect(captions.ok()).toBe(true);
    expect(await captions.text()).toMatch(/^WEBVTT/);
  }
});
