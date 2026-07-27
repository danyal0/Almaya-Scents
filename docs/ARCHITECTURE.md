# Architecture

## Overview

Almaya Scents is a fully static Next.js App Router site exported with
`output: "export"`. There is no server runtime: every route is
pre-rendered to HTML at build time into `out/`, which is what GitHub
Pages serves.

```
src/
  app/                     # Routes (App Router)
    layout.tsx             # Fonts, metadata, skip link, shell
    page.tsx               # Home
    products/page.tsx      # Collection
    products/[slug]/       # Product detail (generateStaticParams)
    about/ journal/ contact/ privacy/ terms/
    not-found.tsx          # Styled 404 (exported as 404.html)
    sitemap.ts robots.ts   # Build-time SEO files
    icon.svg               # Favicon (Almaya monogram)

  components/
    layout/                # AnnouncementBar, Header, MobileMenu, Footer, Wordmark
    home/                  # Hero, FeaturedCollection, EditorialProductSection,
                           # FullBleedImage, ImageStoryGrid, BrandStory, Newsletter
    products/              # ProductCard, ProductGrid, ProductGallery,
                           # ProductDetails, ScentNotes
    ui/                    # Button, IconButton, AnimatedLink, SectionHeading,
                           # Reveal, ImageWithFallback, LoadingSkeleton,
                           # Lightbox, icons

  content/                 # THE single source of truth for all content
    almaya-content.ts      # Products, imagery, page copy (typed manifest)
    site-config.ts         # Site metadata + environment wiring
    navigation.ts          # Navigation definitions

  lib/
    assets.ts              # getAssetPath() — base-path-aware asset URLs
    seo.ts                 # buildMetadata() / absoluteUrl()
    utils.ts               # cn(), email validation, focus-trap helpers

  styles/
    tokens.css             # Design tokens (colors, type, motion, layout)
    globals.css            # Tailwind theme mapping + editorial primitives

  test/setup.ts            # Vitest environment stubs

e2e/                       # Playwright specs (run against the export)
scripts/
  serve-static.mjs         # Static server emulating GitHub Pages base path
  qa-screenshots.mjs       # Visual QA screenshot utility
.github/workflows/
  deploy-pages.yml         # Lint → typecheck → test → build → deploy
```

## Rendering model

Server components by default; client components (`"use client"`) only
where interaction demands it:

| Component            | Why client                                            |
| -------------------- | ------------------------------------------------------ |
| `Header`/`MobileMenu`| Scroll state, dialog state, focus trap                 |
| `Lightbox`           | Keyboard/touch navigation, focus trap                  |
| `ImageStoryGrid`     | Owns the lightbox open state                           |
| `ProductGallery`     | Thumbnail selection, snap-scroll pagination            |
| `Newsletter`         | Form state, validation, submission                     |
| `Reveal`             | Viewport-triggered motion (framer-motion)              |
| `ImageWithFallback`  | Error fallback for missing assets                      |

Everything else — all pages, the footer, product details, headings — is
static server-rendered markup.

## Base-path strategy (GitHub Pages)

The site must work both at a domain root and under
`https://user.github.io/<repo>/`:

1. `next.config.ts` reads `NEXT_PUBLIC_BASE_PATH` and sets Next's
   `basePath`. `next/link` navigation and Next-emitted assets are prefixed
   automatically.
2. Handwritten asset references (`<img src>`, Open Graph images) go
   through `getAssetPath()` in `src/lib/assets.ts`, which prepends the
   same value (inlined at build time).
3. `trailingSlash: true` makes every route a folder with `index.html`,
   which is how GitHub Pages resolves deep links on refresh.
4. The deploy workflow feeds `NEXT_PUBLIC_BASE_PATH` from
   `actions/configure-pages`, which knows whether the repository is a
   project page or a user page/custom domain.
5. The E2E suite builds with `NEXT_PUBLIC_BASE_PATH=/almaya-e2e` and
   serves the export under that prefix (`scripts/serve-static.mjs`),
   asserting that every internal link and image resolves beneath it.

## Content flow

Components never contain product or brand copy. They receive data from
`src/content/almaya-content.ts` (directly or via props), so an editor can
rename a product, swap imagery, or add verified scent notes in one file.
Optional fields (`category`, `notes`, `story`, `officialUrl`) are simply
omitted from the UI when absent — there are no "N/A" states.

## No fake commerce

There is no cart, checkout, or pricing anywhere. Since no official Almaya
store could be verified, product CTAs resolve to "Inquire on Instagram"
(secure external link). If a store URL is later verified, setting
`officialUrl` on a product switches its CTA to "Shop Officially".
