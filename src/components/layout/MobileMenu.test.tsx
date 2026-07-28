import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MobileMenu } from "@/components/layout/MobileMenu";

describe("MobileMenu", () => {
  it("renders navigation links when open", () => {
    render(<MobileMenu open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: /site navigation/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Collection" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    render(<MobileMenu open onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog and traps Tab cycling", async () => {
    render(<MobileMenu open onClose={() => {}} />);
    const user = userEvent.setup();

    const dialog = screen.getByRole("dialog", { name: /site navigation/i });
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    expect(closeButton).toHaveFocus();

    // Shift+Tab from the first element must wrap to the last focusable.
    await user.tab({ shift: true });
    const instagram = screen.getByRole("link", { name: /follow @almayascents/i });
    expect(instagram).toHaveFocus();

    // Tab from the last element must stay trapped inside the dialog.
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(<MobileMenu open onClose={() => {}} />);
    expect(document.documentElement.style.overflow).toBe("hidden");
    unmount();
    expect(document.documentElement.style.overflow).toBe("");
  });
});
