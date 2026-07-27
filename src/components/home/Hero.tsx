import { almayaContent } from "@/content/almaya-content";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

/**
 * Full-viewport cinematic hero. The section is pulled up beneath the
 * transparent header; soft ivory scrims keep editorial copy legible
 * over any imagery without fighting baked-in photo text.
 *
 * Entrance motion is CSS-only (`rise-in`) so the headline — the page's
 * LCP element — paints without waiting for hydration.
 */
export function Hero() {
  const { hero } = almayaContent;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative -mt-[var(--header-height)] flex min-h-[calc(100svh-var(--announcement-height))] items-end overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <ImageWithFallback
          src={hero.image.src}
          alt=""
          width={hero.image.width}
          height={hero.image.height}
          priority
          className="hero-settle h-full w-full object-cover object-[68%_center] md:object-center"
        />
        {/* Soft top veil keeps the transparent header clear of busy imagery */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ivory/70 via-ivory/25 to-transparent md:h-48" />
        {/* Stronger base gradient for headline / CTA legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ivory via-ivory/75 to-transparent" />
      </div>

      <div className="container-editorial relative pb-16 pt-[calc(var(--header-height)+4rem)] md:pb-24">
        <div className="max-w-3xl">
          <p className="rise-in eyebrow">{hero.eyebrow}</p>
          <h1
            id="hero-heading"
            className="rise-in rise-in-2 mt-5 font-serif text-display-xl font-light text-ink"
          >
            {hero.headline}
          </h1>
          <p className="rise-in rise-in-3 mt-6 max-w-xl text-body text-charcoal/80">
            {hero.subline}
          </p>
          <div className="rise-in rise-in-4 mt-10 flex flex-wrap items-center gap-4">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            {hero.secondaryCta ? (
              <Button href={hero.secondaryCta.href} variant="outline">
                {hero.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
