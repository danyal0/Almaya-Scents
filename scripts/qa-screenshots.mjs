import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.SHOT_BASE ?? "http://localhost:4173";
const outDir = process.env.SHOT_DIR ?? "/tmp/shots";
mkdirSync(outDir, { recursive: true });

const pages = JSON.parse(process.env.SHOT_PAGES ?? '[{"path":"/","name":"home"}]');
const viewports = JSON.parse(
  process.env.SHOT_VIEWPORTS ?? '[{"w":1440,"h":1000,"tag":"1440"}]',
);
const fullPage = process.env.SHOT_FULL !== "0";

const browser = await chromium.launch();
for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  for (const p of pages) {
    await page.goto(`${base}${p.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    // Scroll through the page in steps so viewport-triggered reveals run.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `${outDir}/${p.name}-${vp.tag}.png`,
      fullPage,
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`${p.name}@${vp.tag}: overflow=${overflow}px errors=${errors.length}`);
    if (errors.length) console.log("  " + errors.join("\n  "));
    errors.length = 0;
  }
  await context.close();
}
await browser.close();
