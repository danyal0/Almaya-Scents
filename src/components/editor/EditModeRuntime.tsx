"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  clearStoredOverrides,
  EMPTY_OVERRIDES,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  type ContentOverrides,
  normalizeOverrides,
  writeStoredOverrides,
} from "@/lib/edit-overrides";
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
      const image = nearestEditableImage(target);
      if (image) {
        event.preventDefault();
        event.stopPropagation();
        const selector = getElementPath(image);
        const nextSrc = window.prompt("Enter image URL or path:", image.src);
        if (!nextSrc) return;
        const nextAlt = window.prompt("Enter image alt text:", image.alt) ?? image.alt;

        updateDraft((current) => ({
          texts: { ...current.texts },
          images: {
            ...current.images,
            [selector]: { src: nextSrc, alt: nextAlt },
          },
        }));
        setStatus("Unsaved changes — click Save when ready.");
        return;
      }

      if (!isTextEditable(target)) return;
      if (target.closest("[data-cms-toolbar]")) return;

      event.preventDefault();
      event.stopPropagation();

      const selector = getElementPath(target);
      const currentText = target.textContent ?? "";
      const nextText = window.prompt("Edit text:", currentText);
      if (nextText === null) return;

      updateDraft((current) => ({
        texts: { ...current.texts, [selector]: nextText },
        images: { ...current.images },
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

  if (!canEdit) return null;

  const hasChanges =
    JSON.stringify(draft) !== JSON.stringify(published);

  return (
    <aside data-cms-toolbar className="cms-toolbar">
      <strong className="cms-toolbar__title">Edit mode</strong>
      <p className="cms-toolbar__text">
        Click any text or image to edit. Then save or reset below.
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
      </div>
      {hasChanges ? (
        <p className="cms-toolbar__text cms-toolbar__text--warn">You have unsaved changes.</p>
      ) : null}
      {status ? <p className="cms-toolbar__text">{status}</p> : null}
    </aside>
  );
}
