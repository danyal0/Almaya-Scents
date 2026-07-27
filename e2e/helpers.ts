import type { Page } from "@playwright/test";

/** Base path the export is built with and served under (see playwright.config.ts). */
export const BASE = "/almaya-e2e";

export const ALL_PAGES = [
  { path: "/", name: "Home", h1: /fragrance, remembered/i },
  { path: "/products/", name: "Collection", h1: /the collection/i },
  { path: "/products/almaya-no-i/", name: "Product", h1: /almaya no\. i/i },
  { path: "/about/", name: "About", h1: /an expression beyond scent/i },
  { path: "/journal/", name: "Journal", h1: /journal/i },
  { path: "/contact/", name: "Contact", h1: /contact/i },
  { path: "/privacy/", name: "Privacy", h1: /privacy/i },
  { path: "/terms/", name: "Terms", h1: /terms/i },
] as const;

export function url(path: string): string {
  return `${BASE}${path}`;
}

/** Scroll through the page so viewport-triggered reveals are executed. */
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 200));
  });
}

export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
}
