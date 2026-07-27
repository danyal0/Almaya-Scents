import type { Metadata } from "next";

import { siteConfig } from "@/content/site-config";
import { basePath } from "@/lib/assets";

/**
 * Absolute URL for a route or asset, when a canonical site URL is
 * configured; otherwise a base-path-relative URL.
 */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (siteConfig.siteUrl) {
    // siteUrl already includes the base path for GitHub Pages deployments.
    return `${siteConfig.siteUrl}${normalized}`;
  }
  return `${basePath}${normalized}`;
}

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path: string;
  ogImage?: string;
};

/** Consistent per-page metadata with Open Graph and Twitter cards. */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = "/images/brand/og-image.png",
}: PageMetadataOptions): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;
  const resolvedDescription = description ?? siteConfig.description;
  const url = absoluteUrl(path);
  const image = absoluteUrl(ogImage);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: siteConfig.siteUrl ? { canonical: url } : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [image],
    },
  };
}
