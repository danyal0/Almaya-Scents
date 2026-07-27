import type { Metadata } from "next";

import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use for the Almaya Scents website.",
  path: "/terms/",
});

const sections = [
  {
    heading: "Use of this website",
    body: "This website presents the world of Almaya Scents for informational purposes. You are welcome to browse and share links to it. You may not misrepresent the site, interfere with its operation, or use it for unlawful purposes.",
  },
  {
    heading: "No online sales",
    body: "This website does not process orders or payments. Product information is presented editorially; for purchases and availability, contact Almaya Scents directly through Instagram.",
  },
  {
    heading: "Intellectual property",
    body: "The Almaya Scents name, wordmark, texts and imagery presented on this site belong to their respective owners and may not be reproduced for commercial purposes without permission.",
  },
  {
    heading: "External services",
    body: "Links to external services such as Instagram are provided for convenience. Almaya Scents is not responsible for the content or practices of external services.",
  },
  {
    heading: "Changes",
    body: "These terms and the content of the site may be updated over time. Continued use of the site after changes constitutes acceptance of the updated terms.",
  },
  {
    heading: "Contact",
    body: `Questions about these terms can be sent to Almaya Scents through Instagram (${siteConfig.instagramHandle}).`,
  },
];

export default function TermsPage() {
  return (
    <div className="section-gap">
      <div className="container-editorial">
        <div className="rise-in max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-5 font-serif text-display-l font-light text-ink">
            Terms
          </h1>
          <p className="mt-8 max-w-xl text-body text-charcoal/80">
            The terms that apply when you use this website.
          </p>
        </div>

        <div className="mt-16 flex max-w-2xl flex-col gap-12 md:mt-20">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.05}>
              <section
                aria-label={section.heading}
                className="flex flex-col gap-3 border-t border-line pt-8"
              >
                <h2 className="font-serif text-heading font-light text-ink">
                  {section.heading}
                </h2>
                <p className="text-body-sm text-muted">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
