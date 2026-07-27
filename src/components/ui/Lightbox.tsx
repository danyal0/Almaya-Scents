"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ContentImage } from "@/content/almaya-content";
import { getAssetPath } from "@/lib/assets";
import { trapFocus } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

type LightboxProps = {
  images: ContentImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Accessible image lightbox: focus is trapped, Escape closes, arrow keys
 * navigate, and touch swipes move between images.
 */
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const current = images[index];
  const count = images.length;

  const goTo = useCallback(
    (next: number) => {
      setLoaded(false);
      onIndexChange((next + count) % count);
    },
    [count, onIndexChange],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else {
        trapFocus(event, dialog);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [goTo, index, onClose]);

  if (!current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer, ${index + 1} of ${count}: ${current.alt}`}
      className="on-dark fixed inset-0 z-[80] flex flex-col bg-ink/95 text-ivory"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        touchStartX.current = null;
        if (startX === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? startX) - startX;
        if (Math.abs(delta) > 48) {
          goTo(delta < 0 ? index + 1 : index - 1);
        }
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="font-sans text-meta uppercase tracking-[0.18em] text-ivory/70">
          {index + 1} — {count}
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center transition-opacity duration-[150ms] hover:opacity-60"
          aria-label="Close image viewer"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path d="M1 1l16 16M17 1L1 17" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-5 pb-6 sm:px-20"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {!loaded ? (
          <div className="absolute inset-x-5 inset-y-0 sm:inset-x-20">
            <LoadingSkeleton className="opacity-20" />
          </div>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element -- static export uses pre-sized local assets */}
        <img
          key={current.src}
          src={getAssetPath(current.src)}
          alt={current.alt}
          width={current.width}
          height={current.height}
          onLoad={() => setLoaded(true)}
          className="relative max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-10 pb-8">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="inline-flex h-11 w-11 items-center justify-center transition-opacity duration-[150ms] hover:opacity-60"
          aria-label="Previous image"
        >
          <svg
            aria-hidden="true"
            width="26"
            height="12"
            viewBox="0 0 26 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path d="M25 6H1m0 0l5-5M1 6l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="inline-flex h-11 w-11 items-center justify-center transition-opacity duration-[150ms] hover:opacity-60"
          aria-label="Next image"
        >
          <svg
            aria-hidden="true"
            width="26"
            height="12"
            viewBox="0 0 26 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path d="M1 6h24m0 0l-5-5m5 5l-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
