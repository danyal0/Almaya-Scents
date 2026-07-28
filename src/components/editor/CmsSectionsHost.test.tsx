import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { CmsSectionsHost } from "@/components/editor/CmsSectionsHost";
import { applyVisibleSectionOrder } from "@/lib/cms-section-order";
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

function StatefulHost({
  initial,
  pageKey = "/",
}: {
  initial: ContentOverrides;
  pageKey?: string;
}) {
  const [draft, setDraft] = useState(initial);
  return (
    <CmsSectionsHost
      draft={draft}
      canEdit
      onReorderSections={(orderedIds) => {
        setDraft((current) => applyVisibleSectionOrder(current, orderedIds, pageKey));
      }}
    />
  );
}

describe("CmsSectionsHost reorder", () => {
  it("calls onReorderSections when dragging one card onto another", async () => {
    document.body.innerHTML = `<main id="main-content"><div id="cms-page-sections"></div></main>`;
    const onReorderSections = vi.fn();
    const user = userEvent.setup();

    render(
      <CmsSectionsHost
        draft={draftWithTwoSections()}
        canEdit
        onReorderSections={onReorderSections}
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

    expect(onReorderSections).toHaveBeenCalledWith(["sec-b", "sec-a"]);
  });

  it("moves with Up/Down buttons and updates visible DOM order", async () => {
    document.body.innerHTML = `<main id="main-content"><div id="cms-page-sections"></div></main>`;
    const user = userEvent.setup();

    render(<StatefulHost initial={draftWithTwoSections()} />);

    const grid = await screen.findByText("First block");
    expect(grid).toBeTruthy();

    const down = await screen.findByRole("button", { name: /move first block down/i });
    await user.click(down);

    const cards = document.querySelectorAll("[data-cms-section-id]");
    expect(Array.from(cards).map((card) => card.getAttribute("data-cms-section-id"))).toEqual([
      "sec-b",
      "sec-a",
    ]);

    const up = await screen.findByRole("button", { name: /move first block up/i });
    await user.click(up);

    const cardsAfter = document.querySelectorAll("[data-cms-section-id]");
    expect(
      Array.from(cardsAfter).map((card) => card.getAttribute("data-cms-section-id")),
    ).toEqual(["sec-a", "sec-b"]);
  });

  it("Down is disabled on the last card", async () => {
    document.body.innerHTML = `<main id="main-content"><div id="cms-page-sections"></div></main>`;

    render(<StatefulHost initial={draftWithTwoSections()} />);

    const lastDown = await screen.findByRole("button", {
      name: /move second block down/i,
    });
    expect(lastDown).toBeDisabled();
  });
});
