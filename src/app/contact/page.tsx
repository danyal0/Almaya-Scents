import type { Metadata } from "next";

import { almayaContent } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/icons";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: almayaContent.contactPage.intro,
  path: "/contact/",
});

/**
 * Instagram is the only verified public channel for Almaya Scents.
 * An email action appears only when NEXT_PUBLIC_CONTACT_EMAIL is set.
 */
export default function ContactPage() {
  const { contactPage } = almayaContent;
  const email = siteConfig.contactEmail;

  return (
    <div className="section-gap">
      <div className="container-editorial">
        <div className="rise-in max-w-3xl">
          <p className="eyebrow">Reach the House</p>
          <h1 className="mt-5 font-serif text-display-l font-light text-ink">
            {contactPage.title}
          </h1>
          <p className="mt-8 max-w-xl text-body text-charcoal/80">
            {contactPage.intro}
          </p>
        </div>

        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-10 md:mt-24 md:grid-cols-2">
          <Reveal>
            <section
              aria-label="Instagram"
              className="flex h-full flex-col items-start gap-6 border-t border-line pt-8"
            >
              <InstagramIcon size={24} className="text-ink" />
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-heading font-light text-ink">
                  Instagram
                </h2>
                <p className="text-body-sm text-muted">
                  Message {siteConfig.instagramHandle} directly for inquiries,
                  orders and everything in between.
                </p>
              </div>
              <Button href={siteConfig.instagramUrl} external className="mt-auto">
                Contact on Instagram
              </Button>
            </section>
          </Reveal>

          {email ? (
            <Reveal delay={0.1}>
              <section
                aria-label="Email"
                className="flex h-full flex-col items-start gap-6 border-t border-line pt-8"
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="text-ink"
                >
                  <rect x="2" y="5" width="20" height="14" rx="1" />
                  <path d="M2.5 6l9.5 7 9.5-7" />
                </svg>
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-heading font-light text-ink">
                    Email
                  </h2>
                  <p className="text-body-sm text-muted">
                    Prefer to write? Reach the house at{" "}
                    <span className="text-ink">{email}</span>.
                  </p>
                </div>
                <Button href={`mailto:${email}`} variant="outline" className="mt-auto">
                  Write to Almaya
                </Button>
              </section>
            </Reveal>
          ) : null}
        </div>
      </div>
    </div>
  );
}
