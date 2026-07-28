import { describe, expect, it } from "vitest";

import type { CmsSection } from "@/lib/edit-overrides";
import { moveSectionInList } from "@/lib/cms-section-order";

function section(id: string, order: number): CmsSection {
  return {
    id,
    pageKey: "/",
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
