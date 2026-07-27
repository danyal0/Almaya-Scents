import { expect, test } from "@playwright/test";

import { url } from "./helpers";

async function openLightbox(page: import("@playwright/test").Page) {
  await page.goto(url("/"));
  const firstFrame = page.getByRole("button", { name: /open image/i }).first();
  await firstFrame.scrollIntoViewIfNeeded();
  await firstFrame.click();
  return page.getByRole("dialog", { name: /image viewer/i });
}

test.describe("image lightbox", () => {
  test("opens from the gallery and closes with Escape", async ({ page }) => {
    const dialog = await openLightbox(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("1 — 5");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Focus returns to the triggering gallery button.
    const focusedLabel = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-label") ?? "",
    );
    expect(focusedLabel).toMatch(/open image/i);
  });

  test("supports keyboard navigation between images", async ({ page }) => {
    const dialog = await openLightbox(page);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("2 — 5");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("1 — 5");
    // Wraps backwards from the first image to the last.
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("5 — 5");
  });

  test("provides visible close and navigation controls", async ({ page }) => {
    const dialog = await openLightbox(page);
    await dialog.getByRole("button", { name: /next image/i }).click();
    await expect(dialog).toContainText("2 — 5");
    await dialog.getByRole("button", { name: /close image viewer/i }).click();
    await expect(dialog).toBeHidden();
  });

  test("traps focus inside the dialog", async ({ page }) => {
    const dialog = await openLightbox(page);
    await expect(
      dialog.getByRole("button", { name: /close image viewer/i }),
    ).toBeFocused();

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press("Tab");
      const inDialog = await page.evaluate(() => {
        const lightbox = document.querySelector(
          '[role="dialog"][aria-label^="Image viewer"]',
        );
        return lightbox?.contains(document.activeElement) ?? false;
      });
      expect(inDialog, `focus escaped on Tab #${i + 1}`).toBe(true);
    }
  });
});
