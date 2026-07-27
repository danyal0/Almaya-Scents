import type { Metadata } from "next";

import { almayaContent, getAllProducts } from "@/content/almaya-content";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata: Metadata = buildMetadata({
  title: "The Collection",
  description: almayaContent.collectionPage.intro,
  path: "/products/",
});

export default function ProductsPage() {
  const products = getAllProducts();
  const { collectionPage } = almayaContent;

  return (
    <div className="section-gap">
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Almaya Scents"
            title={collectionPage.title}
            intro={collectionPage.intro}
          />
        </Reveal>

        <div className="mt-16 border-t border-line pt-16">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
