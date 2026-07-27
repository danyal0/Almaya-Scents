# Content Management

All site content is edited in **three files** — components never contain
brand copy:

| File                            | Contains                                        |
| ------------------------------- | ----------------------------------------------- |
| `src/content/almaya-content.ts` | Products, imagery, hero, stories, page copy     |
| `src/content/site-config.ts`    | Site name/titles, Instagram URL, env wiring     |
| `src/content/navigation.ts`     | Header, footer and legal navigation             |

## Current content status

The collection currently features two verified Almaya Scents products drawn
from the official Instagram (@almayascents):

- **Crystal For Her** — floral-citrus composition with published top / heart / base notes
- **Essential For Him** — fresh citrus–woody composition (50ml)

Product photography is stored locally under `public/images/`. No Instagram
CDN URLs are hotlinked. Prices are not shown on the site; orders are
directed to Instagram inquiry.

## Adding or replacing a product

1. Add authorized images to `public/images/products/` (see
   `public/content/README.md` for names/dimensions).
2. In `almaya-content.ts`, update the product entry:

```ts
{
  slug: "verified-product-slug",       // becomes /products/<slug>/
  name: "Verified Product Name",
  category: "Eau de Parfum",           // ONLY if published by Almaya
  description: "1–3 sentence original copy.",
  story: "Optional longer narrative.",
  notes: {                              // ONLY if published by Almaya
    top: ["..."], heart: ["..."], base: ["..."],
  },
  images: [
    { src: "/images/products/slug-portrait.webp", alt: "…", width: 1600, height: 2200 },
    { src: "/images/products/slug-detail.webp",   alt: "…", width: 1600, height: 1600 },
  ],
  featured: true,                       // shows in the home Featured section
  officialUrl: "https://…",             // ONLY if a verified official store exists
  placeholder: false,
}
```

3. Run `npm run test` — the content tests verify slug uniqueness, that
   every referenced image exists, and that alt text is present.

Adding/removing products automatically updates the collection grid, the
static product routes, related products, and the sitemap.

## Editorial rules

- Rewrite Instagram captions into short original website copy; do not
  paste captions verbatim.
- Never invent: product names, notes, prices, ingredients, awards,
  certifications, reviews, addresses, phone numbers, emails, history.
- If a fact is not published by Almaya, omit the field — the design
  handles absence gracefully.

## Newsletter

The form posts to `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` at build time. With
no endpoint configured it renders disabled with an honest note (never a
fake success).

To connect a provider:

- **Formspree** — create a form, use `https://formspree.io/f/<id>`.
- **Buttondown** — `https://buttondown.com/api/emails/embed-subscribe/<username>`.
- **Mailchimp / ConvertKit (Kit)** — use the provider's hosted form POST
  URL from the embedded-form settings.

Set the value as a repository Actions **variable** named
`NEXT_PUBLIC_NEWSLETTER_ENDPOINT` (Settings → Secrets and variables →
Actions → Variables) or in `.env.local` for local builds. The form sends
`email` as form data and treats any 2xx as success.

## Contact email

Set `NEXT_PUBLIC_CONTACT_EMAIL` (repository variable or `.env.local`) to
surface an email card on the Contact page. Leave it empty to hide email
actions entirely — do not hardcode an unverified address.

## Announcement bar

`almayaContent.announcement` — keep it short; no discounts or promotions
unless verified by Almaya.
