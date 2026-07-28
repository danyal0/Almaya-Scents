import Link from "next/link";

import { footerNavigation, legalNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site-config";
import { InstagramIcon } from "@/components/ui/icons";
import { Wordmark } from "@/components/layout/Wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-ivory">
      <div className="container-editorial flex flex-col gap-14 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
          <Wordmark />

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline py-2 font-sans text-meta uppercase tracking-[0.18em] text-ivory/80 transition-colors duration-[150ms] hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory/80 transition-colors duration-[150ms] hover:text-ivory"
          >
            <InstagramIcon size={16} />
            Instagram
          </a>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-ivory/15 pt-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-meta tracking-[0.08em] text-ivory/50">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <p className="font-sans text-meta tracking-[0.08em] text-ivory/50">
              Proudly powered by{" "}
              <a
                href="https://mrcasm.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-ivory/80 transition-colors duration-[150ms] hover:text-ivory"
              >
                MrCasm
              </a>
            </p>
          </div>

          <nav aria-label="Legal">
            <ul className="flex gap-8">
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline py-2 font-sans text-meta uppercase tracking-[0.18em] text-ivory/60 transition-colors duration-[150ms] hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
