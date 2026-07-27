import type { Metadata } from "next";

import { almayaContent } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: almayaContent.aboutPage.intro,
  path: "/about/",
});

export default function AboutPage() {
  const { aboutPage } = almayaContent;

  return (
    <div className="section-gap">
      <div className="container-editorial">
        <div className="rise-in max-w-4xl">
          <p className="eyebrow">About Almaya Scents</p>
          <h1 className="mt-5 font-serif text-display-l font-light text-ink">
            {aboutPage.title}
          </h1>
          <p className="mt-8 max-w-2xl text-body text-charcoal/80">
            {aboutPage.intro}
          </p>
        </div>

        <div className="rise-in rise-in-2 mt-16 md:mt-24">
          <div className="media-frame aspect-[16/9]">
            <ImageWithFallback
              src={aboutPage.image.src}
              alt={aboutPage.image.alt}
              width={aboutPage.image.width}
              height={aboutPage.image.height}
              priority
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-14 md:mt-24 md:grid-cols-3 md:gap-10">
          {aboutPage.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.1}>
              <section
                aria-label={section.heading}
                className="flex flex-col gap-4 border-t border-line pt-8"
              >
                <h2 className="font-serif text-heading font-light text-ink">
                  {section.heading}
                </h2>
                <p className="text-body-sm text-muted">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 md:mt-28">
          <div className="flex flex-col items-center gap-6 border-t border-line pt-16 text-center">
            <p className="max-w-xl font-serif text-heading font-light italic text-charcoal/80">
              The rest of the Almaya story is told one release at a time.
            </p>
            <Button href={siteConfig.instagramUrl} external variant="outline">
              Follow {siteConfig.instagramHandle}
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
