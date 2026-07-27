import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Product } from "@/content/almaya-content";
import { ScentNotes } from "@/components/products/ScentNotes";

const baseProduct: Product = {
  slug: "test-scent",
  name: "Test Scent",
  description: "A test composition.",
  images: [],
};

describe("ScentNotes", () => {
  it("renders nothing when a product has no verified notes", () => {
    const { container } = render(<ScentNotes product={baseProduct} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/n\/a/i)).not.toBeInTheDocument();
  });

  it("renders only the note groups that exist", () => {
    render(
      <ScentNotes
        product={{
          ...baseProduct,
          notes: { top: ["bergamot", "pear"], base: ["musk"] },
        }}
      />,
    );

    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("bergamot, pear")).toBeInTheDocument();
    expect(screen.getByText("Base")).toBeInTheDocument();
    expect(screen.getByText("musk")).toBeInTheDocument();
    expect(screen.queryByText("Heart")).not.toBeInTheDocument();
  });
});
