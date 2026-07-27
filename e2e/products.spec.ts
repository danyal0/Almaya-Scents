import { expect, test } from "@playwright/test";

import { url } from "./helpers";

const PRODUCT_SLUGS = ["crystal-for-her", "essential-for-him"] as const;

test.describe("collection page", () => {
  test("renders every product as a clickable card", async ({ page }) => {
    await page.goto(url("/products/"));
    for (const slug of PRODUCT_SLUGS) {
      const card = page.locator(`a[href="${url(`/products/${slug}/`)}"]`);
      await expect(card).toHaveCount(1);
    }
  });

  test("card click opens the product page", async ({ page }) => {
    await page.goto(url("/products/"));
    await page.locator(`a[href="${url("/products/essential-for-him/")}"]`).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /essential for him/i }),
    ).toBeVisible();
  });
});

test.describe("product pages", () => {
  for (const slug of PRODUCT_SLUGS) {
    test(`generates and renders ${slug}`, async ({ page }) => {
      await page.goto(url(`/products/${slug}/`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("main p").first()).toBeVisible();
    });
  }

  test("shows published scent notes for Crystal For Her", async ({ page }) => {
    await page.goto(url("/products/crystal-for-her/"));
    await expect(page.getByText("Notes", { exact: true })).toBeVisible();
    await expect(page.getByText("Yuzu")).toBeVisible();
    await expect(page.getByText("Peony")).toBeVisible();
    await expect(page.getByText("Musk")).toBeVisible();
  });

  test("shows published scent notes for Essential For Him", async ({ page }) => {
    await page.goto(url("/products/essential-for-him/"));
    await expect(page.getByText("Notes", { exact: true })).toBeVisible();
    await expect(page.getByText(/bergamot cassia/i)).toBeVisible();
    await expect(page.getByText(/sandalwood/i)).toBeVisible();
  });

  test("omits fabricated commerce placeholders", async ({ page }) => {
    await page.goto(url("/products/crystal-for-her/"));
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/n\/a/i);
    expect(body).not.toMatch(/\bTODO\b/);
    expect(body).not.toMatch(/[$€£]\s?\d/);
  });

  test("shows related products excluding the current one", async ({ page }) => {
    await page.goto(url("/products/crystal-for-her/"));
    const related = page.locator("section", {
      has: page.getByRole("heading", { name: /more from the collection/i }),
    });
    await expect(
      related.locator(`a[href="${url("/products/essential-for-him/")}"]`),
    ).toHaveCount(1);
    await expect(
      related.locator(`a[href="${url("/products/crystal-for-her/")}"]`),
    ).toHaveCount(0);
  });

  test("gallery thumbnails switch the main image on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "desktop gallery interaction");

    await page.goto(url("/products/crystal-for-her/"));
    const secondThumb = page.getByRole("tab", { name: /show image 2/i });
    await secondThumb.click();
    await expect(secondThumb).toHaveAttribute("aria-selected", "true");
    const mainImage = page
      .locator('div[aria-label="Crystal For Her gallery"] .hidden.md\\:flex img')
      .last();
    await expect(mainImage).toHaveAttribute("src", /crystal-for-her-detail/);
  });

  test("inquiry CTA opens Instagram securely", async ({ page }) => {
    await page.goto(url("/products/crystal-for-her/"));
    const cta = page.getByRole("link", { name: /inquire on instagram/i });
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    await expect(cta).toHaveAttribute("href", /instagram\.com\/almayascents/);
  });
});
