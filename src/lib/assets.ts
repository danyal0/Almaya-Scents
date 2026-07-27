/**
 * Asset path helper for GitHub Pages base-path support.
 *
 * `NEXT_PUBLIC_BASE_PATH` is inlined at build time. All non-`next/link`
 * asset references (images, Open Graph URLs, JSON-LD) must go through
 * `getAssetPath` so the site works both at a domain root and under a
 * repository subpath such as https://user.github.io/repo/.
 */
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const basePath =
  configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");

export function getAssetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
