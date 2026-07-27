import type { MetadataRoute } from "next";

import { getAllProducts } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { basePath } from "@/lib/assets";

export const dynamic = "force-static";

/**
 * Build-time sitemap. NEXT_PUBLIC_SITE_URL is provided automatically by
 * the GitHub Pages workflow; localhost is used for local builds.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl || `http://localhost:3000${basePath}`;

  const staticRoutes = [
    "/",
    "/products/",
    "/about/",
    "/journal/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ];

  const productRoutes = getAllProducts().map(
    (product) => `/products/${product.slug}/`,
  );

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
