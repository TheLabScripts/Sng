# Snagd Web

Snagd is a mobile-first reseller command center for local flips worth chasing.

## What is included

- Snagd Light and Snagd Black theme toggle saved in localStorage.
- Public Home, Pricing, Creators, Login, and Signup pages.
- Mobile-first auth and onboarding shell with creator referral capture.
- App dashboard, crawler-backed deal feed, saved searches, analyzer, alerts, Vehicle Mode, billing, and account pages.
- Cloudflare D1 crawler foundation with source adapters, deduplication, scoring, run history, matches, and alerts.
- Mock marketplace and HTML snapshots for repeatable development, plus configurable public-page and provider adapters.
- A Facebook Marketplace placeholder limited to saved snapshots and compliant provider payloads.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
```

The app is configured for static export through `next.config.mjs`, so `npm run build` writes the deployable `out` folder for Cloudflare Pages.

## Crawler development

Create `.dev.vars` from `.dev.vars.example`, then initialize the local D1 database:

```powershell
npm.cmd run db:migrate:local
npm.cmd run db:seed:local
npm.cmd run build
npm.cmd run pages:dev
```

The seed user is `dev-user`. For the seeded API data, set `snagd-api-user-id` to `dev-user` in browser local storage or create saved searches from the UI under the generated local user. The deal feed requests due scans automatically and polls for fresh matches every 60 seconds.

See `CRAWLER_ARCHITECTURE.md` for adapters, endpoints, D1 production setup, scheduling, and source configuration. See `CRAWLER_POLICY.md` for the source-compliance rules.

## Integration notes

Do not put API keys in the client. Production must set `ALLOW_DEV_AUTH=false` and provide signed HS256 bearer tokens through `AUTH_JWT_SECRET`. Real provider credentials belong in Cloudflare secrets and provider adapters must run server-side.

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
