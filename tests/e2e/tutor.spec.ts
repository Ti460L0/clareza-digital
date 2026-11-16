import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const path = '/cursos/seguranca/aulas/antes-de-clicar';
async function openTutor(page: import('@playwright/test').Page, available = true) {
  await page.route('**/api/status', route => route.fulfill({ json: { available, provider: 'OpenAI' } }));
  await page.goto(path);
  await page.getByText('Conversar com o assistente da aula (opcional)', { exact: true }).click();
}
test('assistente com resposta simulada: aviso, pergunta, referência e limpeza', async ({ page }) => {
  const sent: Record<string, unknown>[] = [];
  await page.route('**/api/tutor', route => {
    sent.push(route.request().postDataJSON());
    return route.fulfill({ json: {
      kind: 'answer', generated: true, answer: 'Confira a cobrança por um caminho independente da mensagem.',
      references: [{ id: 'antes-de-clicar/pausa', title: 'Antes de clicar: Uma pausa muda a decisão', path, quote: 'Abra por conta própria o aplicativo da compra.' }],
    } });
  });
  await openTutor(page);
  await expect(page.getByRole('button', { name: 'Enviar pergunta' })).toBeDisabled();
  await page.getByLabel('Qual é sua dúvida sobre a aula?').fill('Como conferir uma cobrança?');
  await expect(page.getByRole('button', { name: 'Enviar pergunta' })).toBeDisabled();
  expect(sent).toHaveLength(0);
  await page.getByLabel('Entendi o envio à OpenAI e quero usar o assistente.').check();
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByRole('heading', { name: 'Sua conversa nesta aula' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Antes de clicar: Uma pausa muda a decisão' })).toHaveAttribute('href', path);
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({ lessonId: 'antes-de-clicar', mode: 'explain', history: [] });
  const results = await new AxeBuilder({ page }).include('.tutor').analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole('button', { name: 'Limpar conversa' }).click();
  await expect(page.getByRole('heading', { name: 'Sua conversa nesta aula' })).toHaveCount(0);
  await page.reload();
  await page.getByText('Conversar com o assistente da aula (opcional)', { exact: true }).click();
  await expect(page.getByLabel('Entendi o envio à OpenAI e quero usar o assistente.')).not.toBeChecked();
  await expect(page.getByRole('heading', { name: 'Sua conversa nesta aula' })).toHaveCount(0);
});

test('indisponibilidade não bloqueia aula e falha mantém pergunta', async ({ page }) => {
  await openTutor(page, false);
  await expect(page.getByText('O assistente de IA está indisponível.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Continuar →' }).click();
  await expect(page.getByRole('heading', { name: 'A aparência não confirma a cobrança' })).toBeVisible();
  await page.route('**/api/status', route => route.fulfill({ json: { available: true, provider: 'OpenAI' } }));
  await page.getByRole('button', { name: 'Verificar novamente' }).click();
  await page.getByLabel('Entendi o envio à OpenAI e quero usar o assistente.').check();
  await page.getByLabel('Qual é sua dúvida sobre a aula?').fill('Uma cobrança pode ser falsa?');
  await page.route('**/api/tutor', route => route.fulfill({ status: 429, json: { error: 'limited' } }));
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'O limite de perguntas' })).toBeVisible();
  await expect(page.getByLabel('Qual é sua dúvida sobre a aula?')).toHaveValue('Uma cobrança pode ser falsa?');
  await expect(page.getByRole('heading', { name: 'Sua conversa nesta aula' })).toHaveCount(0);
});

test('resposta com destino arbitrário é rejeitada e espera pode ser cancelada', async ({ page }) => {
  await openTutor(page);
  await page.getByLabel('Entendi o envio à OpenAI e quero usar o assistente.').check();
  await page.getByLabel('Qual é sua dúvida sobre a aula?').fill('Como conferir cobrança?');
  await page.route('**/api/tutor', route => route.fulfill({ json: {
    kind: 'answer', generated: true, answer: 'Uma resposta com destino arbitrário.',
    references: [{ id: 'falsa', title: 'Destino inválido', path: 'https://destino.example', quote: 'Trecho que não é válido.' }],
  } }));
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Não foi possível obter' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Destino inválido' })).toHaveCount(0);
  await page.route('**/api/tutor', () => {});
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await page.getByRole('button', { name: 'Cancelar espera' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Espera cancelada' })).toBeVisible();
  await expect(page.getByLabel('Qual é sua dúvida sobre a aula?')).toBeEnabled();
});
