"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  EMPTY_OVERRIDES,
  getCurrentPageKey,
  normalizeOverrides,
  OVERRIDES_FILE_PATH,
  pageKeysMatch,
  resolvePublicPath,
  type CmsSection,
  type ContentOverrides,
} from "@/lib/edit-overrides";
import {
  findSectionIndexAtPoint,
  moveIdInList,
} from "@/lib/cms-section-order";
import { loadFirebaseOverrides } from "@/lib/firebase-overrides";

export const CMS_SECTIONS_SLOT_ID = "cms-page-sections";

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

function placeSectionsMount(): HTMLElement | null {
  const main = document.getElementById("main-content");
  if (!main) return null;

  let mount = document.getElementById(CMS_SECTIONS_SLOT_ID);
  if (!(mount instanceof HTMLElement)) {
    mount = document.createElement("div");
    mount.id = CMS_SECTIONS_SLOT_ID;
  }

  const newsletter = document.getElementById("newsletter-heading")?.closest("section");
  if (newsletter && main.contains(newsletter)) {
    main.insertBefore(mount, newsletter);
  } else {
    main.appendChild(mount);
  }

  return mount;
}

type CmsSectionsHostProps = {
  draft?: ContentOverrides | null;
  canEdit?: boolean;
  onEditSection?: (section: CmsSection) => void;
  onDeleteSection?: (sectionId: string) => void;
  /** Receives the full visible-page section id order after a reorder. */
  onReorderSections?: (orderedIds: string[]) => void;
};

export function CmsSectionsHost({
  draft,
  canEdit = false,
  onEditSection,
  onDeleteSection,
  onReorderSections,
}: CmsSectionsHostProps) {
  const [remote, setRemote] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [pageKey, setPageKey] = useState(() =>
    typeof window === "undefined" ? "/" : getCurrentPageKey(),
  );
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const draggingIdRef = useRef<string | null>(null);
  const dropIndexRef = useRef<number | null>(null);
  const sectionsRef = useRef<CmsSection[]>([]);
  const onReorderSectionsRef = useRef(onReorderSections);

  useEffect(() => {
    onReorderSectionsRef.current = onReorderSections;
  }, [onReorderSections]);

  useEffect(() => {
    setPageKey(getCurrentPageKey());
  }, []);

  useEffect(() => {
    if (draft) return;
    void loadPublishedOverrides().then(setRemote);
  }, [draft]);

  useEffect(() => {
    const place = () => setMountNode(placeSectionsMount());
    place();
    const timer = window.setTimeout(place, 50);
    return () => window.clearTimeout(timer);
  }, [pageKey, draft?.sections.length]);

  const content = draft ?? remote;
  const sections = useMemo(
    () =>
      content.sections
        .filter((section) => pageKeysMatch(section.pageKey, pageKey))
        .sort((a, b) => a.order - b.order),
    [content.sections, pageKey],
  );

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const commitReorder = (sectionId: string, toIndex: number) => {
    const ids = sectionsRef.current.map((section) => section.id);
    const nextIds = moveIdInList(ids, sectionId, toIndex);
    if (nextIds === ids || nextIds.every((id, index) => id === ids[index])) return;
    onReorderSectionsRef.current?.(nextIds);
  };

  useEffect(() => {
    if (!canEdit) return;

    const onPointerMove = (event: PointerEvent) => {
      const activeId = draggingIdRef.current;
      if (!activeId) return;

      const ids = sectionsRef.current.map((section) => section.id);
      const targetIndex = findSectionIndexAtPoint(event.clientX, event.clientY, ids);
      if (targetIndex === null) return;
      dropIndexRef.current = targetIndex;
      setDropIndex(targetIndex);
    };

    const onPointerUp = () => {
      const activeId = draggingIdRef.current;
      const targetIndex = dropIndexRef.current;
      draggingIdRef.current = null;
      dropIndexRef.current = null;
      setDraggingId(null);
      setDropIndex(null);

      if (!activeId || targetIndex === null) return;
      commitReorder(activeId, targetIndex);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  }, [canEdit]);

  const startDrag = (sectionId: string, index: number) => {
    draggingIdRef.current = sectionId;
    dropIndexRef.current = index;
    setDraggingId(sectionId);
    setDropIndex(index);
  };

  if (!mountNode || sections.length === 0) return null;

  const body = (
    <div className="cms-extra-sections section-gap" data-cms-sections>
      <div className="container-editorial">
        {canEdit ? (
          <p className="mb-8 text-body-sm text-muted">
            Press and drag the handle to reorder blocks in this grid. You can also use Up /
            Down.
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
            >
              {canEdit ? (
                <div className="cms-section-card__tools" data-cms-toolbar>
                  <button
                    type="button"
                    className="cms-toolbar__button cms-drag-handle"
                    aria-label={`Drag to reorder ${section.title || "section"}`}
                    onPointerDown={(event) => {
                      if (event.button !== 0) return;
                      event.preventDefault();
                      event.stopPropagation();
                      try {
                        event.currentTarget.setPointerCapture(event.pointerId);
                      } catch {
                        // Pointer capture is best-effort on older browsers.
                      }
                      startDrag(section.id, index);
                    }}
                  >
                    Drag
                  </button>
                  <button
                    type="button"
                    className="cms-toolbar__button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEditSection?.(section);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="cms-toolbar__button"
                    aria-label={`Move ${section.title || "section"} up`}
                    disabled={index === 0}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      commitReorder(section.id, index - 1);
                    }}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="cms-toolbar__button"
                    aria-label={`Move ${section.title || "section"} down`}
                    disabled={index >= sections.length - 1}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      commitReorder(section.id, index + 1);
                    }}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="cms-toolbar__button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onDeleteSection?.(section.id);
                    }}
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
        </div>
      </div>
    </div>
  );

  return createPortal(body, mountNode);
}
