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
  /** Published size, e.g. "50ml". */
  size?: string;
  /** Published price label, e.g. "Rs 1,799". */
  price?: string;
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
    size: "50ml",
    price: "Rs 1,799",
    description:
      "Defining elegance with every spray. Crystal For Her balances fresh energy with sophisticated floral depth — luminous florals and citrus made to stay from morning to night.",
    story:
      "A tribute to timeless Bright Crystal energy, Crystal For Her opens with a bright spark of yuzu and pomegranate, blooms into peony, lotus and magnolia, and settles into a smooth musk finish. Luxury here is not only the bottle — it is how she feels when she wears it.",
    notes: {
      top: ["Yuzu", "Pomegranate"],
      heart: ["Peony", "Lotus", "Magnolia"],
      base: ["Musk"],
    },
    images: [
      {
        src: "/images/products/crystal-for-her-1.jpg",
        alt: "Rows of Crystal For Her bottles in soft pink light on warm wood",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/products/crystal-for-her-2.jpg",
        alt: "Hand holding Crystal For Her beside rose-gold vanity details",
        width: 1600,
        height: 1600,
      },
    ],
    featured: true,
    placeholder: false,
  },
  {
    slug: "essential-for-him",
    name: "Essential For Him",
    category: "For Him",
    size: "50ml",
    price: "Rs 1,899",
    description:
      "The ultimate breath of fresh air — crisp citrus lifted by a smooth woody finish. Essential For Him is light, energetic and made to last through the day.",
    story:
      "Inspired by the iconic freshness of Essential, this is reimagined for the modern man who values everyday elegance. Whether it is a high-stakes meeting or a casual evening out, stay sharp with bergamot and tomato leaf, rose pepper at the heart, and sandalwood with patchouli beneath.",
    notes: {
      top: ["Bergamot Cassia", "Tomato Leaf"],
      heart: ["Rose Pepper"],
      base: ["Sandalwood", "Patchouli"],
    },
    images: [
      {
        src: "/images/products/essential-for-him-1.jpg",
        alt: "Essential For Him bottle on linen with fresh leaves and bright daylight",
        width: 1600,
        height: 2200,
      },
      {
        src: "/images/products/essential-for-him-2.jpg",
        alt: "Hands holding Essential For Him against a warm leather and wood setting",
        width: 1600,
        height: 1600,
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
  announcement: "Crystal For Her · Essential For Him — free delivery nationwide.",

  hero: {
    image: {
      src: "/images/placeholders/hero-01.svg",
      alt: "Minimal Almaya Scents fragrance flacon in soft morning light",
      width: 2400,
      height: 1600,
    },
    eyebrow: "Almaya Scents",
    headline: "Fragrance, remembered.",
    subline:
      "Pick your signature scent — Crystal For Her and Essential For Him. Premium oils, long-lasting wear, free delivery across Pakistan.",
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
      body: "Luminous florals and citrus for a touch of timeless glamour. Yuzu and pomegranate open the composition; peony, lotus and magnolia bloom at the heart; musk closes the day with a smooth, lasting finish.",
      cta: { label: "Discover Crystal For Her", href: "/products/crystal-for-her/" },
      image: {
        src: "/images/editorial/editorial-01-v2.jpg",
        alt: "Crystal For Her held in soft champagne satin light",
        width: 2400,
        height: 1350,
      },
      productSlug: "crystal-for-her",
    },
    {
      eyebrow: "For Him",
      title: "Essential For Him",
      body: "Fresh, airy and effortlessly cool for the daily hustle — bergamot and tomato leaf opening into rose pepper, with sandalwood and patchouli beneath. Your perfect everyday companion in a premium 50ml bottle.",
      cta: { label: "Discover Essential For Him", href: "/products/essential-for-him/" },
      image: {
        src: "/images/editorial/editorial-02-v2.jpg",
        alt: "Essential For Him held against deep embroidered black formalwear",
        width: 2400,
        height: 1350,
      },
      productSlug: "essential-for-him",
    },
  ],

  fullBleed: {
    image: {
      src: "/images/editorial/editorial-moment-v2.jpg",
      alt: "Rows of Almaya Scents Crystal For Her bottles on warm wood",
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
        src: "/images/editorial/gallery-01-v2.jpg",
        alt: "Crystal For Her in a rose-gold vanity still life",
        width: 1600,
        height: 2200,
        ratio: "portrait",
      },
      {
        src: "/images/editorial/gallery-02-v2.jpg",
        alt: "Crystal For Her bottle resting in clear rippled water",
        width: 1600,
        height: 1600,
        ratio: "square",
      },
      {
        src: "/images/editorial/gallery-03-v2.jpg",
        alt: "Rows of Essential For Him bottles in soft focus",
        width: 2400,
        height: 1350,
        ratio: "landscape",
      },
      {
        src: "/images/editorial/gallery-04-v2.jpg",
        alt: "Essential For Him held against a cream cable-knit sweater",
        width: 1600,
        height: 1600,
        ratio: "square",
      },
      {
        src: "/images/editorial/gallery-05-v2.jpg",
        alt: "Crystal For Her held in a dark car interior with warm amber light",
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
      src: "/images/brand/brand-01-v2.jpg",
      alt: "Close portrait of Crystal For Her bottles in soft pink light",
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
        heading: "Why choose Almaya",
        body: "Highly concentrated oils for a rich, lasting projection. Carefully sourced ingredients. Wear that stays with you eight to twelve hours. A seven-day money-back guarantee, premium packaging, safety-tested formulas and cruelty-free craft — luxury in every drop.",
      },
      {
        heading: "The practice",
        body: "The house works slowly and edits hard. Ideas are refined until nothing unnecessary remains; what survives is presented plainly, without noise or decoration. Restraint is not an aesthetic choice here — it is the discipline the work demands.",
      },
      {
        heading: "The invitation",
        body: "Order through Instagram or WhatsApp for free nationwide delivery in Pakistan. Follow Almaya Scents for new releases, and reach out directly for inquiries.",
      },
    ],
    image: {
      src: "/images/brand/brand-02-v2.jpg",
      alt: "Crystal For Her with golden pour and soft pink florals",
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
      "For orders and inquiries, message Almaya Scents on Instagram or WhatsApp. Free delivery is available nationwide across Pakistan.",
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
