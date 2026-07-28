# Almaya Scents

A premium, editorial fragrance-brand website for **Almaya Scents** — fully
static, accessible, and deployable to GitHub Pages.

The design language is restrained luxury: an ivory/paper palette, an
editorial serif for display type, generous whitespace, hairline borders,
and quiet motion. All brand content lives in a single typed content
manifest so it can be updated without touching components.

> **Content status:** the collection currently features **Crystal For Her**
> and **Essential For Him**, with photography and scent notes drawn from
> the official Almaya Scents Instagram
> ([@almayascents](https://www.instagram.com/almayascents)). See
> [docs/CONTENT_MANAGEMENT.md](docs/CONTENT_MANAGEMENT.md) for how to add
> or replace products.

## Technology stack

- [Next.js](https://nextjs.org/) (App Router, static export via `output: "export"`)
- TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/styles/tokens.css`)
- Framer Motion (scroll reveals only, with `prefers-reduced-motion` support)
- Vitest + React Testing Library (unit tests)
- Playwright + axe-core (E2E and accessibility tests)
- GitHub Actions → GitHub Pages (no server, no database, no paid services)

## Getting started

```bash
npm install
npm run dev          # development server at http://localhost:3000
```

## Commands

| Command             | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Development server                                             |
| `npm run lint`      | ESLint                                                         |
| `npm run typecheck` | TypeScript (`tsc --noEmit`)                                    |
| `npm run test`      | Unit tests (Vitest)                                            |
| `npm run test:watch`| Unit tests in watch mode                                       |
| `npm run test:e2e`  | Builds with a test base path, serves `out/`, runs Playwright   |
| `npm run build`     | Production build + static export to `out/`                     |
| `npm run preview`   | Serves `out/` locally (`--base /repo-name` to simulate Pages)  |

First-time Playwright setup: `npx playwright install --with-deps chromium`.

## Environment variables

All variables are optional and read at **build time**:

| Variable                          | Purpose                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH`           | Base path when hosted under a subpath (e.g. `/repo-name`). Empty for a domain root.         |
| `NEXT_PUBLIC_SITE_URL`            | Canonical URL (e.g. `https://user.github.io/repo-name`) for Open Graph, sitemap and robots. |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Form endpoint (Formspree, Buttondown, …). When empty, the newsletter form is disabled with an honest note. |
| `NEXT_PUBLIC_CONTACT_EMAIL`       | Public contact email. When empty, email actions are hidden.                                 |

The GitHub Actions workflow sets the first two automatically via
`actions/configure-pages` — no manual configuration is needed for a
standard GitHub Pages deployment.

## Content management

Everything editable lives in three files:

- `src/content/almaya-content.ts` — products, hero, stories, gallery,
  brand copy, page copy (single source of truth, strongly typed)
- `src/content/site-config.ts` — site name, titles, social links, env wiring
- `src/content/navigation.ts` — header/footer/legal navigation

### Visual back office (GitHub Pages compatible)

This project includes a static **Back Office** at `/admin/`:

- client-side login (stored in browser localStorage)
- inline visual edit mode (`?edit=1`) for text and images
- local override storage in browser
- optional publish to GitHub using a personal access token

Runtime overrides are read from:

- `public/content-overrides.json`

When you publish from `/admin/`, the editor updates that file in your repository.
After GitHub Pages rebuilds, the new content is visible for all viewers.

Image replacement is documented in
[public/content/README.md](public/content/README.md) (filenames,
dimensions, formats, file-size and alt-text guidance).

## Deployment to GitHub Pages

1. Create a GitHub repository and push this project to `main`.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` (or run the *Deploy to GitHub Pages* workflow manually
   from the Actions tab).
5. Wait for the workflow to finish; the deployment URL appears on the
   workflow run and under Settings → Pages.

The workflow lints, type-checks, tests, builds and deploys. The base path
is derived automatically: project repositories are served under
`/<repo-name>/`, `user.github.io` repositories and custom domains at the
root. Full details, custom-domain setup and troubleshooting:
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Architecture, design system, QA

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — folder structure, rendering
  model, base-path strategy
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — tokens, type scale,
  spacing, motion rules
- [docs/CONTENT_MANAGEMENT.md](docs/CONTENT_MANAGEMENT.md) — editing and
  verifying content
- [docs/QA_REPORT.md](docs/QA_REPORT.md) — test results, responsive and
  accessibility audits, known limitations

## Accessibility

Built to WCAG 2.2 AA: semantic landmarks, one `h1` per page, skip link,
keyboard-accessible menu/lightbox/galleries with focus trapping and Escape
handling, `prefers-reduced-motion` support, AA-verified color contrast,
and axe-verified pages (no serious or critical violations).

## Performance

Static HTML with pre-sized local SVG artwork, self-hosted fonts via
`next/font`, client JavaScript only where interaction requires it (menu,
lightbox, gallery, newsletter form, reveals). Lighthouse targets:
Performance 95+, Accessibility 100, Best Practices 100, SEO 100.

## Troubleshooting

- **Assets 404 under GitHub Pages** — the build must receive
  `NEXT_PUBLIC_BASE_PATH=/<repo-name>`. The workflow does this
  automatically; locally use `NEXT_PUBLIC_BASE_PATH=/repo-name npm run
  build && npm run preview -- --base /repo-name`.
- **Newsletter does nothing** — expected until
  `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is configured; see
  docs/CONTENT_MANAGEMENT.md.
- **`next start` fails** — this project uses static export; use
  `npm run preview` instead.
