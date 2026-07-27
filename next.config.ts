import type { NextConfig } from "next";

/**
 * GitHub Pages support.
 *
 * NEXT_PUBLIC_BASE_PATH controls the base path the site is served from:
 *   - ""            -> root of a custom domain or https://user.github.io/
 *   - "/repo-name"  -> project pages, e.g. https://user.github.io/repo-name/
 *
 * The deploy workflow (.github/workflows/deploy-pages.yml) derives this value
 * automatically from the repository name via actions/configure-pages, so no
 * manual configuration is required for a standard GitHub Pages deployment.
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: {
    // Static export has no image optimization server; assets are pre-sized.
    unoptimized: true,
  },
};

export default nextConfig;
