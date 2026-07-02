# Snagd Web

Snagd is a mobile-first reseller command center for local flips worth chasing.

## What is included

- Snagd Light and Snagd Black theme toggle saved in localStorage.
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

## iOS packaging

The repository includes a Capacitor iOS project under `ios/` and uses the static Next.js export in `out/`.

```bash
npm run build
npm run mobile:sync
npm run assets:ios
```

Windows can prepare and sync the native project. The final signed archive and App Store upload require Xcode on macOS, either on a local Mac or a hosted macOS build machine. See `APP_STORE_RELEASE.md` for metadata, privacy answers, and the submission checklist.

## Phone testing and Cloudflare

The web build is also the fastest phone test harness. Cloudflare Pages supplies HTTPS for camera access and runs the VIN proxy in `functions/api/vin/[vin].ts`.

```bash
npm run build
npm run pages:dev
```

See `TESTING.md` for the GitHub/Cloudflare preview setup and the VIN scanner test checklist. See `FREE_API_OPTIONS.md` for connected and candidate data sources.
