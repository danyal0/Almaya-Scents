"use client";

import { useEffect, useMemo, useState } from "react";

import {
  EMPTY_OVERRIDES,
  getCurrentPageKey,
  normalizeOverrides,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  type CmsSection,
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

type CmsSectionsHostProps = {
  draft?: ContentOverrides | null;
  canEdit?: boolean;
  onEditSection?: (section: CmsSection) => void;
  onDeleteSection?: (sectionId: string) => void;
  onReorderSection?: (sectionId: string, direction: -1 | 1) => void;
};

export function CmsSectionsHost({
  draft,
  canEdit = false,
  onEditSection,
  onDeleteSection,
  onReorderSection,
}: CmsSectionsHostProps) {
  const [remote, setRemote] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [pageKey] = useState(() =>
    typeof window === "undefined" ? "/" : getCurrentPageKey(),
  );

  useEffect(() => {
    if (draft) return;
    void loadPublishedOverrides().then(setRemote);
  }, [draft]);

  const content = draft ?? remote;
  const sections = useMemo(
    () => content.sections.filter((section) => section.pageKey === pageKey).sort((a, b) => a.order - b.order),
    [content.sections, pageKey],
  );

  if (sections.length === 0) return null;

  return (
    <div className="cms-extra-sections section-gap" data-cms-sections>
      <div className="container-editorial flex flex-col gap-16">
        {sections.map((section) => (
          <article key={section.id} className="cms-section-card" data-cms-section-id={section.id}>
            {canEdit ? (
              <div className="cms-section-card__tools" data-cms-toolbar>
                <button
                  type="button"
                  className="cms-toolbar__button"
                  onClick={() => onReorderSection?.(section.id, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="cms-toolbar__button"
                  onClick={() => onReorderSection?.(section.id, 1)}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="cms-toolbar__button"
                  onClick={() => onEditSection?.(section)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="cms-toolbar__button"
                  onClick={() => onDeleteSection?.(section.id)}
                >
                  Delete
                </button>
              </div>
            ) : null}

            {section.type !== "image" && section.title ? (
              <h2 className="font-serif text-display-m font-light text-ink">{section.title}</h2>
            ) : null}
            {section.type !== "image" && section.body ? (
              <p className="mt-4 max-w-2xl text-body text-charcoal/80">{section.body}</p>
            ) : null}
            {section.type !== "text" && section.imageSrc ? (
              <div className="media-frame mt-8 aspect-[16/9] max-w-4xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.imageSrc}
                  alt={section.imageAlt || section.title || "CMS image"}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
