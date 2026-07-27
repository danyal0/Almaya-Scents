"use client";

import { useRef, useState } from "react";

import type { ContentImage } from "@/content/almaya-content";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

type ProductGalleryProps = {
  images: ContentImage[];
  productName: string;
};

/**
 * Product media gallery.
 *
 * Desktop: large main image with thumbnail selection.
 * Mobile: native swipe (scroll-snap) with visible pagination dots.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const active = images[activeIndex];

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
    }
  };

  return (
    <div aria-label={`${productName} gallery`}>
      {/* Mobile: swipeable, snap-scrolling track */}
      <div className="md:hidden">
        <div
          ref={trackRef}
          role="region"
          aria-label={`${productName} images, scroll horizontally`}
          tabIndex={0}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const el = event.currentTarget;
            const index = Math.round(el.scrollLeft / el.clientWidth);
            if (index !== activeIndex) setActiveIndex(index);
          }}
        >
          {images.map((image) => (
            <div key={image.src} className="w-full flex-none snap-center">
              <div className="media-frame aspect-[8/11]">
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 ? (
          <div className="mt-4 flex justify-center gap-3" role="tablist" aria-label="Gallery pagination">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Image ${index + 1} of ${images.length}`}
                onClick={() => scrollToIndex(index)}
                className="flex h-11 w-8 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-[3px] w-full transition-colors duration-[250ms]",
                    index === activeIndex ? "bg-ink" : "bg-warm-gray",
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: main image + thumbnails */}
      <div className="hidden gap-5 md:flex">
        {images.length > 1 ? (
          <div className="flex w-20 flex-none flex-col gap-4" role="tablist" aria-label="Gallery thumbnails">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "media-frame aspect-square border transition-colors duration-[250ms]",
                  index === activeIndex
                    ? "border-ink"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <ImageWithFallback
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="media-frame aspect-[8/11] flex-1">
          <ImageWithFallback
            key={active.src}
            src={active.src}
            alt={active.alt}
            width={active.width}
            height={active.height}
            priority
          />
        </div>
      </div>
    </div>
  );
}
