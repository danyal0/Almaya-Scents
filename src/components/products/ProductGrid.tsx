import type { Product } from "@/content/almaya-content";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";

type ProductGridProps = {
  products: Product[];
  headingLevel?: "h2" | "h3";
};

/** Responsive collection grid: 3 columns desktop, 2 tablet, 1 mobile. */
export function ProductGrid({ products, headingLevel = "h2" }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
      {products.map((product, index) => (
        <li key={product.slug}>
          <Reveal delay={(index % 3) * 0.08}>
            <ProductCard product={product} headingLevel={headingLevel} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
