import { expect, test } from "@playwright/test";

/** The custom cursor exists only in the Home "Outros idiomas" section (user request). */
test("custom cursor is scoped to the Outros idiomas section", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse-only feature");
  await page.context().addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
  await page.goto("/");

  const zone = page.locator(".cursor-zone-active");
  const label = page.getByText("Ver cursos →");

  // Another section with cards: no custom cursor.
  const featured = page.locator("#programs-title").locator("xpath=ancestor::section");
  await featured.scrollIntoViewIfNeeded();
  await featured.getByRole("link").first().hover();
  await expect(zone).toHaveCount(0);

  // Outros idiomas: cursor active, native cursor hidden, label over the language cards.
  const languages = page.locator("#languages-title").locator("xpath=ancestor::section");
  await languages.scrollIntoViewIfNeeded();
  await languages.getByRole("link", { name: /Português/ }).hover();
  await expect(zone).toHaveCount(1);
  await expect(label).toBeVisible();
  await expect
    .poll(() =>
      languages
        .getByRole("link", { name: /Português/ })
        .evaluate((el) => getComputedStyle(el).cursor),
    )
    .toBe("none");

  // Leaving the section turns it off again.
  await featured.scrollIntoViewIfNeeded();
  await featured.getByRole("link").first().hover();
  await expect(zone).toHaveCount(0);
});
