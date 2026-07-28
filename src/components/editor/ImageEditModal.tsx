"use client";

import { useState } from "react";

import { uploadCmsImage } from "@/lib/firebase-storage";

type ImageEditModalProps = {
  initialSrc: string;
  initialAlt: string;
  onCancel: () => void;
  onSave: (src: string, alt: string) => void;
};

export function ImageEditModal({
  initialSrc,
  initialAlt,
  onCancel,
  onSave,
}: ImageEditModalProps) {
  const [src, setSrc] = useState(initialSrc);
  const [alt, setAlt] = useState(initialAlt);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="cms-modal" role="dialog" aria-modal="true" aria-label="Edit image">
      <div className="cms-modal__panel" data-cms-toolbar>
        <h2 className="cms-modal__title">Edit image</h2>
        <p className="cms-modal__text">Paste a URL or upload an image file.</p>

        <label className="cms-modal__label">
          Image URL
          <input
            value={src}
            onChange={(event) => setSrc(event.target.value)}
            className="cms-modal__input"
            placeholder="https://… or /images/…"
          />
        </label>

        <label className="cms-modal__label">
          Alt text
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            className="cms-modal__input"
            placeholder="Describe the image"
          />
        </label>

        <label className="cms-modal__label">
          Upload image
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="cms-modal__file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setUploading(true);
              setError("");
              try {
                const url = await uploadCmsImage(file);
                setSrc(url);
              } catch (uploadError) {
                const message =
                  uploadError instanceof Error
                    ? uploadError.message
                    : "Upload failed. Enable Firebase Storage and publish storage rules.";
                setError(message);
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>

        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt || "Preview"} className="cms-modal__preview" />
        ) : null}

        {error ? <p className="cms-modal__error">{error}</p> : null}
        {uploading ? <p className="cms-modal__text">Uploading…</p> : null}

        <div className="cms-modal__actions">
          <button type="button" className="cms-toolbar__button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="cms-toolbar__button cms-toolbar__button--primary"
            disabled={!src || uploading}
            onClick={() => onSave(src, alt)}
          >
            Apply image
          </button>
        </div>
      </div>
    </div>
  );
}
