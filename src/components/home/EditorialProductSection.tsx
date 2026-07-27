import type { EditorialStory } from "@/content/almaya-content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Reveal } from "@/components/ui/Reveal";

type EditorialProductSectionProps = {
  story: EditorialStory;
  /** Place the text column before the image on desktop. */
  reverse?: boolean;
  headingId: string;
};

/**
 * Large image-and-text editorial composition (~60/40 on desktop,
 * image-first on mobile).
 */
export function EditorialProductSection({
  story,
  reverse = false,
  headingId,
}: EditorialProductSectionProps) {
  return (
    <section aria-labelledby={headingId} className="section-gap">
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-20">
          <Reveal
            className={cn("lg:col-span-3", reverse && "lg:order-2")}
          >
            <div className="media-frame aspect-[16/10]">
              <ImageWithFallback
                src={story.image.src}
                alt={story.image.alt}
                width={story.image.width}
                height={story.image.height}
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          <Reveal
            delay={0.12}
            className={cn("lg:col-span-2", reverse && "lg:order-1")}
          >
            <div className={cn("flex max-w-lg flex-col items-start gap-6", reverse && "lg:ml-auto")}>
              <p className="eyebrow">{story.eyebrow}</p>
              <h2
                id={headingId}
                className="font-serif text-display-m font-light text-ink"
              >
                {story.title}
              </h2>
              <p className="text-body text-charcoal/80">{story.body}</p>
              <Button href={story.cta.href} variant="outline" className="mt-2">
                {story.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
