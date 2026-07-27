import { almayaContent, getFeaturedProducts } from "@/content/almaya-content";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";

/**
 * Asymmetric editorial arrangement of the featured products: three
 * columns with staggered vertical offsets on desktop, a single calm
 * column on mobile.
 */
export function FeaturedCollection() {
  const products = getFeaturedProducts().slice(0, 3);
  const { featured } = almayaContent;

  if (products.length === 0) return null;

  const offsets = ["lg:mt-0", "lg:mt-20", "lg:mt-40"];
  const widths = ["lg:col-span-5", "lg:col-span-4", "lg:col-span-3"];

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

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-14 xl:gap-x-20">
          {products.map((product, index) => (
            <Reveal
              key={product.slug}
              delay={index * 0.1}
              className={`${widths[index]} ${offsets[index]} ${
                index === 2 ? "sm:col-span-2 sm:mx-auto sm:max-w-md lg:col-span-3 lg:mx-0 lg:max-w-none" : ""
              }`}
            >
              <ProductCard product={product} />
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
