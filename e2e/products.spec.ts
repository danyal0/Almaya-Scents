import { expect, test } from "@playwright/test";

import { url } from "./helpers";

const PRODUCT_SLUGS = [
  "almaya-no-i",
  "almaya-no-ii",
  "almaya-no-iii",
  "almaya-no-iv",
];

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
    await page.locator(`a[href="${url("/products/almaya-no-ii/")}"]`).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /almaya no\. ii/i }),
    ).toBeVisible();
  });
});

test.describe("product pages", () => {
  for (const slug of PRODUCT_SLUGS) {
    test(`generates and renders ${slug}`, async ({ page }) => {
      await page.goto(url(`/products/${slug}/`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      // Description present.
      await expect(page.locator("main p").first()).toBeVisible();
    });
  }

  test("omits unverified optional data — no placeholders leak", async ({ page }) => {
    await page.goto(url("/products/almaya-no-i/"));
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/n\/a/i);
    expect(body).not.toMatch(/\bTODO\b/);
    // No verified notes exist, so the notes section must be absent.
    await expect(page.getByText("Notes", { exact: true })).toHaveCount(0);
    // No prices may appear anywhere.
    expect(body).not.toMatch(/[$€£]\s?\d/);
  });

  test("shows related products excluding the current one", async ({ page }) => {
    await page.goto(url("/products/almaya-no-i/"));
    const related = page.locator("section", {
      has: page.getByRole("heading", { name: /more from the collection/i }),
    });
    // The three other products appear; the current one does not.
    for (const slug of ["almaya-no-ii", "almaya-no-iii", "almaya-no-iv"]) {
      await expect(
        related.locator(`a[href="${url(`/products/${slug}/`)}"]`),
      ).toHaveCount(1);
    }
    await expect(
      related.locator(`a[href="${url("/products/almaya-no-i/")}"]`),
    ).toHaveCount(0);
  });

  test("gallery thumbnails switch the main image on desktop", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "desktop gallery interaction");

    await page.goto(url("/products/almaya-no-i/"));
    const secondThumb = page.getByRole("tab", { name: /show image 2/i });
    await secondThumb.click();
    await expect(secondThumb).toHaveAttribute("aria-selected", "true");
    const mainImage = page.locator('div[aria-label="Almaya No. I gallery"] .hidden.md\\:flex img').last();
    await expect(mainImage).toHaveAttribute("src", /product-01-detail/);
  });

  test("inquiry CTA opens Instagram securely", async ({ page }) => {
    await page.goto(url("/products/almaya-no-i/"));
    const cta = page.getByRole("link", { name: /inquire on instagram/i });
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    await expect(cta).toHaveAttribute("href", /instagram\.com\/almayascents/);
  });
});
