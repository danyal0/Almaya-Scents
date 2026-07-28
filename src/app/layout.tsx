import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { EditModeRuntime } from "@/components/editor/EditModeRuntime";
import { siteConfig } from "@/content/site-config";
import { buildMetadata } from "@/lib/seo";

import "@/styles/globals.css";

// Variable font: one file per style instead of one per weight.
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const textFont = Inter({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  ...(siteConfig.siteUrl
    ? { metadataBase: new URL(siteConfig.siteUrl) }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${textFont.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only z-[100] bg-ink px-6 py-3 font-sans text-meta uppercase tracking-[0.18em] text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main-content">
          {children}
          <div id="cms-page-sections" />
        </main>
        <Footer />
        <EditModeRuntime />
      </body>
    </html>
  );
}
