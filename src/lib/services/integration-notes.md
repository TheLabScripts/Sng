# Snagd Integration Notes

These are planning placeholders only. Production integrations should be server-side with no API keys shipped to the client.

- AI scoring abstraction: approved server-side AI model providers through `aiScoringService`.
- Source layer: source input -> normalized listing -> AI score -> alert decision -> user notification.
- Item comps: compliant browse/comps provider placeholder through `compsService` and `ebayCompsProvider`.
- Sold history: approved sold-history provider placeholder through `soldHistoryProvider`.
- Visual search/image recognition: provider boundary through `imageRecognitionService` and `visualSearchService`.
- Marketplace listings: compliant source/provider boundary through `marketplaceListingProvider`.
- VIN decode: NHTSA vPIC-style VIN decoding through `vinService`.
- Vehicle scanning: native future should use camera scanning, barcode scanning, OCR, and audio feedback through `vehicleScanService`.
- Vehicle images: stock/fallback image selection through `vehicleImageService`.
- Auction photos/history: paid provider placeholder through `vehicleAuctionPhotoService`.
- Vehicle recalls: recall data through `vehicleRecallService`.
- Vehicle comps: paid market/comps provider through `vehicleCompsService` and `vehicleMarketDataService`.
- Vehicle history and risk: approved history/risk providers through `vehicleHistoryService` and `vehicleRiskService`.
- Distance: route/distance provider through `distanceService`.
- Notifications: email, SMS, webhook, and push providers through `notificationService`.
- Billing: usage metering and subscriptions for Deal Checks, watchlists, alerts, comps, and VIN packs.

Do not hard-code API keys, implement unsafe scraping, fake platform logins, or claim live marketplace access when data is mocked.
