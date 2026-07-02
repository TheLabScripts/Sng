# Snagd Crawler Foundation

## Flow

1. A user creates an active saved search in D1.
2. The deal feed requests `GET /api/listings?refresh=due`, or an admin scheduler calls `POST /api/crawler/run-due`.
3. The crawler selects active sources assigned to the search and creates one `crawler_runs` row per source.
4. The source adapter fetches and normalizes raw records.
5. Price, category, keyword, negative-keyword, and distance filters are applied.
6. Listings are deduplicated, scored, and stored as user-scoped matches.
7. Qualified matches create one in-app alert per match.

Core services live under `functions/_lib/crawler`. The catch-all Cloudflare Pages API is `functions/api/[[path]].ts`.

## Source adapters

- `mock`: deterministic development inventory across vehicles, tools, electronics, furniture, appliances, motorcycles, and parts.
- `html_snapshot`: parses a saved HTML fixture without contacting a live site.
- `generic_public`: fetches a configured public URL template with rate limiting, timeout, result cap, and source-specific selectors.
- `provider_json`: normalizes configured JSON provider payloads.
- `facebook_placeholder`: accepts only a user-provided HTML snapshot or provider JSON. It intentionally contains no login automation, CAPTCHA bypass, proxy rotation, account automation, or ban evasion.

Public URL templates support `{{zipCode}}`, `{{radiusMiles}}`, `{{keywords}}`, `{{minPrice}}`, `{{maxPrice}}`, and `{{category}}`.

Example `config_json`:

```json
{
  "rateLimitMs": 2500,
  "selectors": {
    "item": ".listing-card",
    "title": ".listing-title",
    "price": ".listing-price",
    "url": ".listing-link",
    "image": ".listing-image",
    "location": ".listing-location",
    "description": ".listing-description",
    "externalIdAttribute": "data-id"
  }
}
```

Only activate a source after confirming that automated access is permitted and the selectors are tested against a saved snapshot.

## API

- `GET|POST /api/saved-searches`
- `PATCH|DELETE /api/saved-searches/:id`
- `POST /api/saved-searches/:id/run`
- `GET /api/listings?refresh=due`
- `GET|PATCH /api/listings/:id`
- `POST /api/listings/analyze`
- `GET /api/alerts`
- `PATCH /api/alerts/:id`
- `PATCH /api/alerts/mute`
- `POST /api/crawler/run-due` (admin)
- `POST /api/crawler/mock`
- `GET /api/crawler/runs` and `/api/crawler/runs/:id` (admin)
- `POST /api/referrals/claim`

All user records are scoped by the authenticated user ID. Production accepts HS256 bearer tokens signed with `AUTH_JWT_SECRET`. Header-based development auth is available only when `ALLOW_DEV_AUTH=true`.

## Cloudflare D1

Create the database, copy its ID into the `[[d1_databases]]` block in `wrangler.toml`, then apply the migration and optional seed:

```powershell
npx.cmd wrangler d1 create snagd-production
npx.cmd wrangler d1 migrations apply snagd-production --remote
npx.cmd wrangler d1 execute snagd-production --remote --file database/seed.sql
```

Do not load demo seed rows in a customer production database. Instead, insert reviewed `marketplace_sources` rows through an admin process.

## Scheduling

The foundation deliberately keeps scheduling behind `runAllDueSavedSearches()`. The feed triggers due scans for its current user, while `POST /api/crawler/run-due` supports an external scheduler. Before launch, connect that admin endpoint to a protected Cloudflare scheduled Worker or queue consumer; Pages Functions do not provide a cron trigger by themselves.

## Production gates

- Set `ALLOW_DEV_AUTH=false`.
- Set a long random `AUTH_JWT_SECRET` as a Cloudflare secret.
- Disable the mock source after a compliant live/provider source is active.
- Keep source credentials in Cloudflare secrets, never `config_json` or client code.
- Review rate limits, robots directives, source terms, retention, and attribution for every source.
- Monitor failed `crawler_runs` and disable selectors that repeatedly fail.
