import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
});

const group = (page: Page, name: RegExp) => page.getByRole("group", { name });

/** Clicks a visible choice chip (its native input is visually hidden), as a person would. */
const choose = (page: Page, question: RegExp, option: string) =>
  group(page, question).getByText(option, { exact: true }).click();
/**
 * Waits until the (Lenis) smooth scroll stops. Clicking while it animates makes Playwright
 * aim at the button's previous position — a person simply clicks where the button is.
 */
async function settleScroll(page: Page) {
  let previous = -1;
  await expect
    .poll(
      async () => {
        const current = await page.evaluate(() => window.scrollY);
        const stable = current === previous;
        previous = current;
        return stable;
      },
      { intervals: [120] },
    )
    .toBe(true);
}

async function next(page: Page) {
  await settleScroll(page);
  await page.getByRole("button", { name: "Continuar" }).click();
}

async function answerGrid(page: Page, question: RegExp, answer: string) {
  const fieldset = group(page, question);
  for (const row of await fieldset.getByRole("radiogroup").all()) {
    await row.getByText(answer, { exact: true }).click();
  }
}

test("needs analysis: CTA pre-selection, per-step validation and submission", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await page.route("**/api/needs-analysis/", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true, delivery: "sent" } });
  });

  await page.goto("/agendamento/?idioma=fr&curso=conversacao");
  await expect(page.getByText("Etapa 1 de 6")).toBeVisible();

  // Step 1 — empty required fields block the way and show errors.
  await next(page);
  await expect(page.getByText("Etapa 1 de 6")).toBeVisible();
  await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
  await expect(page.locator("#email")).toBeFocused();

  await page.locator("#email").fill("aluna@example.com");
  await page.locator("#name").fill("Aluna Teste");
  await page.locator("#country").fill("Brasil");
  await next(page);

  // Step 2 — the language and course chosen on /cursos-de-frances/ are pre-selected.
  await expect(page.getByText("Etapa 2 de 6")).toBeVisible();
  await expect(page.getByText("Já marcamos Conversação")).toBeVisible();
  await expect(
    group(page, /Que língua\(s\) gostaria de aprender/).getByLabel("Francês"),
  ).toBeChecked();
  await expect(group(page, /Em que curso\(s\)/).getByLabel("Français")).toBeChecked();
  await page.locator("#nativeLanguage").fill("Português");
  // "Se fala, quais são?" only appears (and is required) after answering "Sim".
  await expect(group(page, /Se fala, quais são/)).toHaveCount(0);
  await choose(page, /Você fala outras línguas/, "Sim");
  await next(page);
  await expect(page.getByText("Escolha pelo menos uma opção.")).toBeVisible();
  await choose(page, /Se fala, quais são/, "Inglês");
  await next(page);

  // Step 3
  await expect(page.getByText("Etapa 3 de 6")).toBeVisible();
  await choose(page, /Você já estudou a língua-alvo/, "Não");
  await choose(page, /Que nível linguístico/, "A2 Elementary");
  await next(page);

  // Step 4 — grids must be answered row by row.
  await expect(page.getByText("Etapa 4 de 6")).toBeVisible();
  await answerGrid(page, /Com que frequência precisa utilizar/, "Às vezes");
  await choose(page, /Por que você quer aprender/, "Viagem");
  await choose(page, /Em quais áreas tem mais dificuldade/, "Fala");
  await answerGrid(page, /Como classificaria as suas competências/, "3");
  await next(page);

  // Step 5
  await expect(page.getByText("Etapa 5 de 6")).toBeVisible();
  await choose(page, /Que assuntos gostaria/, "Viagens");
  await choose(page, /Com que frequência gostaria de ter atividades/, "2x/semana");
  await choose(page, /Quantos minutos\/horas/, "30 min");
  await page.locator("#hobbies").fill("Cinema e culinária");
  await page.locator("#goals").fill("Viajar para a França, conversar com confiança, ler um livro");
  await next(page);

  // Step 6 — optional schedule, then submit.
  await expect(page.getByText("Etapa 6 de 6")).toBeVisible();
  await page.getByRole("button", { name: "SEG às 9h", exact: true }).click();
  await page.getByRole("button", { name: "Enviar e agendar minha consulta" }).click();

  await expect(page.getByText("Recebemos o seu levantamento!")).toBeVisible();
  await expect(page.getByRole("link", { name: /Falar agora no WhatsApp/ })).toBeVisible();
  expect(payload).toMatchObject({
    email: "aluna@example.com",
    targetLanguages: ["Francês"],
    interests: ["Français"],
    otherLanguages: ["Inglês"],
    availability: ["SEG 9h"],
    context: { idioma: "fr", curso: "conversacao" },
  });
});

test("needs analysis: the draft survives a reload", async ({ page }) => {
  await page.goto("/agendamento/");
  await page.locator("#name").fill("Rascunho Salvo");
  await page.waitForTimeout(700); // debounce
  await page.reload();
  await expect(page.locator("#name")).toHaveValue("Rascunho Salvo");
  await expect(page.getByText("Recuperamos as respostas")).toBeVisible();
  await page.getByRole("button", { name: "Começar do zero" }).click();
  await expect(page.locator("#name")).toHaveValue("");
});

/**
 * Only invalid payloads here: the server may have a real RESEND_API_KEY (.env.local), and a
 * valid payload would send a real e-mail to the school on every run.
 */
test("needs analysis and contact APIs reject invalid payloads", async ({ request }) => {
  expect((await request.post("/api/needs-analysis/", { data: { email: "x" } })).status()).toBe(422);
  expect((await request.post("/api/contact/", { data: { name: "" } })).status()).toBe(422);
  // Bots filling the honeypot never reach the e-mail step either (checked after validation).
});

test("contact form validates and sends", async ({ page }) => {
  await page.route("**/api/contact/", (route) => route.fulfill({ json: { ok: true } }));
  await page.goto("/contato/");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByText("Informe o seu nome.")).toBeVisible();
  await page.getByLabel(/^Nome/).fill("Visitante");
  await page.getByLabel(/^E-mail/).fill("visitante@example.com");
  await choose(page, /Você é/, "Empresa / RH");
  await page.getByLabel(/^Mensagem/).fill("Gostaria de uma proposta para a minha equipe.");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByText("Mensagem enviada!")).toBeVisible();
});

test("an autofilled honeypot never blocks the contact submit on the client", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/contact/", (route) => {
    requests++;
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contato/");
  // Simulate browser autofill writing into the hidden anti-bot field.
  await page.locator('input[name="hp_check"]').evaluate((input: HTMLInputElement) => {
    input.value = "https://example.com";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByLabel(/^Nome/).fill("Visitante");
  await page.getByLabel(/^E-mail/).fill("visitante@example.com");
  await choose(page, /Você é/, "Aluno / profissional");
  await page.getByLabel(/^Mensagem/).fill("Mensagem com o campo oculto preenchido.");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByText("Mensagem enviada!")).toBeVisible();
  expect(requests).toBe(1);
});

test("level test hub lists the 6 languages; German goes to the consultation", async ({ page }) => {
  await page.goto("/teste-de-nivel/");
  const links = page.locator("main ul a");
  await expect(links).toHaveCount(6);
  await expect(page.getByRole("link", { name: /Fazer o teste de francês/ })).toHaveAttribute(
    "href",
    "/teste-o-seu-frances/",
  );
  await expect(
    page.getByRole("link", { name: /Alemão/ }).filter({ hasText: "Agendar uma consulta" }),
  ).toHaveAttribute("href", "/agendamento/?idioma=de");
});

test("level test page embeds its Google Form", async ({ page }) => {
  await page.goto("/teste-o-seu-ingles-3/");
  await expect(page.locator("h1")).toHaveText("Teste o seu inglês");
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /1FAIpQLSfkmOUrktxS3zauSbl4630mxL_LUox7f33crQUSJ8G-QDj_Uw/,
  );
});
