"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { primaryNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site-config";
import { InstagramIcon, MenuIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/IconButton";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Wordmark } from "@/components/layout/Wordmark";

/**
 * Sticky header: transparent while resting over the hero, transitioning to
 * a lightly blurred ivory surface with a hairline border once scrolled.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > 12);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[300ms] ease-[var(--ease-standard)] ${
          scrolled
            ? "border-b border-line bg-ivory/90 supports-[backdrop-filter]:backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-editorial grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: menu trigger (mobile) / primary navigation (desktop) */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="-ml-2 inline-flex h-11 w-11 items-center justify-center transition-opacity duration-[150ms] hover:opacity-60 lg:hidden"
            >
              <MenuIcon />
            </button>
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {primaryNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className="link-underline py-2 font-sans text-meta uppercase tracking-[0.18em] text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Center: wordmark */}
          <Wordmark className="justify-self-center" />

          {/* Right: social */}
          <div className="flex items-center justify-end">
            <IconButton
              href={siteConfig.instagramUrl}
              external
              label={`Almaya Scents on Instagram (${siteConfig.instagramHandle})`}
              className="-mr-2"
            >
              <InstagramIcon />
            </IconButton>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
