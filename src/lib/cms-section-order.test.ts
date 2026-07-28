import { describe, expect, it } from "vitest";

import type { CmsSection, ContentOverrides } from "@/lib/edit-overrides";
import {
  applyVisibleSectionOrder,
  getVisiblePageSections,
  moveIdInList,
  moveSectionInList,
} from "@/lib/cms-section-order";

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

describe("moveIdInList", () => {
  it("reorders ids", () => {
    expect(moveIdInList(["a", "b", "c"], "a", 2)).toEqual(["b", "c", "a"]);
    expect(moveIdInList(["a", "b", "c"], "c", 0)).toEqual(["c", "a", "b"]);
  });
});

describe("applyVisibleSectionOrder", () => {
  it("reorders even when visible sections have mixed legacy pageKeys", () => {
    const current: ContentOverrides = {
      texts: {},
      images: {},
      positions: {},
      pages: [],
      sections: [
        section("a", 0, "/Almaya-Scents/"),
        section("b", 1, "/"),
        section("other", 0, "custom:lookbook"),
      ],
    };

    const moved = applyVisibleSectionOrder(current, ["b", "a"], "/");
    const home = getVisiblePageSections(moved.sections, "/");
    expect(home.map((item) => item.id)).toEqual(["b", "a"]);
    expect(home.map((item) => item.pageKey)).toEqual(["/", "/"]);
    expect(moved.sections.find((item) => item.id === "other")?.order).toBe(0);
  });

  it("updates order fields used by the grid sort", () => {
    const current: ContentOverrides = {
      texts: {},
      images: {},
      positions: {},
      pages: [],
      sections: [section("a", 0), section("b", 1), section("c", 2)],
    };

    const moved = applyVisibleSectionOrder(current, ["c", "a", "b"], "/");
    expect(
      getVisiblePageSections(moved.sections, "/").map((item) => [item.id, item.order]),
    ).toEqual([
      ["c", 0],
      ["a", 1],
      ["b", 2],
    ]);
  });
});
