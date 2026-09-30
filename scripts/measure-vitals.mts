/**
 * Median FCP / LCP / CLS / JS of key pages under a Lighthouse-like mobile profile (slow 4G,
 * 4x CPU) with Playwright — a steadier local signal than Lighthouse's simulated metrics on
 * this machine. `pnpm vitals [runs]` against `pnpm start -p 3100`.
 */
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3100";
const RUNS = Number(process.argv[2] ?? 5);
const PAGES = ["/", "/cursos-de-ingles/", "/empresas-e-profissionais/", "/comofunciona/", "/agendamento/", "/blog/", "/contato/"];

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]!;

const browser = await chromium.launch();
console.log("| Página | FCP | LCP | CLS | JS (KB transfer) |\n|---|---|---|---|---|");
for (const path of PAGES) {
  const samples: { fcp: number; lcp: number; cls: number; js: number }[] = [];
  for (let run = 0; run < RUNS; run++) {
    const context = await browser.newContext({
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1.6e6 / 8,
      uploadThroughput: 750e3 / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: number; __cls: number };
      w.__lcp = 0;
      w.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) w.__lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
          if (!entry.hadRecentInput) w.__cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    samples.push(
      await page.evaluate(() => {
        const w = window as unknown as { __lcp: number; __cls: number };
        const js = performance
          .getEntriesByType("resource")
          .filter((entry) => (entry as PerformanceResourceTiming).initiatorType === "script")
          .reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0);
        return {
          fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
          lcp: w.__lcp,
          cls: w.__cls,
          js: js / 1024,
        };
      }),
    );
    await context.close();
  }
  const m = (key: keyof (typeof samples)[number]) => median(samples.map((sample) => sample[key]));
  console.log(
    `| ${path} | ${(m("fcp") / 1000).toFixed(2)} s | ${(m("lcp") / 1000).toFixed(2)} s | ${m("cls").toFixed(3)} | ${Math.round(m("js"))} |`,
  );
}
await browser.close();
