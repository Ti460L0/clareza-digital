import { test, expect } from '@playwright/test';
import { courses } from '../../packages/content';
test('rotas diretas recebem HTML e cabeçalhos de segurança no Workers local', async ({ request }) => {
  for (const course of courses) for (const lesson of course.lessons) {
    const response = await request.get(`/cursos/${course.id}/aulas/${lesson.id}`, { headers: { Accept: 'text/html', 'Sec-Fetch-Mode': 'navigate' } });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response.headers()['x-content-type-options']).toBe('nosniff');
  }
});
test('API nunca cai no HTML da SPA, mesmo em navegação', async ({ request }) => {
  const response = await request.get('/api/status', { headers: { Accept: 'text/html', 'Sec-Fetch-Mode': 'navigate' } });
  expect(response.status()).toBe(503);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({ error: 'unavailable' });
  expect((await request.get('/api/inexistente')).status()).toBe(404);
});
test('página funciona sob CSP e vídeo reproduz no serviço de arquivos estáticos', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.text().includes('Content Security Policy')) errors.push(message.text()); });
  await page.goto('/cursos/seguranca/aulas/antes-de-clicar');
  await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
  await expect(page.getByRole('heading', { name: 'Uma pausa muda a decisão' })).toBeVisible();
  await expect(page.getByText('Conversar com o assistente da aula (opcional)', { exact: true })).toHaveCount(0);
  const media = await request.get('/media/SmsEntrega.mp4', { headers: { Range: 'bytes=0-1023' } });
  // Workers Static Assets deliberately returns the full file for Range requests.
  expect(media.status()).toBe(200);
  expect(media.headers()['content-type']).toContain('video/mp4');
  expect((await media.body()).byteLength).toBe(475076);
  await page.getByRole('button', { name: 'Assistir à videoaula' }).click();
  const video = page.locator('video');
  await video.evaluate((element: HTMLVideoElement) => element.load());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
  await video.evaluate(async (element: HTMLVideoElement) => {
    await element.play();
    element.pause();
    await new Promise<void>(resolve => {
      element.addEventListener('seeked', () => resolve(), { once: true });
      element.currentTime = 25;
    });
  });
  expect(await video.evaluate((element: HTMLVideoElement) => element.error)).toBeNull();
  expect(errors).toEqual([]);
});

test('publicação padrão oferece as treze aulas sem assistente ou chamada de API', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  for (const course of courses) for (const lesson of course.lessons) {
    await page.goto(`/cursos/${course.id}/aulas/${lesson.id}`);
    await page.getByRole('button', { name: 'Ler tudo em sequência' }).click();
    await expect(page.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Assistente da aula' })).toHaveCount(0);
  }
  await page.goto('/privacidade');
  await expect(page.getByText('Esta versão não oferece assistente generativo.', { exact: false })).toBeVisible();
  expect(apiRequests).toEqual([]);
});
