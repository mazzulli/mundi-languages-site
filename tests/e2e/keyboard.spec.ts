import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Keyboard, screen-reader and reduced-motion flows (spec §9, WCAG 2.2 AA). */

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
});

async function expectNoAxeViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
  ]);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  expect(
    violations.map(
      (violation) => `${violation.id}: ${violation.nodes.map((n) => n.target).join(", ")}`,
    ),
  ).toEqual([]);
}

test("skip link is the first stop and moves focus to the main content", async ({ page }) => {
  await page.goto("/cursos-de-ingles/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#conteudo")).toBeFocused();
});

test("focus is always visible on links and buttons", async ({ page }) => {
  await page.goto("/");
  for (let index = 0; index < 6; index++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement;
      const style = getComputedStyle(element);
      return {
        style: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
        tag: element.tagName,
      };
    });
    expect.soft(outline.style, `focus ring on ${outline.tag} #${index}`).not.toBe("none");
    expect
      .soft(outline.width, `focus ring width on ${outline.tag} #${index}`)
      .toBeGreaterThanOrEqual(2);
  }
});

test("Soluções mega menu: keyboard disclosure, Escape returns focus", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop navigation");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Soluções" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
  await expect(panel).toBeVisible();
  await expectNoAxeViolations(page, "header");

  // Tab moves into the panel links.
  await page.keyboard.press("Tab");
  expect(await panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("mobile menu: modal dialog, focus trapped, Escape returns focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile navigation");
  await page.goto("/");
  const open = page.getByRole("button", { name: "Abrir menu" });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expectNoAxeViolations(page, "[role=dialog]");

  // Focus never leaves the dialog while it is open.
  for (let index = 0; index < 30; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test("testimonial carousel: operable buttons, pause control, labelled slides", async ({
  page,
  isMobile,
}) => {
  await page.goto("/cursos-de-ingles/");
  const carousel = page.getByRole("region", { name: /Depoimentos/ }).first();
  await carousel.scrollIntoViewIfNeeded();
  const nextButton = carousel.getByRole("button", { name: "Próximo depoimento" });
  test.skip(!(await nextButton.isVisible()), "All testimonials fit — no controls");
  await expect(nextButton).toBeEnabled();
  const counter = carousel.getByText(/^\d+ \/ \d+$/);
  const before = await counter.textContent();

  const pause = carousel.getByRole("button", { name: /rotação automática/ });
  if ((await pause.getAttribute("aria-label")) === "Pausar a rotação automática")
    await pause.click();
  await expect(pause).toHaveAttribute("aria-label", "Retomar a rotação automática");
  await expect(counter).toHaveAttribute("aria-live", "polite");

  await nextButton.focus();
  await page.keyboard.press("Enter");
  await expect(counter).not.toHaveText(before ?? "");
  expect(await carousel.getByRole("group").first().getAttribute("aria-roledescription")).toBe(
    "slide",
  );
  if (!isMobile) await expectNoAxeViolations(page, "[aria-roledescription=carrossel]");
});

test("form errors are announced and tied to their fields", async ({ page }) => {
  await page.goto("/contato/");
  const submit = page.getByRole("button", { name: /Enviar/ });
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  const invalid = page.locator("[aria-invalid=true]");
  await expect(invalid.first()).toBeVisible();
  await expect(invalid.first()).toBeFocused();
  for (const field of await invalid.all()) {
    const describedBy = await field.getAttribute("aria-describedby");
    expect(describedBy, (await field.getAttribute("name")) ?? "").toBeTruthy();
    const message = page.locator(`#${describedBy!.split(" ").join(", #")}`);
    await expect(message.first()).toBeVisible();
  }
  await expectNoAxeViolations(page, "form");
});

test.describe("prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no autoplay, no smooth scroll hijack, content visible without animation", async ({
    page,
  }) => {
    await page.goto("/cursos-de-ingles/");
    const carousel = page.getByRole("region", { name: /Depoimentos/ }).first();
    await carousel.scrollIntoViewIfNeeded();
    const pause = carousel.getByRole("button", { name: /rotação automática/ });
    if (await pause.isVisible()) {
      await expect(pause).toBeEnabled();
      await expect(pause).toHaveAttribute("aria-label", "Retomar a rotação automática");
    }
    // Reveal targets are shown immediately (no opacity animation left hidden).
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
          (element) => getComputedStyle(element).opacity === "0",
        ).length,
    );
    expect(hidden).toBe(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(
      false,
    );
  });
});

test("WhatsApp button opens a chat with the school's number", async ({
  page,
  context,
  isMobile,
}) => {
  await context.route("https://wa.me/**", (route) => route.fulfill({ body: "whatsapp" }));
  await context.route("https://api.whatsapp.com/**", (route) =>
    route.fulfill({ body: "whatsapp" }),
  );
  await page.goto("/cursos-de-espanhol/");
  // Desktop: floating button (after some scroll). Mobile: the fixed bottom bar.
  if (!isMobile) await page.mouse.wheel(0, 900);
  // WCAG 2.5.3: the accessible name contains the visible label.
  const button = page.getByRole("link", { name: isMobile ? /^WhatsApp/ : /^Fale com a Karine/ });
  const href = await button.getAttribute("href");
  expect(href).toContain("351927372627");
  const [popup] = await Promise.all([page.waitForEvent("popup"), button.click()]);
  expect(popup.url()).toContain("351927372627");
});
