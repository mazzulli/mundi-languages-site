import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  "/",
  "/empresas-e-profissionais/",
  "/cursos-de-ingles/",
  "/cursos-de-portugues/",
  "/cursos-de-espanhol/",
  "/cursos-de-frances/",
  "/cursos-de-italiano/",
  "/cursos-de-alemao/",
  "/solucoes-para-professores/",
  "/comofunciona/",
];

/** Collects runtime errors, ignoring 404s of pages not built yet (Phases 5–6). */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("404")) errors.push(message.text());
  });
  return errors;
}

test.beforeEach(async ({ context }) => {
  // Skip the first-visit preloader.
  await context.addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
});

for (const path of PAGES) {
  test(`${path} renders one H1 and no runtime errors while scrolling`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    // Walk down the page so lazy sections, carousels and observers run.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
}

test("Home card anchor lands on the Soft Skills program of Empresas", async ({ page }) => {
  await page.goto("/empresas-e-profissionais/#soft-skills");
  await expect(page.locator("#soft-skills")).toBeInViewport();
  await expect(page.locator("#soft-skills h3")).toHaveText("Soft Skills");
});

test("program CTAs open the form with the course pre-selected", async ({ page }) => {
  await page.goto("/cursos-de-frances/");
  const cta = page.getByRole("link", { name: "Quero o Conversação" });
  await expect(cta).toHaveAttribute("href", "/agendamento/?idioma=fr&curso=conversacao");
});

test("German page offers no level test (there is none)", async ({ page }) => {
  await page.goto("/cursos-de-alemao/");
  await expect(
    page.getByRole("link", { name: /teste de nível/i }).filter({ hasNotText: "Teste de nível" }),
  ).toHaveCount(0);
  await expect(page.locator("main a[href*='teste-o-seu']")).toHaveCount(0);
});

test("teacher flip card works with the keyboard and hides the inactive face", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Keyboard flow");
  await page.goto("/solucoes-para-professores/");
  const card = page.locator("#teaching-online");
  const flip = card.getByRole("button", { name: "Para quem é?" });
  await flip.focus();
  await page.keyboard.press("Enter");
  await expect(card.locator("[data-flipped]")).toHaveCount(1);
  await expect(card.getByRole("link", { name: "Agendar análise de necessidades" })).toBeVisible();
  await card.getByRole("button", { name: "Voltar" }).click();
  await expect(card.locator("[data-flipped]")).toHaveCount(0);
});

test("Como Funciona journey pins while scrolling (desktop)", async ({ page, isMobile }) => {
  test.skip(isMobile, "The journey is a vertical list on mobile");
  await page.goto("/comofunciona/");
  const journey = page.locator(".journey");
  await expect(journey).toHaveAttribute("data-pinned", "", { timeout: 5_000 });
  await journey.scrollIntoViewIfNeeded();
  const before = await page
    .locator("[data-journey-track]")
    .evaluate((el) => el.getBoundingClientRect().x);
  await page.mouse.move(700, 450);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);
  await expect
    .poll(
      () => page.locator("[data-journey-track]").evaluate((el) => el.getBoundingClientRect().x),
      { timeout: 4_000 },
    )
    .toBeLessThan(before - 300);
});
