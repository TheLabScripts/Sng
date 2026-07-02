import type { CrawlerAdapter, MarketplaceSource, RawListing, SavedSearch } from "../types.ts";
import { parseSourceConfig } from "../config.ts";
import { normalizeRawListing } from "./utils.ts";

const inventory = [
  ["2014 Honda Accord EX clean title", "Vehicles", 3200, 4950, "Good", "Runs well, recent brakes, clean interior."],
  ["2009 Yamaha V Star 650 motorcycle", "Motorcycles", 1400, 2450, "Good", "Garage kept, title in hand."],
  ["Milwaukee M18 drill impact bundle", "Tools", 135, 285, "Good", "Two batteries and charger included."],
  ["DeWalt 20V five tool combo", "Tools", 180, 340, "Very Good", "Lightly used complete kit."],
  ["PlayStation 5 disc console", "Electronics", 310, 465, "Like new", "Controller and cables included."],
  ["Apple MacBook Pro M1 2020", "Electronics", 420, 690, "Good", "Battery health 88 percent."],
  ["Solid oak six drawer dresser", "Furniture", 45, 165, "Fair", "Needs light sanding on top."],
  ["Leather sectional sofa", "Furniture", 90, 270, "Good", "No rips, pickup this weekend."],
  ["GE stainless refrigerator", "Appliances", 160, 390, "Good", "Cold and tested before pickup."],
  ["KitchenAid stand mixer", "Appliances", 85, 190, "Very Good", "Bowl and attachments included."],
  ["Ford F150 OEM tailgate", "Parts", 175, 380, "Good", "Fits 2015 through 2020 trucks."],
  ["Nintendo Switch OLED bundle", "Electronics", 155, 285, "Good", "Dock, case, games and charger."],
  ["Broken iPhone parts only", "Electronics", 60, 115, "Damaged", "No power, sold for parts only."],
] as const;

function seedFor(search: SavedSearch) { return [...`${search.id}:${search.zipCode}`].reduce((sum, char) => sum + char.charCodeAt(0), 0); }

export const mockMarketplaceAdapter: CrawlerAdapter = {
  name: "Mock Marketplace Adapter",
  sourceType: "mock",
  buildSearchUrl: (search) => `mock://marketplace/${search.zipCode}?q=${encodeURIComponent(search.keywords)}`,
  async fetchListings(search, source, env) {
    if (env.MOCK_MARKETPLACE_ENABLED?.toLowerCase() === "false") return [];
    const requested = Math.max(1, Math.min(100, parseSourceConfig(source.configJson).resultCount || 24));
    const seed = seedFor(search);
    return Array.from({ length: requested }, (_, index) => {
      const item = inventory[(seed + index) % inventory.length];
      const distance = ((seed * (index + 3)) % Math.max(2, search.radiusMiles * 10)) / 10;
      const priceShift = ((index % 5) - 2) * 7;
      return { externalId: `mock-${search.zipCode}-${seed}-${index}`, title: item[0], category: item[1], price: Math.max(0, item[2] + priceShift), estimatedResalePrice: item[3], condition: item[4], description: item[5], sourceUrl: `https://example.com/mock-listing/${seed}-${index}`, imageUrls: [`https://picsum.photos/seed/snagd-${seed}-${index}/720/540`], locationText: `${search.zipCode} area`, zipCode: search.zipCode, distanceMiles: distance, postedAt: new Date(Date.now() - index * 11 * 60000).toISOString(), currency: "USD" } satisfies RawListing;
    });
  },
  async parseListings(raw) { return Array.isArray(raw) ? raw : []; },
  async normalizeListing(raw, search, source) { return normalizeRawListing(raw, search, source); },
};
