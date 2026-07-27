import { afterEach, describe, expect, it, vi } from "vitest";

describe("getAssetPath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns root-relative paths when no base path is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { getAssetPath } = await import("@/lib/assets");
    expect(getAssetPath("/images/products/a.svg")).toBe(
      "/images/products/a.svg",
    );
  });

  it("prefixes the configured base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/repo-name");
    vi.resetModules();
    const { getAssetPath } = await import("@/lib/assets");
    expect(getAssetPath("/images/products/a.svg")).toBe(
      "/repo-name/images/products/a.svg",
    );
  });

  it("normalises paths without a leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/repo-name");
    vi.resetModules();
    const { getAssetPath } = await import("@/lib/assets");
    expect(getAssetPath("images/a.svg")).toBe("/repo-name/images/a.svg");
  });

  it("treats a trailing slash and bare slash as empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/repo-name/");
    vi.resetModules();
    const withTrailing = await import("@/lib/assets");
    expect(withTrailing.getAssetPath("/a.svg")).toBe("/repo-name/a.svg");

    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/");
    vi.resetModules();
    const bareSlash = await import("@/lib/assets");
    expect(bareSlash.getAssetPath("/a.svg")).toBe("/a.svg");
  });
});
