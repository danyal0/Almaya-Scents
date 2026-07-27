import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  almayaContent,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  hasScentNotes,
} from "@/content/almaya-content";

const publicDir = join(process.cwd(), "public");

function collectImagePaths(): string[] {
  const paths: string[] = [
    almayaContent.hero.image.src,
    almayaContent.fullBleed.image.src,
    almayaContent.brandStory.image.src,
    almayaContent.aboutPage.image.src,
    ...almayaContent.stories.map((story) => story.image.src),
    ...almayaContent.gallery.images.map((image) => image.src),
    ...almayaContent.products.flatMap((product) =>
      product.images.map((image) => image.src),
    ),
  ];
  return paths;
}

describe("content manifest integrity", () => {
  it("has unique product slugs", () => {
    const slugs = getAllProducts().map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("references only images that exist in /public", () => {
    for (const src of collectImagePaths()) {
      expect(existsSync(join(publicDir, src)), `missing asset: ${src}`).toBe(
        true,
      );
    }
  });

  it("provides alt text and dimensions for every image", () => {
    const images = [
      almayaContent.hero.image,
      almayaContent.fullBleed.image,
      ...almayaContent.gallery.images,
      ...almayaContent.products.flatMap((product) => product.images),
    ];
    for (const image of images) {
      expect(image.alt.length, `empty alt for ${image.src}`).toBeGreaterThan(0);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });

  it("every product has at least one image and a description", () => {
    for (const product of getAllProducts()) {
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
    }
  });

  it("does not fabricate commerce data on placeholder products", () => {
    for (const product of getAllProducts().filter((p) => p.placeholder)) {
      expect(product.notes).toBeUndefined();
      expect(product.category).toBeUndefined();
      expect(product.price).toBeUndefined();
      expect(product.officialUrl).toBeUndefined();
    }
  });
});

describe("content helpers", () => {
  it("returns featured products only", () => {
    expect(getFeaturedProducts().every((product) => product.featured)).toBe(
      true,
    );
  });

  it("finds products by slug", () => {
    const first = getAllProducts()[0];
    expect(getProductBySlug(first.slug)?.name).toBe(first.name);
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });

  it("excludes the current product from related products", () => {
    const first = getAllProducts()[0];
    const related = getRelatedProducts(first.slug);
    expect(related.some((product) => product.slug === first.slug)).toBe(false);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("detects the presence of scent notes", () => {
    const bare = { ...getAllProducts()[0], notes: undefined };
    expect(hasScentNotes(bare)).toBe(false);
    expect(hasScentNotes({ ...bare, notes: {} })).toBe(false);
    expect(hasScentNotes({ ...bare, notes: { top: [] } })).toBe(false);
    expect(hasScentNotes({ ...bare, notes: { top: ["bergamot"] } })).toBe(true);
  });
});
