import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { courses } from "../../packages/content";
test("curso de IA completo sem conta, mídia ou assistente", async ({
  page,
}) => {
  const course = courses.find((c) => c.id === "ia")!;
  expect(course.lessons).toHaveLength(7);
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") requests.push(r.url());
  });
  for (const lesson of course.lessons) {
    await page.goto(`/cursos/ia/aulas/${lesson.id}`);
    await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
    for (const slide of lesson.slides)
      await expect(
        page.getByRole("heading", { name: slide.title, exact: true }),
      ).toBeVisible();
    for (let i = 0; i < lesson.questions.length; i++) {
      const question = lesson.questions[i];
      await page
        .getByLabel(question.options.find((o) => o.correct)!.text, {
          exact: true,
        })
        .check();
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
  expect(requests).toEqual([]);
});
test("simulador local, investigação e retomada do curso de IA", async ({
  page,
}) => {
  await page.goto("/cursos/ia/aulas/conversar-com-ia");
  await page.getByRole("button", { name: "Continuar →", exact: true }).click();
  await page.goto("/");
  await page.getByRole("link", { name: "Continuar de onde parei" }).click();
  await expect(page).toHaveURL(/\/cursos\/ia\/aulas\/conversar-com-ia/);
  await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
  await page
    .getByRole("button", { name: "Usar uma pergunta de exemplo" })
    .click();
  await page.getByRole("button", { name: "Enviar no simulador" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Resposta previamente escrita",
  );
  await page
    .getByRole("button", { name: "Pedir um exemplo mais simples" })
    .click();
  await expect(page.getByRole("status")).toContainText("duas barreiras");
  await page.getByRole("button", { name: "Limpar conversa simulada" }).click();
  await expect(
    page.getByLabel("Pergunta de prática (até 300 caracteres)"),
  ).toHaveValue("");
  await page.goto("/cursos/ia/aulas/investigar-noticia");
  await page.getByRole("button", { name: "Ler tudo em sequência" }).click();
  await page.getByRole("button", { name: "Abrir a fonte simulada" }).click();
  await page.getByRole("button", { name: "Enganosa pelo contexto" }).click();
  await expect(page.getByRole("status")).toContainText("mensagem é enganosa");
});
