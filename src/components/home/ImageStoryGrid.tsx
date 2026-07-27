"use client";

import { useState } from "react";

import { almayaContent } from "@/content/almaya-content";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ratioClasses = {
  portrait: "aspect-[8/11]",
  landscape: "aspect-[16/9]",
  square: "aspect-square",
} as const;

/** Desktop mosaic spans for the five gallery images. */
const spanClasses = [
  "md:col-span-4",
  "md:col-span-4 md:mt-16",
  "md:col-span-4 md:mt-32",
  "md:col-span-5 md:-mt-10",
  "md:col-span-7",
];

/**
 * Editorial image mosaic. Each frame opens an accessible lightbox; the
 * grid itself remains fully usable without it.
 */
export function ImageStoryGrid() {
  const { gallery } = almayaContent;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="gallery-heading" className="section-gap bg-paper">
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            id="gallery-heading"
            eyebrow={gallery.eyebrow}
            title={gallery.title}
          />
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-12 md:items-start md:gap-8">
          {gallery.images.map((image, index) => (
            <li key={image.src} className={spanClasses[index] ?? "md:col-span-4"}>
              <Reveal delay={(index % 3) * 0.08}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group block w-full cursor-zoom-in"
                  aria-label={`Open image: ${image.alt}`}
                  aria-haspopup="dialog"
                >
                  <span
                    className={cn("media-frame block", ratioClasses[image.ratio])}
                  >
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                    />
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          images={gallery.images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
