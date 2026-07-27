/**
 * =====================================================================
 * ALMAYA SCENTS — CONTENT MANIFEST
 * =====================================================================
 *
 * This file is the single source of truth for every product, image,
 * caption and description on the website. Edit content here — nothing
 * is hardcoded inside components.
 *
 * IMPORTANT — PLACEHOLDER STATUS
 * ---------------------------------------------------------------------
 * The Almaya Scents Instagram profile (https://www.instagram.com/almayascents)
 * could not be inspected automatically (it requires authentication), and
 * no other verified public source for the brand's products was found.
 *
 * Therefore:
 *
 *   - Every entry marked with `placeholder: true` is a STRUCTURAL
 *     PLACEHOLDER, not a real Almaya Scents product. Products are
 *     numbered ("No. I", "No. II", …) instead of carrying invented
 *     evocative names.
 *   - No scent notes, prices, sizes, concentrations, ingredients or
 *     availability claims are included anywhere, because none could be
 *     verified. Components omit those sections automatically when the
 *     fields are absent.
 *   - All imagery points to original placeholder artwork in
 *     /public/images/placeholders/. Replace with authorized Almaya
 *     photography — see /public/content/README.md for exact filenames,
 *     dimensions and formats.
 *
 * HOW TO REPLACE A PLACEHOLDER PRODUCT
 * ---------------------------------------------------------------------
 *   1. Drop authorized images into /public/images/products/ using the
 *      filenames documented in /public/content/README.md.
 *   2. Update the product entry below: name, slug, description, story,
 *      and (only if published by Almaya) category and notes.
 *   3. Set `placeholder: false` once the entry reflects verified content.
 *
 * =====================================================================
 */

export type ContentImage = {
  /** Path under /public, e.g. "/images/products/no-i-portrait.svg". */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ScentNoteGroups = {
  top?: string[];
  heart?: string[];
  base?: string[];
};

export type Product = {
  slug: string;
  name: string;
  /** Only set when the concentration/type is published by Almaya. */
  category?: string;
  description: string;
  story?: string;
  /** Only set when the notes are published by Almaya. */
  notes?: ScentNoteGroups;
  images: ContentImage[];
  featured?: boolean;
  /** Verified official purchase URL. Omit when no store is verified. */
  officialUrl?: string;
  /** True while the entry awaits verified Almaya content. */
  placeholder?: boolean;
};

export type EditorialStory = {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  image: ContentImage;
  productSlug?: string;
};

export type GalleryImage = ContentImage & {
  /** "portrait" | "landscape" | "square" — drives the mosaic layout. */
  ratio: "portrait" | "landscape" | "square";
};

export type BrandContent = {
  name: string;
  tagline: string;
  description: string;
  announcement: string;
  hero: {
    image: ContentImage;
    eyebrow: string;
    headline: string;
    subline: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  featured: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  stories: [EditorialStory, EditorialStory];
  fullBleed: {
    image: ContentImage;
    caption: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    images: GalleryImage[];
  };
  brandStory: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: ContentImage;
    cta: { label: string; href: string };
  };
  newsletter: {
    title: string;
    description: string;
    consent: string;
  };
  collectionPage: {
    title: string;
    intro: string;
  };
  aboutPage: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    image: ContentImage;
  };
  journalPage: {
    title: string;
    emptyState: {
      heading: string;
      body: string;
    };
  };
  contactPage: {
    title: string;
    intro: string;
  };
  products: Product[];
  social: {
    instagram: string;
  };
};

/* ===================================================================== */
/* Placeholder products — replace with verified Almaya Scents products.  */
/* ===================================================================== */

const products: Product[] = [
  {
    // PLACEHOLDER — replace with a real Almaya Scents product.
    slug: "almaya-no-i",
    name: "Almaya No. I",
    description:
      "The first composition of the collection. A study in restraint — made to be worn close, and remembered longer.",
    story:
      "Every Almaya fragrance begins as a single idea, refined until nothing unnecessary remains. No. I holds the place of that first idea: the scent that will open the collection once its story is told here.",
    images: [
      {
        src: "/images/placeholders/product-01-portrait.svg",
        alt: "Placeholder illustration of an Almaya Scents flacon on a warm paper background",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/placeholders/product-01-detail.svg",
        alt: "Placeholder detail illustration of a fragrance bottle stopper",
        width: 1600,
        height: 1600,
      },
    ],
    featured: true,
    placeholder: true,
  },
  {
    // PLACEHOLDER — replace with a real Almaya Scents product.
    slug: "almaya-no-ii",
    name: "Almaya No. II",
    description:
      "A quieter register of the same signature — softer in its opening, unhurried in the way it stays.",
    story:
      "No. II reserves space for the second chapter of the collection. Its verified description, imagery and composition will appear here once provided from Almaya's own materials.",
    images: [
      {
        src: "/images/placeholders/product-02-portrait.svg",
        alt: "Placeholder illustration of a rounded Almaya Scents flacon on an ivory background",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/placeholders/product-02-detail.svg",
        alt: "Placeholder detail illustration of concentric glasswork",
        width: 1600,
        height: 1600,
      },
    ],
    featured: true,
    placeholder: true,
  },
  {
    // PLACEHOLDER — replace with a real Almaya Scents product.
    slug: "almaya-no-iii",
    name: "Almaya No. III",
    description:
      "Structured and deliberate — a composition that favors clarity over noise.",
    story:
      "No. III stands in for the third fragrance of the collection, awaiting its authentic name, photography and story.",
    images: [
      {
        src: "/images/placeholders/product-03-portrait.svg",
        alt: "Placeholder illustration of a tall slim Almaya Scents flacon in warm grey tones",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/placeholders/product-03-detail.svg",
        alt: "Placeholder detail illustration of a faceted bottle shoulder",
        width: 1600,
        height: 1600,
      },
    ],
    featured: true,
    placeholder: true,
  },
  {
    // PLACEHOLDER — replace with a real Almaya Scents product.
    slug: "almaya-no-iv",
    name: "Almaya No. IV",
    description:
      "The collection's closing statement — presence without insistence.",
    story:
      "No. IV completes the placeholder collection. Replace this entry with a verified Almaya Scents fragrance when its public details are available.",
    images: [
      {
        src: "/images/placeholders/product-04-portrait.svg",
        alt: "Placeholder illustration of a broad-shouldered Almaya Scents flacon on a deep charcoal background",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/placeholders/product-04-detail.svg",
        alt: "Placeholder detail illustration of light falling across glass",
        width: 1600,
        height: 1600,
      },
    ],
    placeholder: true,
  },
];

/* ===================================================================== */
/* Brand content                                                         */
/* ===================================================================== */

export const almayaContent: BrandContent = {
  name: "Almaya Scents",
  tagline: "Fragrance, remembered.",
  description:
    "Almaya Scents is a fragrance house devoted to refined, memorable perfumery — compositions made with intention, presented without excess.",
  announcement: "Discover the world of Almaya Scents.",

  hero: {
    image: {
      src: "/images/placeholders/hero-01.svg",
      alt: "Placeholder artwork of an Almaya Scents flacon in soft morning light",
      width: 2400,
      height: 1600,
    },
    eyebrow: "Almaya Scents",
    headline: "Fragrance, remembered.",
    subline:
      "A collection of compositions made with intention — worn close, kept quietly, remembered longer.",
    primaryCta: { label: "Discover the Collection", href: "/products/" },
    secondaryCta: { label: "Explore Our Story", href: "/about/" },
  },

  featured: {
    eyebrow: "The Collection",
    title: "Featured Scents",
    intro:
      "Three compositions that carry the Almaya signature — presented as the collection takes its final shape.",
  },

  stories: [
    {
      eyebrow: "Chapter One",
      title: "Almaya No. I",
      body: "The opening of the collection. A composition built on restraint, where every element earns its place — nothing added for effect, nothing kept out of habit.",
      cta: { label: "Discover No. I", href: "/products/almaya-no-i/" },
      image: {
        src: "/images/placeholders/editorial-01.svg",
        alt: "Placeholder still-life illustration of two Almaya Scents flacons beside an architectural line",
        width: 2400,
        height: 1350,
      },
      productSlug: "almaya-no-i",
    },
    {
      eyebrow: "Chapter Two",
      title: "Almaya No. II",
      body: "A quieter register of the same signature. Where No. I states, No. II suggests — softer in its opening, unhurried in the way it stays with you.",
      cta: { label: "Discover No. II", href: "/products/almaya-no-ii/" },
      image: {
        src: "/images/placeholders/editorial-02.svg",
        alt: "Placeholder still-life illustration of a rounded flacon under a soft arc of light",
        width: 2400,
        height: 1350,
      },
      productSlug: "almaya-no-ii",
    },
  ],

  fullBleed: {
    image: {
      src: "/images/placeholders/editorial-moment.svg",
      alt: "Placeholder wide illustration of a fragrance bottle silhouette against a dusk horizon",
      width: 2400,
      height: 1350,
    },
    caption: "Made with intention. Worn with memory.",
  },

  gallery: {
    eyebrow: "Impressions",
    title: "The Almaya Frame",
    images: [
      {
        src: "/images/placeholders/gallery-01.svg",
        alt: "Placeholder portrait illustration of a flacon on a pedestal",
        width: 1600,
        height: 2200,
        ratio: "portrait",
      },
      {
        src: "/images/placeholders/gallery-02.svg",
        alt: "Placeholder square illustration of overlapping glass circles",
        width: 1600,
        height: 1600,
        ratio: "square",
      },
      {
        src: "/images/placeholders/gallery-03.svg",
        alt: "Placeholder landscape illustration of three bottle silhouettes in a row",
        width: 2400,
        height: 1350,
        ratio: "landscape",
      },
      {
        src: "/images/placeholders/gallery-04.svg",
        alt: "Placeholder square illustration of a stopper viewed from above",
        width: 1600,
        height: 1600,
        ratio: "square",
      },
      {
        src: "/images/placeholders/gallery-05.svg",
        alt: "Placeholder portrait illustration of light falling across a tall flacon",
        width: 1600,
        height: 2200,
        ratio: "portrait",
      },
    ],
  },

  brandStory: {
    eyebrow: "The House",
    title: "The World of Almaya",
    paragraphs: [
      "Almaya Scents is built on a simple conviction: that fragrance is the closest thing we wear to memory. A scent is never only a scent — it is a room, a season, a person, returned for a moment.",
      "The house works slowly and edits hard. Each composition is refined until nothing unnecessary remains, then presented plainly — without noise, without excess, without apology.",
    ],
    image: {
      src: "/images/placeholders/brand-01.svg",
      alt: "Placeholder portrait illustration of an Almaya Scents flacon in shadow",
      width: 1600,
      height: 2200,
    },
    cta: { label: "Explore Our Story", href: "/about/" },
  },

  newsletter: {
    title: "Stay Close to the Scent",
    description:
      "Receive news, new releases, and stories from Almaya Scents.",
    consent:
      "By subscribing you agree to receive occasional emails from Almaya Scents. You can unsubscribe at any time. See our Privacy page for details.",
  },

  collectionPage: {
    title: "The Collection",
    intro:
      "Every Almaya composition is made with intention and presented without excess. The collection is shown here as it takes its final shape.",
  },

  aboutPage: {
    title: "An expression beyond scent.",
    intro:
      "Almaya Scents is a fragrance house devoted to a single idea: that what we wear closest should be made with the most care.",
    sections: [
      {
        heading: "The conviction",
        body: "Fragrance is the closest thing we wear to memory. A composition is never only a composition — it is a room, a season, a person, returned for a moment. Almaya makes scents for those moments: precise enough to be recognized, quiet enough to be kept.",
      },
      {
        heading: "The practice",
        body: "The house works slowly and edits hard. Ideas are refined until nothing unnecessary remains; what survives is presented plainly, without noise or decoration. Restraint is not an aesthetic choice here — it is the discipline the work demands.",
      },
      {
        heading: "The invitation",
        body: "Almaya shares its world through its collection and its Instagram. Follow along as new compositions, stories and imagery are released — and reach out directly for inquiries.",
      },
    ],
    image: {
      src: "/images/placeholders/brand-02.svg",
      alt: "Placeholder landscape illustration of a fragrance atelier still life",
      width: 2400,
      height: 1350,
    },
  },

  journalPage: {
    title: "Journal",
    emptyState: {
      heading: "Stories from Almaya are coming soon.",
      body: "The journal will gather notes from the house — on compositions, materials, and the quiet work behind each release. Until then, follow Almaya Scents on Instagram for the latest.",
    },
  },

  contactPage: {
    title: "Contact",
    intro:
      "For inquiries, orders and everything else, the fastest way to reach Almaya Scents is through Instagram.",
  },

  products,

  social: {
    instagram: "https://www.instagram.com/almayascents",
  },
};

/* ===================================================================== */
/* Helpers                                                               */
/* ===================================================================== */

export function getAllProducts(): Product[] {
  return almayaContent.products;
}

export function getFeaturedProducts(): Product[] {
  return almayaContent.products.filter((product) => product.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return almayaContent.products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  return almayaContent.products
    .filter((product) => product.slug !== slug)
    .slice(0, count);
}

export function hasScentNotes(product: Product): boolean {
  const notes = product.notes;
  if (!notes) return false;
  return Boolean(
    (notes.top && notes.top.length > 0) ||
      (notes.heart && notes.heart.length > 0) ||
      (notes.base && notes.base.length > 0),
  );
}
