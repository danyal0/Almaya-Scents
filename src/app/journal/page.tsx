import type { Metadata } from "next";

import { almayaContent } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Journal",
  description: almayaContent.journalPage.emptyState.body,
  path: "/journal/",
});

/**
 * The journal currently has no verified Almaya stories, so it presents a
 * considered empty state rather than fabricated articles.
 */
export default function JournalPage() {
  const { journalPage } = almayaContent;

  return (
    <div className="section-gap">
      <div className="container-editorial">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">Notes from the House</p>
            <h1 className="mt-5 font-serif text-display-l font-light text-ink">
              {journalPage.title}
            </h1>
          </div>
        </Reveal>

        <Reveal className="mt-20 md:mt-28">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 border-y border-line py-20 text-center md:py-28">
            <span
              aria-hidden="true"
              className="block h-12 w-px bg-line-strong"
            />
            <h2 className="font-serif text-display-m font-light text-ink">
              {journalPage.emptyState.heading}
            </h2>
            <p className="max-w-lg text-body-sm text-muted">
              {journalPage.emptyState.body}
            </p>
            <Button href={siteConfig.instagramUrl} external variant="outline">
              Follow on Instagram
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
