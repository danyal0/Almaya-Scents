import { almayaContent } from "@/content/almaya-content";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Reveal } from "@/components/ui/Reveal";

/** Calm editorial brand section: one strong image, considered copy. */
export function BrandStory() {
  const { brandStory } = almayaContent;

  return (
    <section aria-labelledby="brand-story-heading" className="section-gap">
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <div className="media-frame aspect-[4/5] max-w-md lg:max-w-none">
              <ImageWithFallback
                src={brandStory.image.src}
                alt={brandStory.image.alt}
                width={brandStory.image.width}
                height={brandStory.image.height}
              />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="flex max-w-xl flex-col items-start gap-6">
              <p className="eyebrow">{brandStory.eyebrow}</p>
              <h2
                id="brand-story-heading"
                className="font-serif text-display-m font-light text-ink"
              >
                {brandStory.title}
              </h2>
              {brandStory.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-body text-charcoal/80">
                  {paragraph}
                </p>
              ))}
              <Button href={brandStory.cta.href} variant="outline" className="mt-2">
                {brandStory.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
