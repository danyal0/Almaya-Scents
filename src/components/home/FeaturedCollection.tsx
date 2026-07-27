import { almayaContent, getFeaturedProducts } from "@/content/almaya-content";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";

/**
 * Even two-up (or three-up) featured products — equal column widths and
 * matching card heights so the row reads as one calm band.
 */
export function FeaturedCollection() {
  const products = getFeaturedProducts().slice(0, 3);
  const { featured } = almayaContent;

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="featured-heading" className="section-gap">
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            id="featured-heading"
            eyebrow={featured.eyebrow}
            title={featured.title}
            intro={featured.intro}
            align="center"
          />
        </Reveal>

        <div
          className={`mt-16 grid grid-cols-1 items-stretch gap-x-10 gap-y-16 sm:grid-cols-2 ${
            products.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 lg:mx-auto lg:max-w-5xl"
          } lg:gap-x-14`}
        >
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.1} className="h-full">
              <ProductCard product={product} className="h-full" />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 text-center">
          <AnimatedLink href="/products/">View the Full Collection</AnimatedLink>
        </div>
      </div>
    </section>
  );
}
