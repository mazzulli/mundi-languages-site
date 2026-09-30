import { expect, test, type Page } from "@playwright/test";

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("404")) errors.push(message.text());
  });
  return errors;
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
});

test("blog listing: featured post, grid and legacy pagination", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/blog/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const articles = page.getByRole("main").getByRole("article");
  await expect(articles).toHaveCount(10);
  await page
    .getByRole("navigation", { name: "Paginação" })
    .getByRole("link", { name: "Página 2" })
    .click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
  await expect(page.getByRole("main").getByRole("article")).toHaveCount(4);
  expect(errors).toEqual([]);
});

test("category pages list only their posts", async ({ page }) => {
  await page.goto("/category/teachers-learners/");
  await expect(page.getByRole("heading", { level: 1, name: "Teachers & Learners" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Teachers & Learners", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("search spans every page, accent-insensitive", async ({ page }) => {
  await page.goto("/blog/");
  await page.getByLabel("Buscar no blog").fill("pascoa");
  await expect(page.getByRole("heading", { name: /Páscoa/ })).toBeVisible();
  await page.getByLabel("Buscar no blog").fill("tecnica star");
  await expect(
    page.getByRole("heading", { name: "Como usar a técnica STAR para entrevistas" }),
  ).toBeVisible();
});

test("post page: content, contextual CTAs, related posts and reading progress", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/como-usar-a-tecnica-star-para-entrevistas/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Como usar a técnica STAR para entrevistas" }),
  ).toBeVisible();
  await expect(page.getByText("O que é a técnica STAR para entrevistas?")).toBeVisible();
  // Mid-article + end CTAs (the aside copy is desktop-only).
  await expect(
    page.locator("#post-body").getByRole("complementary", { name: /English for Interviews/ }),
  ).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Continue lendo" })).toBeVisible();

  const bar = page.getByRole("progressbar", { name: "Progresso de leitura" });
  await expect(bar).toHaveAttribute("aria-valuenow", "0");
  await page.locator("#related-title").scrollIntoViewIfNeeded();
  await expect.poll(async () => Number(await bar.getAttribute("aria-valuenow"))).toBe(100);
  expect(errors).toEqual([]);
});

test("every post renders its migrated images", async ({ page }) => {
  await page.goto("/9-expressoes-que-voce-precisa-aprender-neste-ramada/");
  const images = page.locator("article img");
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) await expect(image).toHaveAttribute("alt", /.+/);
});

test("unknown root slugs are 404", async ({ page }) => {
  const response = await page.goto("/um-post-que-nao-existe/");
  expect(response?.status()).toBe(404);
});

test("leaving a post while scrolling does not crash the reading progress", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/como-usar-a-tecnica-star-para-entrevistas/");
  await page.mouse.wheel(0, 1500);
  await page
    .getByRole("navigation", { name: "Você está em" })
    .getByRole("link", { name: "Blog" })
    .click();
  await page.mouse.wheel(0, 800);
  await expect(page).toHaveURL(/\/blog\/$/);
  await page.waitForTimeout(800);
  expect(errors).toEqual([]);
});
