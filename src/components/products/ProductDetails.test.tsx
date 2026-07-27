import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Product } from "@/content/almaya-content";
import { ProductDetails } from "@/components/products/ProductDetails";

const minimalProduct: Product = {
  slug: "minimal",
  name: "Minimal Scent",
  description: "A minimal composition.",
  images: [],
};

describe("ProductDetails", () => {
  it("renders name and description", () => {
    render(<ProductDetails product={minimalProduct} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Minimal Scent" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A minimal composition.")).toBeInTheDocument();
  });

  it("omits optional sections instead of showing placeholders", () => {
    render(<ProductDetails product={minimalProduct} />);
    expect(screen.queryByText(/n\/a/i)).not.toBeInTheDocument();
    expect(screen.queryByText("The Story")).not.toBeInTheDocument();
    expect(screen.queryByText("Notes")).not.toBeInTheDocument();
  });

  it("renders category and story when verified", () => {
    render(
      <ProductDetails
        product={{
          ...minimalProduct,
          category: "Eau de Parfum",
          story: "A verified story.",
        }}
      />,
    );
    expect(screen.getByText("Eau de Parfum")).toBeInTheDocument();
    expect(screen.getByText("A verified story.")).toBeInTheDocument();
  });

  it("falls back to an Instagram inquiry when no official store exists", () => {
    render(<ProductDetails product={minimalProduct} />);
    const cta = screen.getByRole("link", { name: /inquire on instagram/i });
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links to the official store when verified", () => {
    render(
      <ProductDetails
        product={{ ...minimalProduct, officialUrl: "https://example.com/shop" }}
      />,
    );
    const cta = screen.getByRole("link", { name: /shop officially/i });
    expect(cta).toHaveAttribute("href", "https://example.com/shop");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.queryByRole("link", { name: /inquire on instagram/i }),
    ).not.toBeInTheDocument();
  });
});
