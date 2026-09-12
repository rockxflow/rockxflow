# Rockxflow — website

**Automate • Innovate • Elevate** — _Turn Repetitive Work Into Intelligent Systems._

A production Next.js 15 (App Router) site for an AI automation agency: nine service
capabilities, an outcome-led solutions page, a scroll-driven workflow narrative, and a
contact form that only reports success when a message was actually delivered.

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000

npm run build:pages          # → docs/  = a plain static website (no Node needed to host it)
npm run preview:site         # serve docs/ exactly like the host would
node tools/check-site.mjs http://127.0.0.1:4173/rockxflow docs   # browser acceptance test
```

---

## Stack

| Concern  | Choice                                                                 |
| -------- | ---------------------------------------------------------------------- |
| Framework | Next.js 15 App Router, React 19, TypeScript (strict)                 |
| Styling  | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) + a small `rx-*` utility layer |
| Motion   | `motion` (Framer Motion successor) + CSS keyframes; every effect honours `prefers-reduced-motion` |
| Fonts    | Self-hosted variable woff2 — Plus Jakarta Sans (display), Inter (text), JetBrains Mono (labels). No third-party requests at runtime. |
| Images   | Generated AVIF/WebP/JPEG derivative sets + `srcset` helper (`src/lib/media.ts`) |
| Validation | `src/lib/validation.ts` — shared verbatim by the form and the API route |

No UI kit, no CSS-in-JS, no analytics SDK, no CMS, no database.

## Routes

| Path             | What it is                                                            |
| ---------------- | --------------------------------------------------------------------- |
| `/`              | Home — hero loop, problem, system, pillars, services, signature workflow, outcomes, industries, process, why, CTA |
| `/services`      | Nine capabilities, each with problem → example → benefit → CTA, sticky index |
| `/solutions`     | Eight outcome-led plays, each wired back to the services that deliver it |
| `/process`       | The eight-step engagement timeline (Discover → Optimise)               |
| `/about`         | Position, principles, limits, tools, engagement models                 |
| `/contact`       | Form + direct channels; `?type=strategy-call` and `?service=<slug>` pre-fill it |
| `/api/contact`   | Delivery endpoint (see contract below). `GET` returns channel health.  |
| `/privacy-policy`, `/terms` | Legal pages built from `LegalPage`                      |
| `_not-found`     | 404 — an intentionally "unrouted" node in the workflow graphic         |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `icon.png` | Generated from route files (`src/app/{sitemap,robots,manifest}.ts`) |

JSON-LD: `Organization` + `WebSite` sitewide, `Service` `ItemList` on `/services`,
`BreadcrumbList` on interior pages, `FAQPage` where the FAQ copy exists. Built in
`src/lib/seo.ts` via `buildMetadata()`, so every page carries canonical, OG and Twitter tags.

## Content model

**Every headline, service, FAQ and CTA lives in `src/lib/site.ts`.** Pages map over those
arrays; nothing is hardcoded per-route except page-level framing. Edit the arrays and the
home preview, `/services`, `/solutions`, `/about`, the sitemap, the JSON-LD and the footer
anchors all move together.

- `services[]` — `slug` is the anchor (`/services#ai-agents`); never re-derive it from the title.
- `pillars`, `solutions`, `industries`, `processSteps`, `principles`, `automationCategories`,
  `signatureWorkflow`, `heroFlow`, `faqs`, `budgetBands`, `projectTypes`, `integrationTools`.

## Making the form deliver

By default the deployment has no delivery channel, and the site says so honestly:

```
POST /api/contact → 200 { ok: false, code: "not_configured",
                           message: "The form's delivery channel is not configured…",
                           fallback: { email, whatsapp, subject } }
```

The UI then shows a "not sent yet" panel with WhatsApp / mailto / copy-to-clipboard
actions. Set one variable to make it live:

- `CONTACT_WEBHOOK_URL` → any Make / Zapier / n8n / Slack / own-service sink, **or**
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL` → transactional email.

Request guards, in order: honeypot `_company` filled → silent `200 {ok:true,dropped:true}`;
`_mountedAt` < 3 s → `429 too_fast`; > 6 submissions per IP per 10 min → `429`;
invalid fields → `422 { ok:false, code:"invalid", errors:{ field: message } }`;
upstream failure → `502` (form surfaces retry, never a fake success). Nothing is written to
disk or a database; no PII is retained beyond whatever the receiving channel keeps.

## Analytics

`src/lib/analytics.ts` is a shim, not an SDK. `track()` pushes to `window.dataLayer`,
emits a `rockxflow:event` CustomEvent, and beacons to `NEXT_PUBLIC_ANALYTICS_ENDPOINT`
when set. No IDs are invented: drop your GTM/plausible snippet into `src/app/layout.tsx`
and every `data-track` element on the site starts reporting.

## Media & brand pipeline

`public/media` and `public/fonts` are **generated, not committed-by-hand**. Rerun after
changing art, brand copy or favicons:

```bash
node tools/fetch-fonts.mjs          # writes src/styles/fonts.css (6 variable woff2 subsets)
node tools/build-images.mjs         # assets-raw/ → public/media/*.{avif,webp,jpg} + srcset manifests
python3 tools/render-hero-video.py  # 12s seamless hero loop (needs imageio-ffmpeg)
node tools/build-brand-assets.mjs   # OG 1200×630 → og.png/og.webp + favicon/apple/maskable PNGs
```

`build-brand-assets.mjs` renders an SVG through librsvg, so text needs real font files:
convert the woff2 in `public/fonts` to TTF once (`fontTools`) into `~/.fonts` and run `fc-cache -f`.
The OG headline, logo mark and colours are generated from the same tokens as the site — the
SVG source lives inside that tool.

**Logo:** the mark and the social glyphs are reconstructions of the described identity. The R is
painted with a tone-aware gradient from the shared `<BrandDefs />` sprite in the root layout —
silver on dark surfaces, graphite on `#F7F9FC`, so it never fades into a light navbar.
When the real file arrives, drop it at `public/brand/rockxflow-logo.svg` and set
`USE_CLIENT_ASSET = true` in `src/components/ui/Logo.tsx` — the wordmark and all favicons then
follow it (rerun `build-brand-assets.mjs` for the PNGs).

## QA

```bash
node tools/check-classes.mjs    # malformed Tailwind arbitrary values (run after every edit batch)
npx tsc --noEmit -p tsconfig.json
npm run build
node tools/qa.mjs               # crawls every route: links, anchors, assets, sitemap, robots,
                                #   one <h1>, OG/canonical, placeholder text
node tools/check-site.mjs http://127.0.0.1:4173/rockxflow docs
                                # browser test of the static export: styles, media, links,
                                # mobile menu, tabs, form validation + honest fallback
node tools/visual-qa.mjs        # needs `npm i -D playwright && npx playwright install chromium`
                                #   8 routes × 5 viewports (1920→320): document overflow,
                                #   unclipped pokes, console errors, reduced-motion, focus ring,
                                #   screenshots into /home/user/qa
```

Last full run: `npm run build` compiles all 13 routes and prerenders 15/15 static pages;
`qa.mjs` clean over 702 internal references on 10 pages; `visual-qa.mjs` clean at 320 → 1920
(no document overflow, no console errors), reduced motion leaves zero running animations, and
the focus ring is visible after two tabs.

## Deliberate choices

- **Nothing is faked.** No client logos, no testimonial quotes, no revenue figures, no
  certifications, no GSTIN or registration numbers. Every metric-looking chart is labelled
  illustrative, and the legal copy states only what the operator can decide.
- **Alternating light/dark sections carry meaning**: dark is reserved for systems, process,
  workflow and the closing CTA — roughly 60–70 % light neutral, 20–30 % dark, 5–10 % accent.
- **Motion is compositional, not decorative.** Scroll reveals, a scroll-driven workflow rail,
  animated before/after, hover states. No per-frame canvas grain (it tripled the hero's bitrate).
- **Layout contract**: 8 px rhythm, `--container` 84 rem with 20/32/40 px gutters, no horizontal
  overflow from 320 → 1920 (`main .grid > * { min-width: 0 }` guards it), no CLS (aspect-ratio
  boxes on every image and the hero video, poster-first).

## Deploy

Two artefacts, one codebase: a Node app (`npm run build && npm start`, with the form API) or a
plain static website (`npm run build:pages` → `docs/`, no runtime). 14 of the pages prerender even
in app mode; `/api/contact` is the only server route.

```bash
npm run build && npm start          # app mode
```

Canonical, `og:url`, `og:image` and `sitemap.xml` are built from `NEXT_PUBLIC_SITE_URL`; when it is
unset `src/lib/seo.ts` uses the placeholder origin `https://rockxflow.com`. Set the real one before
publishing (it is baked in at build time, not read at request time).

## Publish as a plain website

`npm run build:pages` compiles the same pages, components and content into **`docs/`**: static
HTML plus the compiled JS/CSS, no server code at all. Same design, same interactions (mobile menu,
service index, workflow rail, automation selector, before/after compare, form validation) —
because the React runtime ships with the export; only the API disappears.

```bash
node tools/build-site.mjs --out docs --base /rockxflow   # GitHub project page: user.github.io/rockxflow/
node tools/build-site.mjs --out docs                      # custom domain or any host root
```

`docs/` then contains `index.html`, `services/index.html`, …, `404.html`, `robots.txt`,
`sitemap.xml`, `manifest.webmanifest`, `.nojekyll`, and `rockxflow-site.zip` sits next to it for
drag-and-drop uploads (Netlify). Every page is a directory with its own `index.html`, so clean URLs
work without rewrite rules.

### GitHub Pages, two ways

* **Recommended — Actions:** push the repo, then Settings → Pages → Source: **GitHub Actions**.
  `.github/workflows/pages.yml` builds the export, reads the origin and base path from
  `actions/configure-pages` (so it is correct for both `/<repo>/` and a custom domain) and deploys.
  Set `NEXT_PUBLIC_FORM_ENDPOINT` as a repository secret if you want the form to deliver from the
  static host.
* **Zero config — branch:** commit `docs/`, then Settings → Pages → Source: **Deploy from a branch**
  → `main` / `/docs`. Build the export with `--base /<your-repo-name>` so asset URLs carry the
  project path; a wrong or missing base is the only way this variant breaks.

Any other host (Netlify, Vercel static, Cloudflare Pages, S3, nginx, cPanel) is the same folder:
upload `docs/`, and use no base path when it is served from the domain root. Do **not** open these
files as `file://` paths — the runtime resolves lazily loaded chunks against the base path, so the
page needs an origin (`npm run preview:site` gives you one locally).

### What changes in the static build

| | `npm run build && npm start` | `npm run build:pages` |
| --- | --- | --- |
| Pages, design, motion | yes | identical |
| Form delivery | `POST /api/contact` → webhook / Resend | no API: the form composes a pre-filled email (and offers WhatsApp + copy). Set `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree, Getform, an n8n webhook) to post instead |
| `tools/build-site.mjs` | — | stashes `src/app/api` during the export (a POST handler cannot be part of a static export) and restores it afterwards |
| Asset URLs | root-absolute | prefixed with `--base` (including literals inside the JS chunks and the CSS `url()` list) |

Neither build ever claims a message was sent when it was not: `POST /api/contact` without
`CONTACT_WEBHOOK_URL` or `RESEND_API_KEY` returns `not_configured`, and the UI shows the direct
channels instead of a thank-you screen.

For a container image, add `output: "standalone"` to `next.config.mjs` and copy `.next/standalone`,
`.next/static` and `public`.
