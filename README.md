# Snagd — Marketing Website

The public marketing + download site for **Snagd**, the AI deal scout for local resellers.
Built mobile-first, dark by default, and statically exported for **Cloudflare Pages**.

> **Brand note:** "Snagd" is the technical brand used everywhere in code, routes, and config.
> "Get Snag'd" is a marketing phrase only — it never appears in identifiers.

> **The product is the app.** This website's only jobs are to explain Snagd, build trust,
> and send people to the App Store / Google Play. There is no web app or login here.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with a CSS-variable design system (`src/app/globals.css`)
- **Static export** (`output: "export"`) → drops a fully static site in `/out`
- Fonts loaded at runtime via `<link>` (Archivo / Inter / JetBrains Mono) — no build-time fetch
- Zero runtime dependencies beyond React; minimal footprint

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production build (static export)

```bash
npm run build      # outputs static site to ./out
```

The `out/` folder is the deployable artifact — plain HTML/CSS/JS, no server needed.

---

## Deploy to Cloudflare Pages

### Option A — Git integration (recommended)
1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect repo.
3. Build settings:
   - **Framework preset:** Next.js (Static HTML Export) — or "None"
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node version:** 18 or 20 (set `NODE_VERSION=20` env var if needed)
4. Add environment variables (see below) → **Save and Deploy**.

### Option B — Direct upload (Wrangler)
```bash
npm run build
npx wrangler pages deploy out --project-name=snagd-web
```

---

## Environment variables

Copy `.env.example` → `.env.local` for local dev, and set the same keys in
Cloudflare Pages → **Settings → Environment variables**. All are public by design
(static marketing site). Until the app is published, store URLs can stay blank —
the download buttons safely fall back to a "coming soon" / waitlist state.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_STORE_URL` | Apple App Store link for the Snagd app |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play link for the Snagd app |
| `NEXT_PUBLIC_WAITLIST_URL` | Pre-launch fallback for download buttons (optional) |
| `NEXT_PUBLIC_CREATOR_SIGNUP_URL` | Creator/partner program signup (Phase 4) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support email shown in footer + support page |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics ID (optional, add later) |

---

## Project structure

```
snagd-web/
├── next.config.mjs           # static export config
├── tailwind.config.ts        # design tokens → Tailwind
├── .env.example              # env var plan
└── src/
    ├── app/
    │   ├── layout.tsx        # shell, fonts, SEO metadata
    │   ├── globals.css       # design tokens (colors, fonts, utilities)
    │   ├── page.tsx          # Home
    │   ├── pricing/page.tsx  # Pricing + competitor comparison + download CTA
    │   ├── creators/page.tsx # Creator / partner program
    │   ├── support/page.tsx  # FAQ + contact
    │   └── legal/            # privacy + terms (placeholder copy — review before launch)
    ├── components/           # reusable UI kit (see below)
    └── content/
        ├── site.ts           # brand strings + external links
        ├── pricing.ts        # plans, add-ons, trial, competitor data
        └── faqs.ts           # FAQ content
```

### Reusable components
`Nav` · `Footer` · `Container` · `Section` · `Eyebrow` · `CTAButton` · `StoreButtons`
· `SnagdScoreCard` (signature) · `PricingCard` · `PricingToggle` · `FAQList`
· `MarketplaceStrip` · `HowItWorks` · `FeatureRow` · `EverythingMode` · `Testimonial`
· `LegalBody` · `icons`

---

## What's real vs. placeholder (this site)

**Real now:** every page, responsive dark UI, pricing with monthly/annual toggle,
competitor comparison, FAQ accordion, SEO metadata, static export. Fully deployable.

**Placeholder until later:** app store URLs (blank → "coming soon"), creator signup link,
analytics, legal copy (structure is real, wording needs legal review). Testimonials and
sample deal cards are clearly labeled as illustrative.

---

## Compliance guardrails baked in

- No claims of scraping or logging into Facebook Marketplace, Craigslist, etc.
- Wording is deliberate: "score listings you analyze", "compliant source integrations",
  "saved deal watches" — never "we scan Facebook Marketplace".
- The app is positioned around the safe pipeline: source input → normalized listing →
  AI score → alert decision → notification.
