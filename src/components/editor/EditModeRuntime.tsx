"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  clearStoredOverrides,
  EMPTY_OVERRIDES,
  OVERRIDES_FILE_PATH,
  resolvePublicPath,
  type ContentOverrides,
  normalizeOverrides,
  readStoredOverrides,
  writeStoredOverrides,
} from "@/lib/edit-overrides";
import { siteConfig } from "@/content/site-config";
import { firebaseAuth } from "@/lib/firebase";
import { loadFirebaseOverrides } from "@/lib/firebase-overrides";

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

export function EditModeRuntime() {
  const initialOverrides = readStoredOverrides();
  const initialEditEnabled =
    typeof window !== "undefined" && getEditModeEnabled();

  const [overrides, setOverrides] = useState<ContentOverrides>(initialOverrides);
  const [editEnabled] = useState(initialEditEnabled);
  const [authed, setAuthed] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const canEdit = editEnabled && authed;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      const allowed =
        user?.email?.toLowerCase() === siteConfig.adminEmail.toLowerCase();
      setAuthed(Boolean(allowed));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const local = initialOverrides;
    applyOverrides(initialOverrides);

    void loadFirebaseOverrides()
      .catch(async () => {
        const requestUrl = `${resolvePublicPath(OVERRIDES_FILE_PATH)}?t=${Date.now()}`;
        const response = await fetch(requestUrl);
        if (!response.ok) return EMPTY_OVERRIDES;
        return normalizeOverrides(await response.json());
      })
      .then((remote) => {
        if (cancelled) return;
        const resolvedRemote = remote ?? EMPTY_OVERRIDES;
        const merged: ContentOverrides = {
          texts: { ...resolvedRemote.texts, ...local.texts },
          images: { ...resolvedRemote.images, ...local.images },
        };
        setOverrides(merged);
        applyOverrides(merged);
      })
      .catch(() => {
        // No remote overrides file yet; local edits still work.
      });

    return () => {
      cancelled = true;
    };
  }, [initialOverrides]);

  useEffect(() => {
    if (!canEdit) {
      document.body.classList.remove("cms-edit-mode");
      return;
    }
    document.body.classList.add("cms-edit-mode");
    return () => document.body.classList.remove("cms-edit-mode");
  }, [canEdit]);

  useEffect(() => {
    if (!canEdit) return;

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

        const next: ContentOverrides = {
          texts: { ...overrides.texts },
          images: {
            ...overrides.images,
            [selector]: { src: nextSrc, alt: nextAlt },
          },
        };
        setOverrides(next);
        writeStoredOverrides(next);
        applyOverrides(next);
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

      const next: ContentOverrides = {
        texts: { ...overrides.texts, [selector]: nextText },
        images: { ...overrides.images },
      };
      setOverrides(next);
      writeStoredOverrides(next);
      applyOverrides(next);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [canEdit, overrides]);

  const exportJson = useMemo(() => JSON.stringify(overrides, null, 2), [overrides]);

  if (!canEdit) return null;

  return (
    <aside data-cms-toolbar className="cms-toolbar">
      <strong className="cms-toolbar__title">Edit mode</strong>
      <p className="cms-toolbar__text">
        Click any text or image to edit. Changes are stored in your browser.
      </p>
      <div className="cms-toolbar__actions">
        <button
          type="button"
          className="cms-toolbar__button"
          onClick={() => {
            navigator.clipboard.writeText(exportJson).catch(() => {
              // Clipboard API can be unavailable; ignore.
            });
            setSavedNotice("Copied JSON.");
          }}
        >
          Copy JSON
        </button>
        <button
          type="button"
          className="cms-toolbar__button"
          onClick={() => {
            clearStoredOverrides();
            setOverrides(EMPTY_OVERRIDES);
            window.location.reload();
          }}
        >
          Reset local edits
        </button>
        <a className="cms-toolbar__button" href={resolvePublicPath("/admin/")}>
          Open admin
        </a>
      </div>
      {savedNotice ? <p className="cms-toolbar__text">{savedNotice}</p> : null}
    </aside>
  );
}
