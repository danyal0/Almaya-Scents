/**
 * Site-level configuration.
 *
 * Values marked "env" are read from environment variables at build time so
 * the static site can be configured per deployment without code changes.
 */
export const siteConfig = {
  name: "Almaya Scents",
  title: "Almaya Scents | The Art of Fragrance",
  description:
    "Crafting timeless scents for every essence. Discover the art of Almaya Scents. Delivering all over Pakistan.",

  /**
   * Canonical site URL, e.g. "https://username.github.io/repository-name".
   * Used for Open Graph URLs, the sitemap and robots.txt. Leave empty to
   * skip absolute-URL metadata.
   */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, ""),

  /**
   * The only verified public channel for Almaya Scents.
   */
  instagramUrl: "https://www.instagram.com/almayascents",
  instagramHandle: "@almayascents",

  /** Public WhatsApp order line published by Almaya Scents. */
  whatsappUrl: "https://wa.me/923070320103",
  whatsappDisplay: "+923070320103",
  adminEmail: "almayascents@mrcasm.com",

  /**
   * Optional public contact email. Email actions are hidden when empty —
   * do not hardcode an address here unless it is verified.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /**
   * Optional newsletter form endpoint (Formspree, Buttondown, etc.).
   * When empty the newsletter form is shown in a disabled, clearly
   * communicated state. See docs/CONTENT_MANAGEMENT.md.
   */
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "",
} as const;
