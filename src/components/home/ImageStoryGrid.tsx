"use client";

import { useState } from "react";

import { almayaContent } from "@/content/almaya-content";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Even editorial grid — every frame uses the same 4:5 height so the
 * section stays level across mobile and desktop.
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

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {gallery.images.map((image, index) => (
            <li key={image.src}>
              <Reveal delay={(index % 3) * 0.08}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group block w-full cursor-zoom-in"
                  aria-label={`Open image: ${image.alt}`}
                  aria-haspopup="dialog"
                >
                  <span className="media-frame block aspect-[4/5] w-full">
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-cover object-center"
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
