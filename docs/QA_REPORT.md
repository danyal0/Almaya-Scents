# QA Report — Almaya Scents

Date: 2026-07-27 · Environment: Node 22.14, Next.js 16.2.12, Chromium via
Playwright · All commands below were executed against this revision.

## Summary

| Check                                   | Result                          |
| --------------------------------------- | ------------------------------- |
| `npm run lint` (ESLint)                  | ✅ 0 errors, 0 warnings          |
| `npm run typecheck` (tsc, strict)        | ✅ 0 errors                      |
| `npm run test` (Vitest)                  | ✅ 44/44 passed (11 files)       |
| `npm run test:e2e` (Playwright)          | ✅ 106 passed, 0 failed (18 project-specific skips) |
| `npm run build` (static export)          | ✅ 16 routes exported to `out/`  |
| Export under base path `/almaya-e2e`     | ✅ all links/assets resolve (E2E-verified) |
| Console errors (all pages, both projects)| ✅ none                          |
| Horizontal overflow                      | ✅ none at any tested width      |

## Unit tests (Vitest + React Testing Library)

44 tests across 11 files, covering:

- `getAssetPath` base-path behaviour (empty, `/repo`, trailing slash, `/`)
- Content manifest integrity: unique slugs, every referenced image exists
  on disk, alt text and dimensions present, **no fabricated commerce
  data** on placeholder products
- `ScentNotes`: renders only verified note groups; renders nothing (not
  "N/A") without notes
- `ProductDetails`: omits optional sections; Instagram inquiry fallback
  vs `officialUrl` "Shop Officially" with `noopener noreferrer`
- `ProductCard`: single clickable link, image alt text
- `Newsletter`: disabled-with-explanation when unconfigured; accessible
  validation errors (`role="alert"`, `aria-invalid`, `aria-describedby`);
  successful POST; friendly failure message with no technical detail
- `MobileMenu`: renders links, Escape closes, focus moves in and Tab
  cycling is trapped, body scroll lock and restore
- `Lightbox`: modal dialog semantics, Escape, arrow-key navigation with
  wrap-around, focus trap
- `Footer`: dynamic current year, secured external links
- `buildMetadata`: title composition, Open Graph/Twitter fields

## E2E tests (Playwright, desktop + mobile projects)

Run against the **statically exported** site served under the repository
base path `/almaya-e2e` (mirrors GitHub Pages project hosting):

- Home renders hero copy, CTAs, announcement
- Desktop navigation reaches every page; wordmark returns home
- Every internal link on every page resolves with HTTP 200 and carries
  the base-path prefix
- Mobile menu: open, navigate, Escape close, focus return, focus trap
- Skip link is the first focusable element and jumps to content
- Collection renders all 4 products; cards navigate
- All product routes generate; optional data omitted (no "N/A"/TODO, no
  prices anywhere); related products exclude the current product
- Desktop gallery thumbnail switching; mobile swipe track is a labelled,
  keyboard-focusable region
- Lightbox: open, counter, arrow keys with wrap, close controls, Escape,
  focus trap, focus restoration
- Newsletter honestly disabled without an endpoint
- No console errors, no failed requests, exactly one `h1`, every image
  decodes and is base-path-prefixed, all `img` elements have `alt`
- External links: `target="_blank"` always paired with
  `rel="noopener noreferrer"`
- Horizontal overflow ≤ 0px on **all 8 pages** at 320, 375, 390, 414,
  480, 640, 768, 820, 1024, 1280, 1440, 1728, 1920 px
- `sitemap.xml` and `robots.txt` exported and correct; unknown routes
  return the styled 404 page with status 404

## Accessibility

- **axe-core** (WCAG 2.0/2.1/2.2 A+AA tags) on all 8 pages, desktop and
  mobile, plus the open lightbox: **0 serious or critical violations.**
  Scans run under `prefers-reduced-motion`, which also verifies the
  reduced-motion rendering path.
- **Lighthouse Accessibility: 100** on all audited pages.
- Fixed during QA: `--muted` darkened `#77736C → #6B675F` (4.45:1 →
  5.4:1 on ivory); mobile gallery scroll region made keyboard-focusable;
  dialog focus made resilient to post-touch synthetic mouse events;
  closed mobile menu is `inert`.
- Keyboard: skip link, menu, lightbox, galleries and forms fully
  operable; visible `:focus-visible` outlines (ivory variant on dark).

## Lighthouse (mobile simulation, gzip-serving local host)

| Page                    | Perf | A11y | Best Practices | SEO |
| ----------------------- | ---- | ---- | -------------- | --- |
| `/`                     | 96   | 100  | 100            | 100 |
| `/products/`            | 95   | 100  | 100            | 100 |
| `/products/almaya-no-i/`| 95   | 100  | 100            | 100 |
| `/about/`               | 95   | 100  | 100            | 100 |

CLS = 0 and TBT ≤ 40ms on every audited page. Performance work during
QA: hero/page-title entrances converted to CSS-only animations (LCP no
longer waits for hydration: home LCP 7.1s → 2.8s), above-the-fold card
images eager-loaded, display font switched to its variable version
(2 files instead of 8).

## Responsive review

Full-page screenshots captured and inspected for all 8 pages at
375×812, 390×844, 768×1024, 1024×768, 1440×1000 and 1920×1080:
alignment, spacing rhythm, crops, text wrapping, header transition,
mobile navigation, footer and focus states — no visible defects
remaining. Reproduce with:

```bash
npm run build && npm run preview &
SHOT_PAGES='[{"path":"/","name":"home"}]' node scripts/qa-screenshots.mjs
```

## Known limitations

1. **Placeholder content.** Instagram requires authentication, so no
   Almaya product names, imagery, notes or claims could be verified.
   Products ship as clearly labeled placeholders (`Almaya No. I–IV`,
   `placeholder: true`) with original line-art SVGs. Replacement
   workflow: `docs/CONTENT_MANAGEMENT.md` + `public/content/README.md`.
2. **Newsletter** requires `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`; until
   configured the form is disabled with an honest note (by design).
3. **No structured data** (Product/Organization JSON-LD) is emitted —
   intentionally, because product and business facts are unverified.
4. **Search omitted** — 4 placeholder products do not justify it (per
   brief). Revisit if the verified catalogue grows.
5. Lighthouse scores were measured on a local gzip server with mobile
   throttling; real GitHub Pages results may vary slightly (CDN latency,
   Brotli).

## Content requiring user confirmation

- Authorized hero, product, editorial, gallery and brand photography
  (filenames/dimensions documented in `public/content/README.md`)
- Real product names, descriptions and — only if published — categories,
  scent notes and an official store URL
- Announcement bar message (currently the neutral
  "Discover the world of Almaya Scents.")
- Brand/About copy review to match Almaya's authentic public voice
- Optional: `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`,
  authorized logo files (current wordmark is an original typographic
  design created for this site)
