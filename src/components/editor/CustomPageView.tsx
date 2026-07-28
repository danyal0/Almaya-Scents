"use client";

import { useEffect, useMemo, useState } from "react";

import {
  EMPTY_OVERRIDES,
  normalizeOverrides,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  type ContentOverrides,
} from "@/lib/edit-overrides";
import { loadFirebaseOverrides } from "@/lib/firebase-overrides";

async function loadPublishedOverrides(): Promise<ContentOverrides> {
  try {
    const remote = await loadFirebaseOverrides();
    if (remote) return remote;
  } catch {
    // Fall through.
  }

  try {
    const response = await fetch(`${resolvePublicPath(OVERRIDES_FILE_PATH)}?t=${Date.now()}`);
    if (response.ok) return normalizeOverrides(await response.json());
  } catch {
    // Ignore.
  }

  return EMPTY_OVERRIDES;
}

export function CustomPageView() {
  const [content, setContent] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [slug] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("slug")?.trim() ?? "";
  });

  useEffect(() => {
    void loadPublishedOverrides().then(setContent);
  }, []);

  const page = useMemo(
    () => content.pages.find((item) => item.slug === slug),
    [content.pages, slug],
  );

  if (!slug) {
    return (
      <div className="section-gap">
        <div className="container-editorial">
          <h1 className="font-serif text-display-m font-light text-ink">Custom page</h1>
          <p className="mt-4 text-body text-muted">Missing page slug.</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="section-gap">
        <div className="container-editorial">
          <h1 className="font-serif text-display-m font-light text-ink">Page not found</h1>
          <p className="mt-4 text-body text-muted">
            No custom page exists for <code>{slug}</code>. Create one from edit mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-gap pb-0">
      <div className="container-editorial">
        <h1 className="font-serif text-display-l font-light text-ink">{page.title}</h1>
        {page.intro ? (
          <p className="mt-6 max-w-2xl text-body text-charcoal/80">{page.intro}</p>
        ) : null}
      </div>
    </div>
  );
}
