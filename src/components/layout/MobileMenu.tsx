"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { primaryNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site-config";
import { trapFocus } from "@/lib/utils";
import { CloseIcon, InstagramIcon } from "@/components/ui/icons";
import { Wordmark } from "@/components/layout/Wordmark";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-screen navigation drawer. Focus is trapped while open, Escape and
 * backdrop clicks close it, and body scroll is locked.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Deferred so the focus survives the synthetic mouse events that
    // follow a touch tap (which would otherwise blur it).
    closeButtonRef.current?.focus();
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-[visibility] duration-[450ms] ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-[450ms] ease-[var(--ease-standard)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onKeyDown={(event) => trapFocus(event.nativeEvent, panelRef.current!)}
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-ivory transition-transform duration-[450ms] ease-[var(--ease-out-expo)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b border-line px-6">
          <Wordmark variant="compact" asLink={false} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center transition-opacity duration-[150ms] hover:opacity-60"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
          <ul className="flex flex-col gap-2">
            {primaryNavigation.map((item, index) => (
              <li
                key={item.href}
                className={`transition-all duration-[600ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${120 + index * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="link-underline inline-block py-2 font-serif text-[2rem] font-light leading-tight text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-8 py-6">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-3 font-sans text-meta uppercase tracking-[0.18em] text-muted transition-colors duration-[150ms] hover:text-ink"
          >
            <InstagramIcon size={16} />
            Follow {siteConfig.instagramHandle}
          </a>
        </div>
      </div>
    </div>
  );
}
