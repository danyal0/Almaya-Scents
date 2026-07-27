import { almayaContent } from "@/content/almaya-content";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Full-bleed photographic moment — the image dominates, accompanied only
 * by a whispered caption.
 */
export function FullBleedImage() {
  const { fullBleed } = almayaContent;

  return (
    <section aria-label="Brand imagery" className="relative">
      <div className="media-frame aspect-[16/10] w-full md:aspect-auto md:max-h-[85vh] md:min-h-[55vh]">
        <ImageWithFallback
          src={fullBleed.image.src}
          alt={fullBleed.image.alt}
          width={fullBleed.image.width}
          height={fullBleed.image.height}
          className="h-full w-full object-cover object-center md:max-h-[85vh] md:min-h-[55vh]"
        />
      </div>
      <Reveal className="container-editorial">
        <p className="border-l border-line py-6 pl-6 font-serif text-heading font-light italic text-charcoal/80">
          {fullBleed.caption}
        </p>
      </Reveal>
    </section>
  );
}
