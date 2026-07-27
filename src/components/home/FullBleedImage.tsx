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
      <div className="media-frame max-h-[85vh] min-h-[55vh]">
        <ImageWithFallback
          src={fullBleed.image.src}
          alt={fullBleed.image.alt}
          width={fullBleed.image.width}
          height={fullBleed.image.height}
          className="h-full max-h-[85vh] min-h-[55vh] w-full object-cover"
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
