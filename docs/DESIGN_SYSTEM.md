# Design System

The Almaya Scents design language is restrained European luxury:
architectural rather than decorative, photographic rather than ornamental,
calm rather than busy. Tokens live in `src/styles/tokens.css` and are
mapped to Tailwind utilities in `src/styles/globals.css` (`@theme inline`).

## Color

Neutral fallback palette (to be tuned against authorized Almaya imagery
when available — edit `tokens.css` only):

| Token         | Value                  | Usage                                  |
| ------------- | ---------------------- | -------------------------------------- |
| `--ink`       | `#111111`              | Primary text, dark surfaces            |
| `--charcoal`  | `#202020`              | Secondary dark, hover on ink           |
| `--paper`     | `#F5F2EC`              | Alternate section background           |
| `--ivory`     | `#FCFAF6`              | Page background                        |
| `--warm-gray` | `#D8D2C8`              | Inactive indicators, skeleton          |
| `--muted`     | `#6B675F`              | Secondary text (AA: 5.4:1 on ivory)    |
| `--line`      | `rgba(17,17,17,0.14)`  | Hairline borders                       |
| `--line-strong` | `rgba(17,17,17,0.32)`| Form underlines, emphasized rules      |
| `--white`     | `#FFFFFF`              | Highlights inside artwork              |

No gradients as decoration, no neon, no accent color until one can be
derived from authentic Almaya imagery.

## Typography

- **Display / headings:** Cormorant Garamond (300–600, italic available)
  via `next/font` → `--font-display` → `font-serif`
- **Interface / body:** Inter (variable) via `next/font` → `--font-text`
  → `font-sans`

Scale (fluid, from the brief):

| Utility            | Size                          | Use                       |
| ------------------ | ----------------------------- | ------------------------- |
| `text-display-xl`  | `clamp(3.5rem, 8vw, 8rem)`    | Hero headline             |
| `text-display-l`   | `clamp(2.75rem, 6vw, 6rem)`   | Page titles               |
| `text-display-m`   | `clamp(2rem, 4vw, 4rem)`      | Section headings          |
| `text-heading`     | `clamp(1.5rem, 2.5vw, 2.5rem)`| Card titles, sub-headings |
| `text-body`        | 17px / 1.65                   | Paragraphs                |
| `text-body-sm`     | 15px / 1.6                    | Secondary copy            |
| `text-meta`        | 12px / 0.18em tracking        | Labels, nav, buttons      |

Conventions: uppercase is reserved for meta text (`.eyebrow`, nav,
buttons); display type is set in light weights with tight leading
(`1.04–1.15`) and slight negative tracking; paragraph width is capped
(`max-w-xl` and similar) for measure.

## Spacing

Tailwind's 4px-based scale maps directly to the brief
(4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160 →
`p-1 … p-40`). Section rhythm uses the `.section-gap` primitive:
`padding-block: clamp(4rem, 9vw, 8.5rem)` — luxury sections are never
compressed. Horizontal structure comes from `.container-editorial`
(max 1440px, fluid `clamp(1.25rem, 4vw, 3.5rem)` gutters).

## Borders, radius, elevation

- Hairline 1px borders only (`--line`), used as section/article rules.
- Radius: essentially none (0–4px in artwork only). Editorial, not bubbly.
- Shadows: none in the UI. A single `--shadow-soft` token exists for rare
  large-surface use; the lightbox and menu rely on scrims instead.

## Motion

| Token                 | Value       | Use                            |
| --------------------- | ----------- | ------------------------------ |
| `--duration-fast`     | 150ms       | Hover opacity                  |
| `--duration-standard` | 250ms       | Underlines, color transitions  |
| `--duration-slow`     | 450ms       | Image zoom, drawer             |
| `--duration-reveal`   | 750ms       | Editorial reveals              |
| `--ease-out-expo`     | `cubic-bezier(0.16,1,0.3,1)` | All reveals   |

Patterns: opacity + ≤24px vertical translate on scroll reveal (`Reveal`),
image scale 1.03 → 1 on hover (`.media-frame`), scaleX underline
(`.link-underline`), 2.2s hero settle. **No** bouncing, spinning, spring
overshoot, animated gradients, scroll-jacking or parallax.

`prefers-reduced-motion: reduce` disables the hero settle and all
transitions globally (see `globals.css`), and `Reveal` renders static
content immediately.

## Primitives (globals.css)

- `.container-editorial` — page gutter + max width
- `.section-gap` — vertical section rhythm
- `.eyebrow` — uppercase meta label
- `.link-underline` — animated underline (also triggered by `.group`)
- `.media-frame` — image container with hover zoom
- `.hero-settle` — initial hero scale-in
- `.skeleton` — loading shimmer
- `.on-dark` — switches focus outlines to ivory on dark surfaces
