import { almayaContent } from "@/content/almaya-content";
import { Button } from "@/components/ui/Button";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Full-viewport cinematic hero. The section is pulled up beneath the
 * transparent header; a soft ivory gradient at the base keeps the
 * editorial copy legible over any imagery.
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
          className="hero-settle h-full w-full object-cover object-[70%_center] md:object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ivory via-ivory/55 to-transparent" />
      </div>

      <div className="container-editorial relative pb-16 pt-[calc(var(--header-height)+4rem)] md:pb-24">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h1
              id="hero-heading"
              className="mt-5 font-serif text-display-xl font-light text-ink"
            >
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 max-w-xl text-body text-charcoal/80">
              {hero.subline}
            </p>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              {hero.secondaryCta ? (
                <Button href={hero.secondaryCta.href} variant="outline">
                  {hero.secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
