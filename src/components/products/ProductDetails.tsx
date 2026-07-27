import type { Product } from "@/content/almaya-content";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { ScentNotes } from "@/components/products/ScentNotes";

type ProductDetailsProps = {
  product: Product;
};

/**
 * Product information column. Optional data (category, size, price, notes,
 * story, official store link) is omitted entirely when not verified — no
 * empty labels, no "N/A".
 */
export function ProductDetails({ product }: ProductDetailsProps) {
  const meta = [product.category, product.size].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="eyebrow">Almaya Scents</p>
        <h1 className="font-serif text-display-m font-light text-ink">
          {product.name}
        </h1>
        {meta ? (
          <p className="font-sans text-meta uppercase tracking-[0.18em] text-muted">
            {meta}
          </p>
        ) : null}
        {product.price ? (
          <p className="font-serif text-heading font-light text-ink">
            {product.price}
          </p>
        ) : null}
      </div>

      <p className="max-w-xl text-pretty text-body text-charcoal/80">
        {product.description}
      </p>

      <ScentNotes product={product} />

      {product.story ? (
        <section aria-label="Story" className="border-t border-line pt-8">
          <h2 className="eyebrow">The Story</h2>
          <p className="mt-4 max-w-xl text-pretty text-body text-charcoal/80">
            {product.story}
          </p>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        {product.officialUrl ? (
          <Button href={product.officialUrl} external>
            Shop Officially
          </Button>
        ) : (
          <>
            <Button href={siteConfig.instagramUrl} external>
              Order on Instagram
            </Button>
            <Button href={siteConfig.whatsappUrl} external variant="outline">
              WhatsApp {siteConfig.whatsappDisplay}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
