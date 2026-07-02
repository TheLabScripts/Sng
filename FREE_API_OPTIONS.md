# Free and Low-Cost Data Options

## Connected now

### NHTSA vPIC

- Use: VIN decoding, year, make, model, trim, body, engine, fuel, drive type, transmission, and manufacturing location.
- Cost: Public API, no key.
- Status: Connected through `functions/api/vin/[vin].ts`.
- Important: NHTSA rate-controls traffic, so Snagd caches responses at the Cloudflare edge.

### NHTSA Recalls

- Use: Safety recall campaigns matched by year, make, and model.
- Cost: Public API, no key.
- Status: Connected to the same VIN endpoint.
- Important: A model-level campaign match does not prove whether a specific VIN has an unrepaired recall. Link to the official recall lookup before presenting a campaign as open for that exact vehicle.

## Good next additions

### FuelEconomy.gov

- Use: EPA MPG, annual fuel cost, drivetrain, engine, fuel type, emissions, and owner-reported MPG.
- Cost: Public government web service, no key.
- Fit: Strong addition to the vehicle report after NHTSA decode.
- Limitation: Matching a decoded vehicle to an exact EPA configuration may require a user choice when several trims or transmissions exist.

### Open Food Facts

- Use: Barcode lookup for packaged food, nutrition, brand, product images, and categories.
- Cost: Free/open data with published rate limits and attribution/license requirements.
- Fit: Useful only if Snagd expands field scanning into grocery or liquidation inventory.

### eBay Browse API

- Use: Active listing prices, product details, images, and item search.
- Cost: Developer account and OAuth credentials required; normal API access is not a paid per-request service.
- Fit: Useful as one active-market signal for item analysis.
- Limitation: Active listings are not sold comps. Do not label them as completed sales or guaranteed resale value.

### OpenStreetMap / Nominatim

- Use: User-triggered location lookup and reverse geocoding.
- Cost: Public endpoint for light use.
- Fit: Early testing only, behind a cached Cloudflare proxy.
- Limitation: The public service has a strict 1-request-per-second maximum, requires attribution and identifying headers, forbids client-side autocomplete, and warns commercial apps to plan another provider or self-host.

## Not realistically free for production

- Vehicle market value and local sold comps.
- Title brands, accidents, theft, flood, auction photos, and odometer history.
- Broad marketplace firehose access and instant local-listing alerts.
- Reliable general-purpose image recognition with commercial volume.

Keep these fields visibly marked as unavailable until a licensed provider is connected. Plausible-looking mock values are more damaging than a clean unavailable state.
