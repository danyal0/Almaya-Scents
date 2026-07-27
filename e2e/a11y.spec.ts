import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ALL_PAGES, scrollThrough, url } from "./helpers";

test.describe("accessibility (axe)", () => {
  for (const pageDef of ALL_PAGES) {
    test(`${pageDef.name} has no serious or critical violations`, async ({ page }) => {
      // Scan with reduced motion so colours are measured at rest — this
      // also exercises the prefers-reduced-motion rendering path.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(url(pageDef.path), { waitUntil: "networkidle" });
      await scrollThrough(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );

      expect(
        serious,
        serious
          .map(
            (violation) =>
              `${violation.id} (${violation.impact}): ${violation.help}\n  ${violation.nodes
                .map((node) => node.target.join(" "))
                .join("\n  ")}`,
          )
          .join("\n\n"),
      ).toHaveLength(0);
    });
  }

  test("lightbox dialog passes axe while open", async ({ page }) => {
    await page.goto(url("/"));
    const trigger = page.getByRole("button", { name: /open image/i }).first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.getByRole("dialog", { name: /image viewer/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(serious).toHaveLength(0);
  });
});
