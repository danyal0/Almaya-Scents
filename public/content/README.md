# Almaya Scents — Content Asset Guide

Product photography for **Crystal For Her** and **Essential For Him** lives
under `/public/images/products/` (and related hero / editorial / brand
crops). Images are stored locally — Instagram CDN URLs are never hotlinked.

To add or replace products, follow the steps below.

## How replacement works

1. Copy your authorized images into the folders below, using the suggested
   filenames.
2. Open `src/content/almaya-content.ts` and update each `src`, `alt`,
   `width` and `height` to match your files (every image on the site is
   referenced from that single file).
3. Rebuild the site (`npm run build`). Nothing else needs to change.

## Required assets

### Hero — `/public/images/hero/`

| Filename            | Size (px)   | Ratio | Notes                                    |
| ------------------- | ----------- | ----- | ---------------------------------------- |
| `hero-01.jpg`       | 2400 × 1600 | 3:2   | Strongest campaign/product image. Keep the subject right-of-center; headline text sits bottom-left. |

### Products — `/public/images/products/`

Two images per product (portrait + detail). Suggested names:

| Filename                  | Size (px)   | Ratio | Notes                     |
| ------------------------- | ----------- | ----- | ------------------------- |
| `<slug>-portrait.jpg`     | 1600 × 2200 | 8:11  | Primary bottle photograph |
| `<slug>-detail.jpg`       | 1600 × 1600 | 1:1   | Detail / texture crop     |

Current product slugs: `crystal-for-her`, `essential-for-him`.

### Editorial — `/public/images/editorial/`

| Filename               | Size (px)   | Ratio | Used by                        |
| ---------------------- | ----------- | ----- | ------------------------------ |
| `editorial-01.jpg`     | 2400 × 1350 | 16:9  | Home — product story one       |
| `editorial-02.jpg`     | 2400 × 1350 | 16:9  | Home — product story two       |
| `editorial-moment.jpg` | 2400 × 1350 | 16:9  | Home — full-bleed image moment |
| `gallery-01.jpg`       | 1600 × 2200 | 8:11  | Home — image story grid        |
| `gallery-02.jpg`       | 1600 × 1600 | 1:1   | Home — image story grid        |
| `gallery-03.jpg`       | 2400 × 1350 | 16:9  | Home — image story grid        |
| `gallery-04.jpg`       | 1600 × 1600 | 1:1   | Home — image story grid        |
| `gallery-05.jpg`       | 1600 × 2200 | 8:11  | Home — image story grid        |

### Brand — `/public/images/brand/`

| Filename       | Size (px)   | Ratio | Used by                     |
| -------------- | ----------- | ----- | --------------------------- |
| `brand-01.jpg` | 1600 × 2200 | 8:11  | Home — brand story          |
| `brand-02.jpg` | 2400 × 1350 | 16:9  | About page                  |
| `og-image.png` | 1200 × 630  | ~1.9:1| Social sharing (Open Graph) |

### Logo — `/public/images/logo/`

| Filename           | Size (px)   | Ratio | Notes                                      |
| ------------------ | ----------- | ----- | ------------------------------------------ |
| `almaya-logo.jpg`  | 1080 × 1080 | 1:1   | Authorized brand mark used in the Wordmark |

The header, footer, and mobile menu render this file via
`src/components/layout/Wordmark.tsx`. Replace the file in place (same
filename and square crop) to update the logo site-wide.

## Format and size guidance

- Prefer **WebP** (or **AVIF**) for photographs; JPEG is fine as a fallback.
  Keep the extension consistent with the `src` values in
  `almaya-content.ts`.
- Target file sizes: hero ≤ 350 KB, editorial ≤ 300 KB, product ≤ 250 KB,
  square details ≤ 200 KB.
- Export at 2× the largest display size (values in the tables above) and
  compress at quality ~75–82.
- Keep original/source files outside `public/` (e.g. an `assets-src/`
  folder that is not deployed) so you can re-export later.

## Alt text guidance

Every image entry in `almaya-content.ts` has an `alt` field:

- Describe what is visible: “Amber glass flacon of <name> standing on
  travertine in warm side light”, not “perfume”.
- Do not stuff keywords; one natural sentence is ideal.
- For purely decorative images an empty string is acceptable, but product
  and editorial photography should always be described.

## Copy guidance

Captions from Instagram should be **rewritten into short original website
copy** (1–3 sentences) rather than pasted verbatim. Only add scent notes,
concentrations, categories or prices if Almaya has published them — the
site omits those sections automatically when the fields are absent.
