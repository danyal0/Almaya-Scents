import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site-config";
import { basePath } from "@/lib/assets";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl || `http://localhost:3000${basePath}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
