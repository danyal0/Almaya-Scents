"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { CmsSectionsHost } from "@/components/editor/CmsSectionsHost";
import { ImageEditModal } from "@/components/editor/ImageEditModal";
import {
  clearStoredOverrides,
  createId,
  EMPTY_OVERRIDES,
  getCurrentPageKey,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  type CmsSection,
  type ContentOverrides,
  normalizeOverrides,
  writeStoredOverrides,
} from "@/lib/edit-overrides";
import { moveSectionInList } from "@/lib/cms-section-order";
import { siteConfig } from "@/content/site-config";
import { firebaseAuth } from "@/lib/firebase";
import {
  formatFirestoreError,
  loadFirebaseOverrides,
  saveFirebaseOverrides,
} from "@/lib/firebase-overrides";

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,small,strong,em,blockquote,figcaption,a,button,label,li";

function getElementPath(element: Element): string {
  const segments: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
    const currentTagName = current.tagName;
    if (current.id) {
      segments.unshift(`#${current.id}`);
      break;
    }
    const tag = current.tagName.toLowerCase();
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;
    const sameTagSiblings = Array.from(parent.children).filter(
      (child: Element) => child.tagName === currentTagName,
    );
    const index = sameTagSiblings.indexOf(current) + 1;
    segments.unshift(`${tag}:nth-of-type(${index})`);
    current = parent;
  }

  return segments.join(" > ");
}

function applyOverrides(overrides: ContentOverrides) {
  for (const [selector, text] of Object.entries(overrides.texts)) {
    const node = document.querySelector(selector);
    if (!(node instanceof HTMLElement)) continue;
    node.textContent = text;
  }

  for (const [selector, image] of Object.entries(overrides.images)) {
    const node = document.querySelector(selector);
    if (!(node instanceof HTMLImageElement)) continue;
    node.src = image.src;
    if (typeof image.alt === "string") {
      node.alt = image.alt;
    }
  }
}

function isTextEditable(node: EventTarget | null): node is HTMLElement {
  return node instanceof HTMLElement && node.matches(TEXT_SELECTOR);
}

function nearestEditableImage(target: EventTarget | null): HTMLImageElement | null {
  if (!(target instanceof HTMLElement)) return null;
  if (target.closest("[data-cms-sections]")) return null;
  if (target instanceof HTMLImageElement) return target;
  return target.closest("img");
}

function getEditModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("edit") === "1";
}

async function loadPublishedOverrides(): Promise<ContentOverrides> {
  try {
    const remote = await loadFirebaseOverrides();
    if (remote) return remote;
  } catch {
    // Fall back to static file when Firestore is unavailable.
  }

  try {
    const requestUrl = `${resolvePublicPath(OVERRIDES_FILE_PATH)}?t=${Date.now()}`;
    const response = await fetch(requestUrl);
    if (response.ok) {
      return normalizeOverrides(await response.json());
    }
  } catch {
    // No published overrides yet.
  }

  return EMPTY_OVERRIDES;
}

function defaultSpanForType(type: CmsSection["type"]): CmsSection["span"] {
  return type === "image" ? "half" : "full";
}

type ImageEditState = {
  selector: string;
  src: string;
  alt: string;
};

export function EditModeRuntime() {
  const initialEditEnabled =
    typeof window !== "undefined" && getEditModeEnabled();

  const [draft, setDraft] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [published, setPublished] = useState<ContentOverrides>(EMPTY_OVERRIDES);
  const [editEnabled] = useState(initialEditEnabled);
  const [authed, setAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageEdit, setImageEdit] = useState<ImageEditState | null>(null);

  const canEdit = editEnabled && authed;

  const updateDraft = useCallback((updater: (current: ContentOverrides) => ContentOverrides) => {
    setDraft((current) => {
      const next = updater(current);
      applyOverrides(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      const allowed =
        user?.email?.toLowerCase() === siteConfig.adminEmail.toLowerCase();
      setAuthed(Boolean(allowed));
      setAdminEmail(user?.email ?? "");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadPublishedOverrides().then((remote) => {
      if (cancelled) return;
      setPublished(remote);
      setDraft(remote);
      applyOverrides(remote);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!canEdit) {
      document.body.classList.remove("cms-edit-mode");
      return;
    }
    document.body.classList.add("cms-edit-mode");
    return () => document.body.classList.remove("cms-edit-mode");
  }, [canEdit]);

  useEffect(() => {
    if (!canEdit || !loaded) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("[data-cms-toolbar]")) return;
      if (target instanceof HTMLElement && target.closest("[data-cms-sections]")) return;

      const image = nearestEditableImage(target);
      if (image) {
        event.preventDefault();
        event.stopPropagation();
        setImageEdit({
          selector: getElementPath(image),
          src: image.currentSrc || image.src,
          alt: image.alt,
        });
        return;
      }

      if (!isTextEditable(target)) return;

      event.preventDefault();
      event.stopPropagation();

      const selector = getElementPath(target);
      const currentText = target.textContent ?? "";
      const nextText = window.prompt("Edit text:", currentText);
      if (nextText === null) return;

      updateDraft((current) => ({
        ...current,
        texts: { ...current.texts, [selector]: nextText },
      }));
      setStatus("Unsaved changes — click Save when ready.");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [canEdit, loaded, updateDraft]);

  const handleSave = async () => {
    if (!adminEmail) {
      setStatus("You must be logged in to save.");
      return;
    }

    setSaving(true);
    setStatus("Saving…");

    try {
      await saveFirebaseOverrides(draft, adminEmail);
      writeStoredOverrides(draft);
      setPublished(draft);
      setStatus("Saved. All visitors will see these changes.");
    } catch (error) {
      setStatus(`Save failed: ${formatFirestoreError(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset all content to the original site version? This removes saved overrides for everyone.",
    );
    if (!confirmed) return;

    if (!adminEmail) {
      setStatus("You must be logged in to reset.");
      return;
    }

    setSaving(true);
    setStatus("Resetting…");

    try {
      await saveFirebaseOverrides(EMPTY_OVERRIDES, adminEmail);
      clearStoredOverrides();
      setDraft(EMPTY_OVERRIDES);
      setPublished(EMPTY_OVERRIDES);
      setStatus("Reset complete. Reloading…");
      window.location.reload();
    } catch (error) {
      setStatus(`Reset failed: ${formatFirestoreError(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = (type: CmsSection["type"]) => {
    const pageKey = getCurrentPageKey();
    const title =
      type === "image"
        ? "New image"
        : window.prompt("Section title:", "New section") ?? "";
    if (type !== "image" && !title.trim()) return;

    const body =
      type === "image"
        ? ""
        : window.prompt("Section text:", "Write your content here.") ?? "";

    const sectionId = createId("section");

    updateDraft((current) => {
      const pageSections = current.sections
        .filter((section) => section.pageKey === pageKey)
        .sort((a, b) => a.order - b.order);
      const nextOrder =
        pageSections.reduce((max, section) => Math.max(max, section.order), -1) + 1;
      const section: CmsSection = {
        id: sectionId,
        pageKey,
        type,
        title: title.trim(),
        body: body.trim(),
        imageSrc: "",
        imageAlt: "",
        order: nextOrder,
        span: defaultSpanForType(type),
      };
      return {
        ...current,
        sections: [...current.sections, section],
      };
    });

    setStatus("Section added at the end of the page grid — drag to reorder, then Save.");
    window.setTimeout(() => {
      document
        .querySelector(`[data-cms-section-id="${sectionId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);

    if (type !== "text") {
      setImageEdit({
        selector: `cms-section:${sectionId}`,
        src: "",
        alt: "",
      });
    }
  };

  const handleAddPage = () => {
    const slugInput = window.prompt("New page slug (example: lookbook):", "");
    if (!slugInput) return;
    const slug = slugInput.trim().replace(/^\/+|\/+$/g, "").toLowerCase();
    if (!slug) return;
    const title = window.prompt("Page title:", slug) ?? slug;
    const intro = window.prompt("Page intro (optional):", "") ?? "";

    updateDraft((current) => {
      const exists = current.pages.some((page) => page.slug === slug);
      const pages = exists
        ? current.pages.map((page) =>
            page.slug === slug ? { slug, title, intro } : page,
          )
        : [...current.pages, { slug, title, intro }];
      return { ...current, pages };
    });

    setStatus("Page created — opening it now. Click Save to publish.");
    window.location.href = resolvePublicPath(`/custom/?slug=${encodeURIComponent(slug)}&edit=1`);
  };

  const handleEditSection = (section: CmsSection) => {
    if (section.type !== "image") {
      const title = window.prompt("Section title:", section.title);
      if (title === null) return;
      const body = window.prompt("Section text:", section.body);
      if (body === null) return;
      updateDraft((current) => ({
        ...current,
        sections: current.sections.map((item) =>
          item.id === section.id ? { ...item, title, body } : item,
        ),
      }));
    }

    if (section.type !== "text") {
      setImageEdit({
        selector: `cms-section:${section.id}`,
        src: section.imageSrc,
        alt: section.imageAlt,
      });
    } else {
      setStatus("Unsaved changes — click Save when ready.");
    }
  };

  const handleMoveSection = (sectionId: string, toIndex: number) => {
    updateDraft((current) => {
      const pageKey = getCurrentPageKey();
      const pageSections = current.sections
        .filter((section) => section.pageKey === pageKey)
        .sort((a, b) => a.order - b.order);
      const reordered = moveSectionInList(pageSections, sectionId, toIndex);
      if (reordered === pageSections) return current;
      const byId = new Map(reordered.map((section) => [section.id, section]));
      return {
        ...current,
        sections: current.sections.map((section) => byId.get(section.id) ?? section),
      };
    });
    setStatus("Unsaved changes — click Save when ready.");
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(published);

  return (
    <>
      {loaded ? (
        <CmsSectionsHost
          draft={draft}
          canEdit={canEdit}
          onEditSection={handleEditSection}
          onDeleteSection={(sectionId) => {
            updateDraft((current) => ({
              ...current,
              sections: current.sections.filter((section) => section.id !== sectionId),
            }));
            setStatus("Unsaved changes — click Save when ready.");
          }}
          onMoveSection={handleMoveSection}
        />
      ) : null}

      {canEdit ? (
        <aside data-cms-toolbar className="cms-toolbar">
          <strong className="cms-toolbar__title">Edit mode</strong>
          <p className="cms-toolbar__text">
            Click text/images to edit. New blocks land in the page grid — drag handles to
            reorder (touch friendly).
          </p>
          <div className="cms-toolbar__actions">
            <button
              type="button"
              className="cms-toolbar__button cms-toolbar__button--primary"
              disabled={saving}
              onClick={() => void handleSave()}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="cms-toolbar__button"
              disabled={saving}
              onClick={() => void handleReset()}
            >
              Reset to original
            </button>
            <button
              type="button"
              className="cms-toolbar__button"
              onClick={() => handleAddSection("text")}
            >
              Add text
            </button>
            <button
              type="button"
              className="cms-toolbar__button"
              onClick={() => handleAddSection("image")}
            >
              Add image
            </button>
            <button
              type="button"
              className="cms-toolbar__button"
              onClick={() => handleAddSection("text-image")}
            >
              Add section
            </button>
            <button type="button" className="cms-toolbar__button" onClick={handleAddPage}>
              Add page
            </button>
          </div>
          {draft.pages.length > 0 ? (
            <div className="cms-toolbar__pages">
              {draft.pages.map((page) => (
                <a
                  key={page.slug}
                  className="cms-toolbar__button"
                  href={resolvePublicPath(`/custom/?slug=${encodeURIComponent(page.slug)}&edit=1`)}
                >
                  {page.title}
                </a>
              ))}
            </div>
          ) : null}
          {hasChanges ? (
            <p className="cms-toolbar__text cms-toolbar__text--warn">You have unsaved changes.</p>
          ) : null}
          {status ? <p className="cms-toolbar__text">{status}</p> : null}
        </aside>
      ) : null}

      {imageEdit ? (
        <ImageEditModal
          initialSrc={imageEdit.src}
          initialAlt={imageEdit.alt}
          onCancel={() => setImageEdit(null)}
          onSave={(src, alt) => {
            if (imageEdit.selector.startsWith("cms-section:")) {
              const sectionId = imageEdit.selector.replace("cms-section:", "");
              updateDraft((current) => ({
                ...current,
                sections: current.sections.map((section) =>
                  section.id === sectionId
                    ? { ...section, imageSrc: src, imageAlt: alt }
                    : section,
                ),
              }));
            } else {
              updateDraft((current) => ({
                ...current,
                images: {
                  ...current.images,
                  [imageEdit.selector]: { src, alt },
                },
              }));
            }
            setImageEdit(null);
            setStatus("Unsaved changes — click Save when ready.");
          }}
        />
      ) : null}
    </>
  );
}
