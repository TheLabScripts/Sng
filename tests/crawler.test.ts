import assert from "node:assert/strict";
import test from "node:test";
import { listingMatchesSearch } from "../functions/_lib/crawler/filters.ts";
import { buildListingDedupKey, listingContentHash } from "../functions/_lib/crawler/hash.ts";
import { mockMarketplaceAdapter } from "../functions/_lib/crawler/adapters/mockMarketplaceAdapter.ts";
import { calculateDealScore, calculateEstimatedProfit, estimateCosts, estimateResaleValue, scoreListingForSearch } from "../functions/_lib/crawler/scoring.ts";
import type { CrawlerEnv, MarketplaceSource, NormalizedListing, SavedSearch } from "../functions/_lib/crawler/types.ts";

const timestamp = "2026-07-02T12:00:00.000Z";
const search: SavedSearch = { id: "search-test", userId: "user-test", name: "Tool flips", zipCode: "08102", radiusMiles: 25, category: "Tools", keywords: "Milwaukee, bundle", negativeKeywords: "broken, parts only", minPrice: 50, maxPrice: 300, minEstimatedProfit: 75, minDealScore: 65, isActive: true, scanIntervalMinutes: 30, lastScannedAt: null, createdAt: timestamp, updatedAt: timestamp };
const listing: NormalizedListing = { sourceId: "source-test", source: "Fixture", externalId: "listing-1", sourceUrl: "https://example.com/listing-1", title: "Milwaukee M18 drill bundle", description: "Working with two batteries", price: 120, currency: "USD", locationText: "Camden, NJ", zipCode: "08102", latitude: null, longitude: null, distanceMiles: 5, category: "Tools", imageUrls: ["https://example.com/image.jpg"], sellerName: null, postedAt: timestamp, scrapedAt: timestamp, rawJson: { estimatedResalePrice: 310 }, isActive: true };

test("dedupe prefers source and external ID", async () => {
  const contentHash = await listingContentHash(listing);
  assert.equal(buildListingDedupKey({ source: listing.source, externalId: listing.externalId, sourceUrl: listing.sourceUrl, contentHash }), "Fixture:external:listing-1");
  assert.equal(buildListingDedupKey({ source: listing.source, externalId: null, sourceUrl: listing.sourceUrl, contentHash }), `Fixture:fallback:${listing.sourceUrl}:${contentHash}`);
});

test("profit calculation uses asking and costs", () => {
  const resale = estimateResaleValue(listing);
  const costs = estimateCosts(listing, search);
  assert.equal(resale, 310);
  assert.equal(calculateEstimatedProfit(resale, 120, costs), 175.8);
});

test("negative keywords and price bounds filter listings", () => {
  assert.equal(listingMatchesSearch(listing, search), true);
  assert.equal(listingMatchesSearch({ ...listing, description: "Broken and sold for parts only" }, search), false);
  assert.equal(listingMatchesSearch({ ...listing, price: 420 }, search), false);
  assert.equal(listingMatchesSearch({ ...listing, price: 20 }, search), false);
});

test("deal score stays in range and qualified alert threshold is enforced", () => {
  const score = scoreListingForSearch(listing, search);
  assert.ok(score.dealScore >= 0 && score.dealScore <= 100);
  assert.equal(score.qualifies, true);
  const low = scoreListingForSearch({ ...listing, title: "Tool", description: "broken parts only", price: 280, imageUrls: [], rawJson: { estimatedResalePrice: 300 } }, search);
  assert.equal(low.qualifies, false);
  assert.ok(calculateDealScore(listing, score.estimatedProfit, search) >= search.minDealScore);
});

test("mock adapter produces and normalizes realistic listings", async () => {
  const source: MarketplaceSource = { id: "source-mock", name: "Mock Marketplace", type: "mock", baseUrl: "", isActive: true, configJson: '{"resultCount":10}', createdAt: timestamp, updatedAt: timestamp };
  const raw = await mockMarketplaceAdapter.fetchListings(search, source, { MOCK_MARKETPLACE_ENABLED: "true" } as CrawlerEnv);
  assert.equal(raw.length, 10);
  const normalized = await mockMarketplaceAdapter.normalizeListing(raw[0], search, source);
  assert.equal(normalized.source, "Mock Marketplace");
  assert.ok(normalized.title.length > 3);
  assert.ok(normalized.sourceUrl.startsWith("https://"));
});
