import { describe, expect, it } from "vitest";

import { buildMetadata } from "@/lib/seo";

describe("buildMetadata", () => {
  it("uses the site title for the home page", () => {
    const metadata = buildMetadata({ path: "/" });
    expect(metadata.title).toBe("Almaya Scents | The Art of Fragrance");
  });

  it("composes page titles with the brand suffix", () => {
    const metadata = buildMetadata({ title: "The Collection", path: "/products/" });
    expect(metadata.title).toBe("The Collection | Almaya Scents");
  });

  it("includes Open Graph and Twitter metadata", () => {
    const metadata = buildMetadata({
      title: "About",
      description: "About the house.",
      path: "/about/",
    });
    expect(metadata.openGraph?.siteName).toBe("Almaya Scents");
    expect(metadata.openGraph?.description).toBe("About the house.");
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
