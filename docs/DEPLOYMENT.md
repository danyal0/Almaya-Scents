# Deployment

The site is a static export (`out/`) deployed by GitHub Actions to GitHub
Pages using the official actions (`actions/configure-pages`,
`actions/upload-pages-artifact`, `actions/deploy-pages`). No Vercel, no
Railway, no paid services.

## Standard GitHub Pages deployment

1. **Create a GitHub repository** (any name; the base path is derived
   automatically).
2. **Push the project** to the repository's `main` branch.
3. Open the repository **Settings**.
4. Open **Pages** (left sidebar).
5. Under *Build and deployment*, set **Source** to **GitHub Actions**.
6. **Push to `main`** (or trigger *Deploy to GitHub Pages* manually from
   the Actions tab — `workflow_dispatch` is enabled).
7. **Wait for the workflow** — it lints, type-checks, runs unit tests,
   builds the export, uploads it, and deploys.
8. **Open the deployed URL** shown on the workflow run summary (also
   under Settings → Pages), e.g. `https://<user>.github.io/<repo>/`.

### How the base path is handled

`actions/configure-pages` reports the correct base path for the
repository type, and the workflow feeds it into the build:

- Project repository `github.com/user/repo` →
  `NEXT_PUBLIC_BASE_PATH=/repo`, site at `https://user.github.io/repo/`
- User/organization repository `user.github.io` → empty base path,
  site at `https://user.github.io/`
- Custom domain configured in Pages settings → empty base path

Manual override: define a repository **Actions variable**
`NEXT_PUBLIC_BASE_PATH` (Settings → Secrets and variables → Actions →
Variables); the workflow prefers it over the derived value. The same
mechanism exists for `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_NEWSLETTER_ENDPOINT` and `NEXT_PUBLIC_CONTACT_EMAIL`.

## Custom domain

1. In **Settings → Pages → Custom domain**, enter your domain and save —
   GitHub provisions the certificate; keep *Enforce HTTPS* enabled.
2. At your DNS provider:
   - Apex domain (`example.com`): `A` records to GitHub Pages IPs
     (`185.199.108.153`, `.109.`, `.110.`, `.111.153`) — or `ALIAS`/`ANAME`
     to `<user>.github.io` if supported.
   - Subdomain (`www.example.com`): `CNAME` to `<user>.github.io`.
3. Once the custom domain is active, `actions/configure-pages` reports an
   empty base path automatically — assets and links work at the root with
   no configuration change.
4. Optionally set the `NEXT_PUBLIC_SITE_URL` variable to
   `https://example.com` so canonical URLs, Open Graph URLs and the
   sitemap use the final domain (the workflow otherwise uses the value
   reported by configure-pages).

## Building locally

```bash
# Root deployment (custom domain / user pages)
npm run build
npm run preview                       # http://localhost:4173/

# Project pages simulation
NEXT_PUBLIC_BASE_PATH=/repo-name npm run build
npm run preview -- --base /repo-name  # http://localhost:4173/repo-name/
```

`scripts/serve-static.mjs` mimics GitHub Pages behaviour, including
serving `404.html` for unknown routes.

## Workflow reference

`.github/workflows/deploy-pages.yml`:

- Triggers: push to `main`, manual `workflow_dispatch`
- Permissions: `contents: read`, `pages: write`, `id-token: write`
- Concurrency: group `pages`, in-progress production deploys are not
  cancelled
- Jobs: `build` (checkout → Node 22 + npm cache → configure-pages →
  `npm ci` → lint → typecheck → unit tests → `next build` → upload
  `out/`) and `deploy` (deploy-pages into the `github-pages` environment)

## Troubleshooting

| Symptom                                | Cause / fix                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| CSS/images 404 on `user.github.io/repo`| Build ran without the base path — deploy via the workflow, or set the `NEXT_PUBLIC_BASE_PATH` variable. |
| 404 on refresh of a deep link          | Should not happen (`trailingSlash: true` exports folder indexes); verify the artifact contains e.g. `products/index.html`. |
| Workflow fails at deploy step          | Settings → Pages → Source must be **GitHub Actions**.                            |
| Old content after deploy               | GitHub Pages CDN caching — hard-refresh; propagation may take a minute.          |
