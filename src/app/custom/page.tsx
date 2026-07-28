import type { Metadata } from "next";

import { CustomPageView } from "@/components/editor/CustomPageView";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Custom page",
  description: "Custom CMS page content.",
  path: "/custom/",
});

export default function CustomPage() {
  return <CustomPageView />;
}
