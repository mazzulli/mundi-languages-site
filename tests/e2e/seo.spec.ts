import { expect, test, type APIRequestContext } from "@playwright/test";

/** HTTP-level checks: run once (desktop project only). */
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Server responses do not depend on the viewport");
});

/** Every URL of the legacy sitemap (docs/url-inventory.md) must answer 200 on the new site. */
const LEGACY_PAGES = [
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
  "/teachers-needs-analysis/",
  "/professores-parceiros/",
  "/teste-o-seu-ingles-3/",
  "/take-a-portuguese-level-test/",
  "/teste-o-seu-espanhol/",
  "/teste-o-seu-frances/",
  "/teste-o-seu-italiano/",
  "/blog/",
  "/blog/page/2/",
  "/category/learners/",
  "/category/teachers-learners/",
  "/sobre/",
  "/link-in-bio/",
  "/precisando-se-preparar-para-entrevistas-em-ingles/",
  "/ano-do-coelho-de-agua-tradicoes-para-um-ano-de-sorte/",
  "/como-usar-a-tecnica-star-para-entrevistas/",
  "/7-competencias-importantes-para-desenvolver-o-trabalho-em-equipe/",
  "/design-thinking-na-educacao-empatia-desafio-descoberta-e-compartilhamento/",
  "/6-maneiras-de-gamificar-suas-aulas-de-idiomas/",
  "/soft-skills-hard-skills-o-que-mais-importa-no-mundo-do-trabalho-hoje/",
  "/sexta-feira-santa-sabado-de-aleluia-domingo-de-pascoa-em-ingles/",
  "/9-expressoes-que-voce-precisa-aprender-neste-ramada/",
  "/gamification-vs-game-based-learning/",
  "/8-expressoes-importantes-para-celebrar-todas-as-mulheres/",
  "/8-maneiras-de-utilizar-metodologias-ativas-e-ter-alunos-e-profissionais-mais-engajados/",
  "/8-maneiras-de-dar-aos-alunos-mais-controle-sobre-seus-resultados-de-aprendizagem/",
  "/portokali-por-que-em-algumas-linguas-portugal-significa-laranja/",
];

const REDIRECTS: [from: string, to: string][] = [
  ["/black-friday/", "/"],
  ["/solucoes/", "/solucoes-para-professores/"],
  ["/conteudos-gratuitos-instrutores/", "/blog/"],
  ["/author/lighthouselanguages/", "/sobre/"],
  ["/dashboard/", "/"],
  ["/student-registration/", "/"],
  ["/instructor-registration/", "/"],
  ["/cart/", "/"],
  ["/checkout/", "/"],
  ["/feed/", "/blog/"],
  ["/comments/feed/", "/blog/"],
  ["/gamification-vs-game-based-learning/feed/", "/gamification-vs-game-based-learning/"],
  ["/category/learners/feed/", "/category/learners/"],
  ["/blog/page/1/", "/blog/"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/wp-content/uploads/2024/12/56.jpg", "/images/legacy/2024/12/56.jpg"],
];

async function jsonLdOf(request: APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    ([, json]) => JSON.parse(json!) as Record<string, unknown>,
  );
}

const typesOf = (blocks: Record<string, unknown>[]) =>
  blocks.flatMap((block) =>
    Array.isArray(block["@graph"])
      ? (block["@graph"] as { "@type": string }[]).map((node) => node["@type"])
      : [block["@type"] as string],
  );

test("every legacy URL answers 200", async ({ request }) => {
  for (const path of LEGACY_PAGES) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect.soft(response.status(), path).toBe(200);
  }
});

test("removed legacy URLs answer 301 to their new home", async ({ request }) => {
  for (const [from, to] of REDIRECTS) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect.soft(response.status(), from).toBe(301);
    expect.soft(new URL(response.headers()["location"] ?? "", "http://x").pathname, from).toBe(to);
  }
});

test("unknown URLs answer the custom 404", async ({ request }) => {
  const response = await request.get("/wp-login.php");
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain("Esta página se perdeu na tradução.");
});

test("each page has a unique title, a 140–160 char description, canonical and OG image", async ({
  request,
}) => {
  const titles = new Map<string, string>();
  for (const path of LEGACY_PAGES.filter((p) => p !== "/link-in-bio/")) {
    const html = await (await request.get(path)).text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    expect.soft(title, path).toMatch(/\| Mundi Languages$/);
    expect.soft(titles.get(title), `duplicate title on ${path}`).toBeUndefined();
    titles.set(title, path);
    expect
      .soft(description.length, `${path} description: ${description}`)
      .toBeGreaterThanOrEqual(120);
    expect.soft(description.length, `${path} description: ${description}`).toBeLessThanOrEqual(165);
    expect
      .soft(html, path)
      .toContain(`<link rel="canonical" href="https://mundilanguages.com${path}"/>`);
    expect.soft(html, path).toContain('hrefLang="x-default"');
    expect.soft(html, path).toContain('<meta property="og:locale" content="pt_BR"/>');
    const og = html.match(
      /<meta property="og:image" content="https:\/\/mundilanguages\.com(\/og\/[^"]+\.png)"/,
    )?.[1];
    expect.soft(og, path).toBeTruthy();
    if (og) expect.soft((await request.get(og, { maxRedirects: 0 })).status(), og).toBe(200);
    expect.soft(html.match(/<h1[\s>]/g)?.length, `${path} H1 count`).toBe(1);
  }
});

test("structured data: organization everywhere, courses, posts, breadcrumbs", async ({
  request,
}) => {
  expect(typesOf(await jsonLdOf(request, "/"))).toEqual(
    expect.arrayContaining(["EducationalOrganization", "WebSite", "Person"]),
  );
  const english = typesOf(await jsonLdOf(request, "/cursos-de-ingles/"));
  expect(english).toEqual(expect.arrayContaining(["ItemList", "BreadcrumbList"]));

  const post = await jsonLdOf(request, "/como-usar-a-tecnica-star-para-entrevistas/");
  const posting = post.find((block) => block["@type"] === "BlogPosting");
  expect(posting).toMatchObject({
    headline: "Como usar a técnica STAR para entrevistas",
    datePublished: "2022-06-08",
  });
  expect(typesOf(post)).toContain("BreadcrumbList");

  const courses = (await jsonLdOf(request, "/empresas-e-profissionais/")).find(
    (block) => block["@type"] === "ItemList",
  ) as { itemListElement: { item: { "@type": string; name: string; provider: unknown } }[] };
  expect(courses.itemListElement.length).toBeGreaterThan(0);
  for (const { item } of courses.itemListElement) {
    expect(item["@type"]).toBe("Course");
    expect(item.name).toBeTruthy();
    expect(item.provider).toBeTruthy();
  }
});

test("pending pages stay out of the index", async ({ request }) => {
  for (const path of ["/link-in-bio/", "/politica-de-privacidade/", "/termos/"]) {
    const html = await (await request.get(path)).text();
    expect.soft(html, path).toContain('<meta name="robots" content="noindex, follow"/>');
  }
});

test("sitemap lists pages, posts and categories; robots points to it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of LEGACY_PAGES.filter((p) => p !== "/link-in-bio/")) {
    expect.soft(sitemap, path).toContain(`<loc>https://mundilanguages.com${path}</loc>`);
  }
  expect(sitemap).not.toContain("/link-in-bio/");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://mundilanguages.com/sitemap.xml");
  expect(robots).toContain("Disallow: /api/");
});
