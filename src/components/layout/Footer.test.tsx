import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("shows the current year dynamically", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${year} Almaya Scents`)),
    ).toBeInTheDocument();
  });

  it("secures the external Instagram link", () => {
    render(<Footer />);
    const instagram = screen.getByRole("link", { name: /instagram/i });
    expect(instagram).toHaveAttribute("target", "_blank");
    expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders footer and legal navigation", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Collection" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
  });

  it("links to MrCasm as the powered-by credit", () => {
    render(<Footer />);
    const credit = screen.getByRole("link", { name: /mrcasm/i });
    expect(credit).toHaveAttribute("href", "https://mrcasm.com");
    expect(credit).toHaveAttribute("target", "_blank");
    expect(credit).toHaveAttribute("rel", "noopener noreferrer");
  });
});
