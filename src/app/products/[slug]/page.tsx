import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/content/almaya-content";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductGrid } from "@/components/products/ProductGrid";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}/`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product.slug);

  return (
    <div className="section-gap">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ProductGallery images={product.images} productName={product.name} />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductDetails product={product} />
          </Reveal>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="related-heading"
            className="mt-24 border-t border-line pt-16 md:mt-32"
          >
            <Reveal>
              <SectionHeading
                id="related-heading"
                eyebrow="Continue Exploring"
                title="More from the Collection"
              />
            </Reveal>
            <div className="mt-14">
              <ProductGrid products={related} headingLevel="h3" />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
