import { expect, test } from "@playwright/test";

import { ALL_PAGES, url } from "./helpers";

test.describe("home page", () => {
  test("renders the hero with brand copy and CTAs", async ({ page }) => {
    await page.goto(url("/"));
    await expect(
      page.getByRole("heading", { level: 1, name: /fragrance, remembered/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /discover the collection/i }),
    ).toBeVisible();
    await expect(page.getByText(/discover the world of almaya scents/i)).toBeVisible();
  });
});

test.describe("primary navigation", () => {
  test("desktop navigation reaches every primary page", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "desktop-only navigation");

    await page.goto(url("/"));
    for (const [label, h1] of [
      ["Collection", /the collection/i],
      ["About", /an expression beyond scent/i],
      ["Journal", /journal/i],
      ["Contact", /contact/i],
    ] as const) {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label }).click();
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    }
  });

  test("wordmark returns to the home page", async ({ page }) => {
    await page.goto(url("/about/"));
    await page
      .getByRole("banner")
      .getByRole("link", { name: /almaya scents — home/i })
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name: /fragrance, remembered/i }),
    ).toBeVisible();
  });
});

test.describe("internal links", () => {
  for (const pageDef of ALL_PAGES) {
    test(`all internal links on ${pageDef.name} resolve`, async ({ page, request }) => {
      await page.goto(url(pageDef.path));
      const hrefs = await page.$$eval("a[href]", (anchors) =>
        anchors
          .map((a) => a.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/")),
      );

      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of new Set(hrefs)) {
        expect(href, `internal link missing base path: ${href}`).toMatch(
          /^\/almaya-e2e\//,
        );
        const response = await request.get(`http://localhost:4173${href}`);
        expect(response.status(), `broken link: ${href}`).toBe(200);
      }
    });
  }
});

test.describe("mobile menu", () => {
  test("opens, navigates, and closes with Escape", async ({ page, isMobile }) => {
    test.skip(isMobile !== true, "mobile-only menu");

    await page.goto(url("/"));
    const trigger = page.getByRole("button", { name: /open menu/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /site navigation/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Collection" })).toBeVisible();

    // Escape closes and focus returns to the trigger.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    // Re-open and navigate.
    await trigger.click();
    await dialog.getByRole("link", { name: "Collection" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /the collection/i }),
    ).toBeVisible();
  });

  test("traps focus while open", async ({ page, isMobile }) => {
    test.skip(isMobile !== true, "mobile-only menu");

    await page.goto(url("/"));
    await page.getByRole("button", { name: /open menu/i }).click();

    const closeButton = page.getByRole("button", { name: /close menu/i });
    await expect(closeButton).toBeFocused();

    // Tab through every focusable element; focus must remain in the dialog.
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      const inDialog = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return dialog?.contains(document.activeElement) ?? false;
      });
      expect(inDialog, `focus escaped the dialog on Tab #${i + 1}`).toBe(true);
    }
  });
});

test.describe("keyboard access", () => {
  test("skip link is the first focusable element and works", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "keyboard-focused desktop check");

    await page.goto(url("/"));
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to content/i });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp("#main-content$"));
  });
});
