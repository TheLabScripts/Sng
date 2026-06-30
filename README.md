# Snagd Web

Snagd is a mobile-first reseller command center for local flips worth chasing.

## What is included

- Tokyo Night and Tokyo Day theme toggle saved in localStorage.
- Public Home, Pricing, Creators, Login, and Signup pages.
- Mock auth and onboarding with localStorage session state.
- App dashboard, deal feed, analyzer, watchlists, alerts, Vehicle Mode, billing, and account pages.
- Deterministic mock deal scoring engine.
- Mock data for deals, alerts, watchlists, usage, pricing, creators, vehicle results, and onboarding.
- Service abstractions for scoring, VIN, comps, distance, notifications, and future billing integrations.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

The app is configured for static export through `next.config.mjs`, so `npm run build` writes the deployable `out` folder for Cloudflare Pages.

## Integration notes

Do not put API keys in the client. Real provider adapters should run server-side and connect through the service boundaries in `src/lib/services`.