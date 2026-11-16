import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("aula, simulação, quiz, retomada e reinício", async ({ page }) => {
  await page.goto("/cursos/seguranca/aulas/antes-de-clicar");
  await expect(
    page.getByRole("heading", { name: "Antes de clicar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continuar →", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "A aparência não confirma a cobrança" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "5. Experimentar", exact: true })
    .click();
  await page.getByRole("button", { name: "Abrir exemplo ilustrado" }).click();
  await expect(page.getByText("Nenhum campo aceita dados")).toBeVisible();
  expect(await page.locator("input[type=password]").count()).toBe(0);
  await page
    .getByRole("button", { name: "Conferir por outro caminho", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "abriu, por conta própria",
  );
  await page.getByRole("button", { name: "6. Praticar decisões" }).click();
  await page
    .getByLabel("Abrir o aplicativo da compra por conta própria.")
    .check();
  await page.getByRole("button", { name: "Conferir resposta" }).click();
  await expect(page.getByRole("status")).toContainText("ajuda a conferir");
  await page.getByRole("button", { name: "Próxima questão" }).click();
  await page
    .getByLabel("Não consigo confirmar; vou por outro caminho.")
    .check();
  await page.getByRole("button", { name: "Conferir resposta" }).click();
  await page.getByRole("button", { name: "Continuar →", exact: true }).click();
  await page
    .getByRole("button", { name: "Concluir aula", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Aula concluída");
  await page.getByRole("button", { name: "Reiniciar esta aula" }).click();
  await page.getByRole("button", { name: "Sim, reiniciar aula" }).click();
  await expect(
    page.getByRole("heading", { name: "Uma pausa muda a decisão" }),
  ).toBeVisible();
});
test("acessibilidade automática e largura", async ({ page }) => {
  for (const route of [
    "/",
    "/cursos",
    "/cursos/seguranca/aulas/antes-de-clicar",
    "/praticar",
    "/privacidade",
  ]) {
    await page.goto(route);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        width => document.documentElement.scrollWidth <= width,
        page.viewportSize()!.width,
      ),
    ).toBe(true);
  }
});
test("estudo com armazenamento bloqueado", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  await page.goto("/cursos/seguranca/aulas/antes-de-clicar");
  await expect(page.getByRole("status")).toContainText("armazenamento");
  await page.getByRole("button", { name: "Continuar →", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A aparência não confirma a cobrança" }),
  ).toBeVisible();
});

import { courses } from "../../packages/content";
test("curso de segurança completo, alternativas e referências", async ({
  page,
}) => {
  const course = courses.find((c) => c.id === "seguranca")!;
  expect(course.lessons).toHaveLength(6);
  for (const lesson of course.lessons) {
    await page.goto(`/cursos/seguranca/aulas/${lesson.id}`);
    await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
    for (const slide of lesson.slides)
      await expect(
        page.getByRole("heading", { name: slide.title, exact: true }),
      ).toBeVisible();
    for (let i = 0; i < lesson.questions.length; i++) {
      const question = lesson.questions[i];
      const selected = question.options.find((o) => o.correct)!;
      await page.getByLabel(selected.text, { exact: true }).check();
      await page
        .getByRole("button", { name: "Conferir resposta", exact: true })
        .click();
      for (const option of question.options)
        await expect(
          page
            .locator(".feedback")
            .getByText(option.explanation, { exact: false }),
        ).toBeVisible();
      if (i < lesson.questions.length - 1)
        await page.getByRole("button", { name: "Próxima questão" }).click();
    }
    await page
      .getByRole("button", { name: "Concluir aula", exact: true })
      .click();
    await expect(
      page.getByText(
        "Aula concluída. Você pode revisar e praticar quantas vezes quiser.",
      ),
    ).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  await page.goto("/cursos/seguranca");
  await expect(page.getByText("Concluída", { exact: true })).toHaveCount(6);
});
test("mensagens e mídia sem download automático", async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) mediaRequests.push(request.url());
  });
  await page.goto("/cursos/seguranca/aulas/quem-esta-falando");
  await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
  await page
    .getByRole("button", { name: "Ligar para o contato anterior" })
    .click();
  await expect(
    page.getByText("Ligação simulada ao número anterior"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ver a explicação" }).click();
  await expect(
    page.getByText("Você confirmou por um caminho independente.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(mediaRequests).toEqual([]);
  await page
    .getByText("Ler transcrição e sequência estática", { exact: true })
    .click();
  await expect(
    page.getByText("Use o contato anterior", { exact: true }),
  ).toBeVisible();
  await page.goto("/cursos/seguranca/aulas/falsa-central");
  await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
  await page
    .getByRole("button", { name: "Encerrar e abrir o aplicativo do banco" })
    .click();
  await expect(
    page.getByText("Consulta simulada no aplicativo já conhecido"),
  ).toBeVisible();
});
