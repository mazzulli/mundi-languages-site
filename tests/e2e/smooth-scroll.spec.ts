import { expect, test } from "@playwright/test";

/**
 * Regression: Lenis created without `autoRaf` swallowed wheel events and the page only
 * scrolled with the keyboard. Uses the real mouse wheel (window.scrollTo bypasses Lenis).
 */
test("the Home scrolls with the mouse wheel", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse wheel is a desktop interaction");

  await page.goto("/");
  // Lenis is attached on idle (can take a while when several browsers share the CPU).
  await expect(page.locator("html")).toHaveClass(/\blenis\b/, { timeout: 15_000 });

  await page.mouse.move(700, 450);
  for (let i = 0; i < 4; i++) await page.mouse.wheel(0, 400);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3_000 })
    .toBeGreaterThan(800);

  await page.mouse.wheel(0, -2000);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3_000 })
    .toBeLessThan(100);
});

test("the Home scrolls with the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard scrolling is a desktop interaction");

  await page.goto("/");
  await page.locator("body").click({ position: { x: 5, y: 300 } });
  await page.keyboard.press("PageDown");
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 3_000 })
    .toBeGreaterThan(300);
});
