# Snagd Integration Notes

These are planning placeholders only. Production integrations should be server-side with no API keys shipped to the client.

- AI scoring abstraction: approved server-side AI model providers through `aiScoringService`.
- VIN decode: NHTSA vPIC through `vinService`.
- Recalls: NHTSA recalls data through `vinService`.
- Vehicle comps: MarketCheck-style paid vehicle market data through `compsService`.
- Vehicle history: NMVTIS-approved history provider placeholder through `vinService`.
- Item comps: eBay Browse/comps provider placeholder through `compsService`.
- Distance: Maps route/distance provider through `distanceService`.
- Notifications: Resend for email, Twilio for SMS, Discord webhooks, Firebase push notifications later.
- Billing: Stripe billing and usage metering for Deal Checks, watchlists, and add-ons.

Snagd should use safe source-layer placeholders unless a future integration is compliant with each marketplace or data provider.
