import type { Metadata } from "next";

import { AdminPanel } from "@/components/editor/AdminPanel";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Back Office",
  description: "Client-side back office for inline text and image editing.",
  path: "/admin/",
});

export default function AdminPage() {
  return <AdminPanel />;
}
