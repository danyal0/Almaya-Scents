/**
 * =====================================================================
 * ALMAYA SCENTS — CONTENT MANIFEST
 * =====================================================================
 *
 * This file is the single source of truth for every product, image,
 * caption and description on the website. Edit content here — nothing
 * is hardcoded inside components.
 *
 * Product photography and copy are drawn from the official Almaya Scents
 * Instagram (@almayascents). Imagery lives under /public/images/.
 *
 * =====================================================================
 */

export type ContentImage = {
  /** Path under /public, e.g. "/images/products/crystal-for-her-portrait.jpg". */
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
/* Products                                                              */
/* ===================================================================== */

const products: Product[] = [
  {
    slug: "crystal-for-her",
    name: "Crystal For Her",
    category: "For Her",
    description:
      "A favorite for a reason — fresh energy balanced with sophisticated floral depth, made to stay from morning to night.",
    story:
      "Crystal For Her opens with a bright spark of yuzu and pomegranate, blooms into peony, lotus and magnolia, and settles into a smooth musk finish. Luxury here is not only the bottle — it is how she feels when she wears it.",
    notes: {
      top: ["Yuzu", "Pomegranate"],
      heart: ["Peony", "Lotus", "Magnolia"],
      base: ["Musk"],
    },
    images: [
      {
        src: "/images/products/crystal-for-her-portrait.jpg",
        alt: "Crystal For Her perfume bottle by Almaya Scents surrounded by peony, lotus, magnolia, yuzu and pomegranate",
        width: 1440,
        height: 1440,
      },
      {
        src: "/images/products/crystal-for-her-detail.jpg",
        alt: "Detail of the Crystal For Her bottle and Almaya Scents label",
        width: 1000,
        height: 1000,
      },
    ],
    featured: true,
    placeholder: false,
  },
  {
    slug: "essential-for-him",
    name: "Essential For Him",
    category: "For Him · 50ml",
    description:
      "A breath of fresh air for everyday elegance — vibrant citrus lifted by a deep woody finish, made to stay sharp from morning to night.",
    story:
      "Essential For Him is reimagined for the modern man who wants presence without effort. Whether the day calls for a meeting or an easy evening out, it is a signature that feels fresh, clean and considered.",
    notes: {
      top: ["Citrus"],
      base: ["Wood"],
    },
    images: [
      {
        src: "/images/products/essential-for-him-portrait.jpg",
        alt: "Essential For Him 50ml perfume bottle by Almaya Scents on marble in soft daylight",
        width: 1440,
        height: 1440,
      },
      {
        src: "/images/products/essential-for-him-detail.jpg",
        alt: "Lifestyle still for Essential For Him — fresh light, linen and quiet morning atmosphere",
        width: 1440,
        height: 1440,
      },
    ],
    featured: true,
    placeholder: false,
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
  announcement: "Discover Crystal For Her and Essential For Him.",

  hero: {
    image: {
      src: "/images/hero/hero-01.jpg",
      alt: "Crystal For Her by Almaya Scents — elegant bottle with floral and citrus notes",
      width: 2400,
      height: 1600,
    },
    eyebrow: "Almaya Scents",
    headline: "Fragrance, remembered.",
    subline:
      "Two signatures from the house — Crystal For Her and Essential For Him — worn close, kept quietly, remembered longer.",
    primaryCta: { label: "Discover the Collection", href: "/products/" },
    secondaryCta: { label: "Explore Our Story", href: "/about/" },
  },

  featured: {
    eyebrow: "The Collection",
    title: "Featured Scents",
    intro:
      "Crystal For Her and Essential For Him — two compositions that carry the Almaya signature.",
  },

  stories: [
    {
      eyebrow: "For Her",
      title: "Crystal For Her",
      body: "Fresh energy meets floral depth. Yuzu and pomegranate open the composition; peony, lotus and magnolia bloom at the heart; musk closes the day with a smooth, lasting finish.",
      cta: { label: "Discover Crystal For Her", href: "/products/crystal-for-her/" },
      image: {
        src: "/images/editorial/editorial-01.jpg",
        alt: "Crystal For Her perfume still life with peony, lotus, magnolia and citrus",
        width: 2400,
        height: 1350,
      },
      productSlug: "crystal-for-her",
    },
    {
      eyebrow: "For Him",
      title: "Essential For Him",
      body: "Everyday elegance in a crisp register — vibrant citrus with a deep woody close. A signature for mornings that turn into nights, without losing their edge.",
      cta: { label: "Discover Essential For Him", href: "/products/essential-for-him/" },
      image: {
        src: "/images/editorial/editorial-02.jpg",
        alt: "Essential For Him bottle by Almaya Scents in bright natural light",
        width: 2400,
        height: 1350,
      },
      productSlug: "essential-for-him",
    },
  ],

  fullBleed: {
    image: {
      src: "/images/editorial/editorial-moment.jpg",
      alt: "Fresh morning atmosphere for Essential For Him by Almaya Scents",
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
        src: "/images/editorial/gallery-01.jpg",
        alt: "Crystal For Her bottle framed in soft beige light",
        width: 1600,
        height: 2200,
        ratio: "portrait",
      },
      {
        src: "/images/editorial/gallery-02.jpg",
        alt: "Close view of the Crystal For Her bottle and label",
        width: 1000,
        height: 1000,
        ratio: "square",
      },
      {
        src: "/images/editorial/gallery-03.jpg",
        alt: "Essential For Him bottle on marble with soft shadows",
        width: 2400,
        height: 1350,
        ratio: "landscape",
      },
      {
        src: "/images/editorial/gallery-04.jpg",
        alt: "Quiet morning still life for Essential For Him",
        width: 1600,
        height: 1600,
        ratio: "square",
      },
      {
        src: "/images/editorial/gallery-05.jpg",
        alt: "Essential For Him perfume bottle in tall editorial crop",
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
      src: "/images/brand/brand-01.jpg",
      alt: "Essential For Him by Almaya Scents — portrait still of the bottle",
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
      "Crystal For Her and Essential For Him — two Almaya compositions made with intention and presented without excess.",
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
      src: "/images/brand/brand-02.jpg",
      alt: "Crystal For Her by Almaya Scents in a wide editorial still",
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
