"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  onMoveSection?: (sectionId: string, toIndex: number) => void;
};

export function CmsSectionsHost({
  draft,
  canEdit = false,
  onEditSection,
  onDeleteSection,
  onMoveSection,
}: CmsSectionsHostProps) {
  const [remote, setRemote] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [pageKey] = useState(() =>
    typeof window === "undefined" ? "/" : getCurrentPageKey(),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (draft) return;
    void loadPublishedOverrides().then(setRemote);
  }, [draft]);

  const content = draft ?? remote;
  const sections = useMemo(
    () =>
      content.sections
        .filter((section) => section.pageKey === pageKey)
        .sort((a, b) => a.order - b.order),
    [content.sections, pageKey],
  );

  if (sections.length === 0) return null;

  const finishDrag = (clientX: number, clientY: number) => {
    if (!draggingId || dropIndex === null) {
      setDraggingId(null);
      setDropIndex(null);
      return;
    }

    const fromIndex = sections.findIndex((section) => section.id === draggingId);
    let toIndex = dropIndex;
    if (fromIndex >= 0 && toIndex > fromIndex) toIndex -= 1;
    if (fromIndex >= 0 && fromIndex !== toIndex) {
      onMoveSection?.(draggingId, toIndex);
    }

    // Prefer hit-testing when dropIndex wasn't updated recently.
    void clientX;
    void clientY;

    setDraggingId(null);
    setDropIndex(null);
    pointerIdRef.current = null;
  };

  return (
    <div className="cms-extra-sections section-gap" data-cms-sections>
      <div className="container-editorial">
        {canEdit ? (
          <p className="mb-8 text-body-sm text-muted">
            Drag blocks with the handle to reorder them in the layout grid.
          </p>
        ) : null}
        <div className="cms-section-grid">
          {sections.map((section, index) => (
            <article
              key={section.id}
              className={`cms-section-card cms-section-card--${section.span} ${
                draggingId === section.id ? "is-dragging" : ""
              } ${dropIndex === index ? "is-drop-target" : ""}`}
              data-cms-section-id={section.id}
              onPointerEnter={() => {
                if (draggingId && draggingId !== section.id) {
                  setDropIndex(index);
                }
              }}
            >
              {canEdit ? (
                <div className="cms-section-card__tools" data-cms-toolbar>
                  <button
                    type="button"
                    className="cms-toolbar__button cms-drag-handle"
                    aria-label={`Drag to reorder ${section.title || "section"}`}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.currentTarget.setPointerCapture(event.pointerId);
                      pointerIdRef.current = event.pointerId;
                      setDraggingId(section.id);
                      setDropIndex(index);
                    }}
                    onPointerMove={(event) => {
                      if (pointerIdRef.current !== event.pointerId || !draggingId) return;
                      const el = document.elementFromPoint(event.clientX, event.clientY);
                      const card = el?.closest("[data-cms-section-id]");
                      if (!(card instanceof HTMLElement)) return;
                      const targetId = card.dataset.cmsSectionId;
                      const targetIndex = sections.findIndex((item) => item.id === targetId);
                      if (targetIndex >= 0) setDropIndex(targetIndex);
                    }}
                    onPointerUp={(event) => {
                      if (pointerIdRef.current !== event.pointerId) return;
                      finishDrag(event.clientX, event.clientY);
                    }}
                    onPointerCancel={() => {
                      setDraggingId(null);
                      setDropIndex(null);
                      pointerIdRef.current = null;
                    }}
                  >
                    Drag
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
                    onClick={() =>
                      onMoveSection?.(
                        section.id,
                        Math.max(0, index - 1),
                      )
                    }
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="cms-toolbar__button"
                    onClick={() =>
                      onMoveSection?.(
                        section.id,
                        Math.min(sections.length - 1, index + 1),
                      )
                    }
                  >
                    Down
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
                <h2 className="font-serif text-display-m font-light text-ink">
                  {section.title}
                </h2>
              ) : null}
              {section.type !== "image" && section.body ? (
                <p className="mt-4 max-w-2xl text-body text-charcoal/80">{section.body}</p>
              ) : null}
              {section.type !== "text" && section.imageSrc ? (
                <div className="media-frame mt-8 aspect-[16/9] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={section.imageSrc}
                    alt={section.imageAlt || section.title || "CMS image"}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ) : section.type !== "text" ? (
                <div className="mt-8 border border-dashed border-line px-4 py-10 text-body-sm text-muted">
                  Add an image with Edit.
                </div>
              ) : null}
            </article>
          ))}
          {canEdit && dropIndex === sections.length ? (
            <div className="cms-section-card cms-section-card--full is-drop-target" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
