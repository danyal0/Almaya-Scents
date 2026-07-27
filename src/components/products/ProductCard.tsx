import Link from "next/link";

import type { Product } from "@/content/almaya-content";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

type ProductCardProps = {
  product: Product;
  /** Heading level of the product name within the surrounding hierarchy. */
  headingLevel?: "h2" | "h3";
  /** Eager-load the image (for cards rendered above the fold). */
  priority?: boolean;
  className?: string;
};

/**
 * Fully clickable, keyboard-accessible product card with a restrained
 * hover treatment: a slow image scale and an underline reveal.
 */
export function ProductCard({
  product,
  headingLevel: Heading = "h3",
  priority = false,
  className,
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}/`}
      className={cn("group block", className)}
      aria-label={`${product.name} — view details`}
    >
      <div className="media-frame aspect-[8/11]">
        <ImageWithFallback
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Heading className="font-serif text-heading font-light text-ink">
          {product.name}
        </Heading>
        {product.category ? (
          <p className="eyebrow">{product.category}</p>
        ) : null}
        <p className="max-w-md text-body-sm text-muted">{product.description}</p>
        <span className="link-underline mt-3 self-start font-sans text-meta uppercase tracking-[0.18em] text-ink">
          Discover
        </span>
      </div>
    </Link>
  );
}
