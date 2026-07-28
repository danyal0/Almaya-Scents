import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CmsSectionsHost } from "@/components/editor/CmsSectionsHost";
import type { ContentOverrides } from "@/lib/edit-overrides";

function draftWithTwoSections(): ContentOverrides {
  return {
    texts: {},
    images: {},
    positions: {},
    pages: [],
    sections: [
      {
        id: "sec-a",
        pageKey: "/",
        type: "text",
        title: "First block",
        body: "A",
        imageSrc: "",
        imageAlt: "",
        order: 0,
        span: "full",
      },
      {
        id: "sec-b",
        pageKey: "/",
        type: "text",
        title: "Second block",
        body: "B",
        imageSrc: "",
        imageAlt: "",
        order: 1,
        span: "full",
      },
    ],
  };
}

describe("CmsSectionsHost drag", () => {
  it("calls onMoveSection when dragging one card onto another", async () => {
    document.body.innerHTML = `<main id="main-content"><div id="cms-page-sections"></div></main>`;
    const onMoveSection = vi.fn();
    const user = userEvent.setup();

    render(
      <CmsSectionsHost
        draft={draftWithTwoSections()}
        canEdit
        onMoveSection={onMoveSection}
      />,
    );

    const firstHandle = await screen.findByRole("button", {
      name: /drag to reorder first block/i,
    });
    const secondCard = document.querySelector('[data-cms-section-id="sec-b"]');
    expect(secondCard).toBeTruthy();

    Object.defineProperty(document, "elementFromPoint", {
      configurable: true,
      value: () => secondCard,
    });

    await user.pointer([
      { keys: "[MouseLeft>]", target: firstHandle },
      {
        target: document.body,
        coords: { clientX: 40, clientY: 40, x: 40, y: 40 },
      },
      { keys: "[/MouseLeft]" },
    ]);

    expect(onMoveSection).toHaveBeenCalledWith("sec-a", 1);
  });

  it("moves with Up/Down buttons", async () => {
    document.body.innerHTML = `<main id="main-content"><div id="cms-page-sections"></div></main>`;
    const onMoveSection = vi.fn();
    const user = userEvent.setup();

    render(
      <CmsSectionsHost
        draft={draftWithTwoSections()}
        canEdit
        onMoveSection={onMoveSection}
      />,
    );

    const downs = await screen.findAllByRole("button", { name: "Down" });
    await user.click(downs[0]!);
    expect(onMoveSection).toHaveBeenCalledWith("sec-a", 1);
  });
});
