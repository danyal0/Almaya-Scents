import type { Product } from "@/content/almaya-content";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/products/ProductCard";

type ProductGridProps = {
  products: Product[];
  headingLevel?: "h2" | "h3";
  /** Number of leading cards rendered above the fold (eager images, CSS reveal). */
  aboveTheFold?: number;
};

/** Responsive collection grid: 3 columns desktop, 2 tablet, 1 mobile. */
export function ProductGrid({
  products,
  headingLevel = "h2",
  aboveTheFold = 0,
}: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
      {products.map((product, index) => {
        const eager = index < aboveTheFold;
        const card = (
          <ProductCard
            product={product}
            headingLevel={headingLevel}
            priority={eager}
          />
        );
        const riseDelay = ["", "rise-in-2", "rise-in-3", "rise-in-4"][
          Math.min(index, 3)
        ];
        return (
          <li key={product.slug}>
            {eager ? (
              <div className={`rise-in ${riseDelay}`.trim()}>{card}</div>
            ) : (
              <Reveal delay={(index % 3) * 0.08}>{card}</Reveal>
            )}
          </li>
        );
      })}
    </ul>
  );
}
