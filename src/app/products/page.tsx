import type { Metadata } from "next";

import { almayaContent, getAllProducts } from "@/content/almaya-content";
import { buildMetadata } from "@/lib/seo";
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
        <div className="rise-in">
          <SectionHeading
            as="h1"
            eyebrow="Almaya Scents"
            title={collectionPage.title}
            intro={collectionPage.intro}
          />
        </div>

        <div className="mt-16 border-t border-line pt-16">
          <ProductGrid products={products} aboveTheFold={3} />
        </div>
      </div>
    </div>
  );
}
