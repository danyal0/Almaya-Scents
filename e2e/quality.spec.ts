import { expect, test } from "@playwright/test";

import { ALL_PAGES, BASE, horizontalOverflow, scrollThrough, url } from "./helpers";

test.describe("page quality", () => {
  for (const pageDef of ALL_PAGES) {
    test(`${pageDef.name}: renders h1, no console errors, assets load under base path`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      const failedRequests: string[] = [];

      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(String(error)));
      page.on("response", (response) => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto(url(pageDef.path), { waitUntil: "networkidle" });
      await expect(
        page.getByRole("heading", { level: 1, name: pageDef.h1 }),
      ).toBeVisible();
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");

      // Exactly one h1 per page.
      expect(await page.locator("h1").count()).toBe(1);

      // Every image resolves under the repository base path and decodes.
      const images = await page.$$eval("img", (elements) =>
        elements.map((img) => ({
          src: img.getAttribute("src") ?? "",
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        })),
      );
      for (const image of images) {
        expect(image.src, `image missing base path: ${image.src}`).toMatch(
          new RegExp(`^${BASE}/`),
        );
        expect(
          image.naturalWidth,
          `image failed to decode: ${image.src}`,
        ).toBeGreaterThan(0);
      }

      // Images must have an alt attribute (empty allowed for decorative).
      const missingAlt = await page.$$eval(
        "img:not([alt])",
        (elements) => elements.length,
      );
      expect(missingAlt).toBe(0);

      expect(consoleErrors, consoleErrors.join("\n")).toHaveLength(0);
      expect(failedRequests, failedRequests.join("\n")).toHaveLength(0);
    });
  }

  for (const width of [320, 375, 390, 414, 480, 640, 768, 820, 1024, 1280, 1440, 1728, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile === true, "uses viewport resizing");

      await page.setViewportSize({ width, height: 900 });
      for (const pageDef of ALL_PAGES) {
        await page.goto(url(pageDef.path));
        // Reveal animations only translate vertically; overflow can be
        // measured immediately after load and once more at page bottom.
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(100);
        const overflow = await horizontalOverflow(page);
        expect(
          overflow,
          `${pageDef.name} overflows by ${overflow}px at ${width}px`,
        ).toBeLessThanOrEqual(0);
      }
    });
  }

  test("external links are secured with noopener noreferrer", async ({ page }) => {
    for (const pageDef of ALL_PAGES) {
      await page.goto(url(pageDef.path));
      const insecure = await page.$$eval('a[href^="http"]', (anchors) =>
        anchors
          .filter((a) => {
            const rel = (a.getAttribute("rel") ?? "").split(/\s+/);
            return (
              a.getAttribute("target") === "_blank" &&
              !(rel.includes("noopener") && rel.includes("noreferrer"))
            );
          })
          .map((a) => a.getAttribute("href")),
      );
      expect(insecure, `insecure external links on ${pageDef.name}`).toHaveLength(0);
    }
  });

  test("newsletter is honestly disabled without a configured endpoint", async ({ page }) => {
    await page.goto(url("/"));
    const input = page.getByLabel(/email address/i);
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeDisabled();
    await expect(page.getByRole("button", { name: /subscribe/i })).toBeDisabled();
    await expect(page.getByText(/newsletter sign-up opens soon/i)).toBeVisible();
  });

  test("sitemap and robots are exported", async ({ request }) => {
    const sitemap = await request.get(`http://localhost:4173${BASE}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/products/almaya-no-i/");

    const robots = await request.get(`http://localhost:4173${BASE}/robots.txt`);
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("sitemap.xml");
  });

  test("unknown routes show the styled 404 page", async ({ page }) => {
    const response = await page.goto(url("/this-page-does-not-exist/"));
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /drifted away/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });
});
