import type { Metadata } from "next";

import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description:
    "How the Almaya Scents website handles your information.",
  path: "/privacy/",
});

const sections = [
  {
    heading: "What this website collects",
    body: "This website is a static, informational site. It does not use cookies, does not run analytics or advertising trackers, and does not create accounts or profiles. Browsing the site does not send personal information to Almaya Scents.",
  },
  {
    heading: "Newsletter",
    body: "If a newsletter sign-up is available and you choose to subscribe, the email address you provide is sent directly to the third-party email service configured for that form and is used only to send you updates from Almaya Scents. You can unsubscribe at any time using the link included in every email.",
  },
  {
    heading: "Hosting",
    body: "The site is served as static files by its hosting provider (such as GitHub Pages), which may process technical data like IP addresses in standard server logs as part of operating the service. Please refer to your hosting provider's privacy documentation for details.",
  },
  {
    heading: "External links",
    body: "The site links to external services, including Instagram. Once you leave this website, the privacy practices of those services apply. We encourage you to review their policies.",
  },
  {
    heading: "Questions",
    body: `For any privacy questions, contact Almaya Scents through Instagram (${siteConfig.instagramHandle}).`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="section-gap">
      <div className="container-editorial">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-5 font-serif text-display-l font-light text-ink">
              Privacy
            </h1>
            <p className="mt-8 max-w-xl text-body text-charcoal/80">
              A plain-language description of how this website handles your
              information.
            </p>
          </div>
        </Reveal>

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
