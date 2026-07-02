export type SourceType = "mock" | "html_snapshot" | "generic_public" | "facebook_placeholder" | "provider_json";
export type RunStatus = "queued" | "running" | "completed" | "failed" | "partial";
export type MatchStatus = "new" | "saved" | "ignored" | "contacted" | "bought" | "sold";

export type SavedSearch = {
  id: string; userId: string; name: string; zipCode: string; radiusMiles: number; category: string;
  keywords: string; negativeKeywords: string; minPrice: number; maxPrice: number; minEstimatedProfit: number;
  minDealScore: number; isActive: boolean; scanIntervalMinutes: number; lastScannedAt: string | null;
  createdAt: string; updatedAt: string;
};

export type MarketplaceSource = {
  id: string; name: string; type: SourceType; baseUrl: string; isActive: boolean; configJson: string;
  createdAt: string; updatedAt: string;
};

export type CrawlerRun = {
  id: string; sourceId: string; savedSearchId: string; status: RunStatus; startedAt: string;
  finishedAt: string | null; listingsFound: number; newListingsFound: number; errorMessage: string | null; createdAt: string;
};

export type RawListing = Record<string, unknown>;

export type NormalizedListing = {
  id?: string; sourceId: string; source: string; externalId: string | null; sourceUrl: string; title: string;
  description: string; price: number | null; currency: string; locationText: string; zipCode: string | null;
  latitude: number | null; longitude: number | null; distanceMiles: number | null; category: string;
  imageUrls: string[]; sellerName: string | null; postedAt: string | null; scrapedAt: string;
  rawJson: RawListing; contentHash?: string; isActive: boolean;
};

export type ListingMatchScore = {
  estimatedResalePrice: number; estimatedCosts: number; estimatedProfit: number; dealScore: number;
  reason: string; riskFlags: string[]; qualifies: boolean; suggestedMaxBuyPrice: number; suggestedSellerMessage: string;
};

export type SelectorConfig = {
  item: string; title: string; price: string; url: string; description?: string; image?: string; location?: string;
  seller?: string; postedAt?: string; externalIdAttribute?: string; urlAttribute?: string; imageAttribute?: string;
};

export type SourceConfig = {
  selectors?: SelectorConfig; resultCount?: number; requestDelayMs?: number; snapshotUrl?: string; snapshotHtml?: string;
  mode?: "snapshot" | "provider"; providerUrl?: string; providerHeaders?: Record<string, string>;
  itemsPath?: string; fieldMap?: Record<string, string>;
};

export type CrawlerConfig = {
  enabled: boolean; intervalMinutes: number; mockMarketplaceEnabled: boolean; maxResultsPerRun: number;
  requestTimeoutMs: number; userAgent: string;
};

export type D1Result<T = unknown> = { results?: T[]; success: boolean; meta?: Record<string, unknown> };
export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  run: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
};
export type D1Database = {
  prepare: (sql: string) => D1PreparedStatement;
  batch: <T = unknown>(statements: D1PreparedStatement[]) => Promise<D1Result<T>[]>;
  exec: (sql: string) => Promise<D1Result>;
};

export type CrawlerEnv = {
  DB: D1Database; CRAWLER_ENABLED?: string; CRAWLER_INTERVAL_MINUTES?: string; MOCK_MARKETPLACE_ENABLED?: string;
  MAX_CRAWLER_RESULTS_PER_RUN?: string; CRAWLER_REQUEST_TIMEOUT_MS?: string; CRAWLER_USER_AGENT?: string;
  AUTH_JWT_SECRET?: string; ALLOW_DEV_AUTH?: string;
};

export type CrawlerAdapter = {
  name: string;
  sourceType: SourceType;
  buildSearchUrl: (savedSearch: SavedSearch, source: MarketplaceSource) => string;
  fetchListings: (savedSearch: SavedSearch, source: MarketplaceSource, env: CrawlerEnv) => Promise<RawListing[]>;
  parseListings: (rawHtmlOrJson: string | RawListing[], savedSearch: SavedSearch, source: MarketplaceSource) => Promise<RawListing[]>;
  normalizeListing: (rawListing: RawListing, savedSearch: SavedSearch, source: MarketplaceSource) => Promise<NormalizedListing>;
};
