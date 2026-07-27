import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ContentImage } from "@/content/almaya-content";
import { Lightbox } from "@/components/ui/Lightbox";

const images: ContentImage[] = [
  { src: "/images/placeholders/gallery-01.svg", alt: "First image", width: 10, height: 10 },
  { src: "/images/placeholders/gallery-02.svg", alt: "Second image", width: 10, height: 10 },
];

function renderLightbox(overrides?: {
  onClose?: () => void;
  onIndexChange?: (index: number) => void;
}) {
  const onClose = overrides?.onClose ?? vi.fn();
  const onIndexChange = overrides?.onIndexChange ?? vi.fn();
  render(
    <Lightbox
      images={images}
      index={0}
      onIndexChange={onIndexChange}
      onClose={onClose}
    />,
  );
  return { onClose, onIndexChange };
}

describe("Lightbox", () => {
  it("renders as a modal dialog with a counter", () => {
    renderLightbox();
    expect(
      screen.getByRole("dialog", { name: /1 of 2: First image/i }),
    ).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const { onClose } = renderLightbox();
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates with arrow keys and wraps around", async () => {
    const { onIndexChange } = renderLightbox();
    await userEvent.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    await userEvent.keyboard("{ArrowLeft}");
    expect(onIndexChange).toHaveBeenLastCalledWith(1); // (0 - 1 + 2) % 2
  });

  it("focuses the close control and traps Tab focus", async () => {
    renderLightbox();
    const user = userEvent.setup();

    const close = screen.getByRole("button", { name: /close image viewer/i });
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: /next image/i })).toHaveFocus();

    await user.tab();
    expect(close).toHaveFocus();
  });
});
