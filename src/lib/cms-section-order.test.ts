import { describe, expect, it } from "vitest";

import type { CmsSection, ContentOverrides } from "@/lib/edit-overrides";
import { moveSectionInList } from "@/lib/cms-section-order";

function section(id: string, order: number, pageKey = "/"): CmsSection {
  return {
    id,
    pageKey,
    type: "text",
    title: id,
    body: "",
    imageSrc: "",
    imageAlt: "",
    order,
    span: "full",
  };
}

/** Mirrors EditModeRuntime.handleMoveSection pageKey resolution. */
function moveBySectionId(
  current: ContentOverrides,
  sectionId: string,
  toIndex: number,
): ContentOverrides {
  const target = current.sections.find((item) => item.id === sectionId);
  if (!target) return current;
  const pageSections = current.sections
    .filter((item) => item.pageKey === target.pageKey)
    .sort((a, b) => a.order - b.order);
  const reordered = moveSectionInList(pageSections, sectionId, toIndex);
  if (reordered === pageSections) return current;
  const byId = new Map(reordered.map((item) => [item.id, item]));
  return {
    ...current,
    sections: current.sections.map((item) => byId.get(item.id) ?? item),
  };
}

describe("moveSectionInList", () => {
  it("moves a section later in the list", () => {
    const input = [section("a", 0), section("b", 1), section("c", 2)];
    const result = moveSectionInList(input, "a", 2);
    expect(result.map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(result.map((item) => item.order)).toEqual([0, 1, 2]);
  });

  it("moves a section earlier in the list", () => {
    const input = [section("a", 0), section("b", 1), section("c", 2)];
    const result = moveSectionInList(input, "c", 0);
    expect(result.map((item) => item.id)).toEqual(["c", "a", "b"]);
  });

  it("no-ops when index is unchanged", () => {
    const input = [section("a", 0), section("b", 1)];
    const result = moveSectionInList(input, "a", 0);
    expect(result).toEqual(input);
  });

  it("clamps out-of-range indexes", () => {
    const input = [section("a", 0), section("b", 1)];
    const result = moveSectionInList(input, "a", 99);
    expect(result.map((item) => item.id)).toEqual(["b", "a"]);
  });
});

describe("Up/Down reorder by section pageKey", () => {
  it("reorders even when URL page key would not match section pageKey", () => {
    const current: ContentOverrides = {
      texts: {},
      images: {},
      positions: {},
      pages: [],
      sections: [
        section("a", 0, "/Almaya-Scents/"),
        section("b", 1, "/Almaya-Scents/"),
      ],
    };

    const moved = moveBySectionId(current, "a", 1);
    expect(
      moved.sections
        .filter((item) => item.pageKey === "/Almaya-Scents/")
        .sort((a, b) => a.order - b.order)
        .map((item) => item.id),
    ).toEqual(["b", "a"]);
  });
});
