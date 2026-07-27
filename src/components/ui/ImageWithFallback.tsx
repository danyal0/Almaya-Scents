"use client";

import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

import { getAssetPath } from "@/lib/assets";

type ImageWithFallbackProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  /** Root-relative path under /public; the base path is applied here. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Load eagerly with high priority (hero / above the fold). */
  priority?: boolean;
};

const FALLBACK_SRC = "/images/placeholders/image-fallback.svg";

/**
 * Plain <img> wrapper that resolves the GitHub Pages base path and swaps
 * to a neutral placeholder if the asset is missing, so a misnamed file
 * never renders as a broken image.
 */
export function ImageWithFallback({
  src,
  alt,
  priority = false,
  ...rest
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export uses pre-sized local assets
    <img
      src={getAssetPath(failed ? FALLBACK_SRC : src)}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
