import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Product } from "@/content/almaya-content";
import { ProductCard } from "@/components/products/ProductCard";

const product: Product = {
  slug: "card-test",
  name: "Card Test",
  description: "Short description.",
  images: [
    {
      src: "/images/placeholders/product-01-portrait.svg",
      alt: "A test flacon",
      width: 1600,
      height: 2200,
    },
  ],
};

describe("ProductCard", () => {
  it("is a single link to the product page", () => {
    render(<ProductCard product={product} />);
    const link = screen.getByRole("link", { name: /card test/i });
    // next/link normalises the trailing slash outside the Next runtime;
    // the production build re-applies it via `trailingSlash: true`.
    expect(link.getAttribute("href")).toMatch(/^\/products\/card-test\/?$/);
  });

  it("renders the product image with its alt text", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByAltText("A test flacon")).toBeInTheDocument();
  });

  it("omits the category line when not verified", () => {
    render(<ProductCard product={product} />);
    expect(screen.queryByText(/n\/a/i)).not.toBeInTheDocument();
  });
});
