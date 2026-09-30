import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Every public page (spec §9: WCAG 2.2 AA). */
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
  "/contato/",
  "/agendamento/",
  "/teste-de-nivel/",
  "/teste-o-seu-ingles-3/",
  "/teachers-needs-analysis/",
  "/professores-parceiros/",
  "/blog/",
  "/category/learners/",
  "/como-usar-a-tecnica-star-para-entrevistas/",
  "/sobre/",
  "/link-in-bio/",
  "/politica-de-privacidade/",
  "/pagina-inexistente/",
];

// Long pages: full scroll + axe analysis exceed the default 30s when workers compete for CPU.
test.describe.configure({ timeout: 60_000 });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => sessionStorage.setItem("ml-visited", "1"));
});

/** Scrolls the whole page so every scroll-revealed element reaches its final state. */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  // axe measures colors mid-transition as blended (false contrast failures): wait until every
  // finite animation/transition is done. Infinite loops (marquee, ambient blobs) are ignored.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== "running" ||
          animation.effect?.getComputedTiming().iterations === Infinity,
      ),
  );
}

for (const path of PAGES) {
  test(`axe WCAG 2.2 AA: ${path}`, async ({ page }) => {
    await page.goto(path);
    await revealAll(page);
    const { violations: wcag } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      // Third-party iframes (Google Forms / Maps) are outside our control.
      .exclude("iframe")
      .analyze();
    // WCAG 2.5.3 Label in Name — an experimental axe rule, run on its own. Card links are
    // excluded on purpose: they are named "title + action" (aria-labelledby) instead of
    // reading the photo, greeting and whole description, and that name is visible text.
    const { violations: labelInName } = await new AxeBuilder({ page })
      .withRules(["label-content-name-mismatch"])
      .exclude("iframe")
      .exclude("a[aria-labelledby]")
      .analyze();
    const violations = [...wcag, ...labelInName];
    const summary = violations.map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help}\n` +
        violation.nodes
          .slice(0, 5)
          .map(
            (node) =>
              `    ${node.target.join(" ")} — ${node.failureSummary?.split("\n")[1]?.trim() ?? ""}`,
          )
          .join("\n"),
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });
}
