import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests run against the statically exported site served under a
 * repository-style base path (/almaya-e2e), proving that the export works
 * exactly as it will on GitHub Pages project hosting.
 *
 * `npm run test:e2e` builds with NEXT_PUBLIC_BASE_PATH=/almaya-e2e first.
 */
export const E2E_BASE_PATH = "/almaya-e2e";
const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}${E2E_BASE_PATH}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `node scripts/serve-static.mjs --port ${PORT} --base ${E2E_BASE_PATH}`,
    url: `http://localhost:${PORT}${E2E_BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
