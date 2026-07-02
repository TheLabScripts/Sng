import type { MarketplaceSource, NormalizedListing, RawListing, SavedSearch, SourceConfig } from "../types.ts";

export function parsePrice(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = String(value || "").replace(/,/g, "").match(/-?\d+(?:\.\d{1,2})?/);
  return match ? Number(match[0]) : null;
}

export function absoluteUrl(value: unknown, baseUrl: string) {
  const raw = String(value || "").trim();
  if (!raw) return baseUrl || "about:blank";
  try { return new URL(raw, baseUrl || "https://snagd.app").toString(); } catch { return raw; }
}

export function valueAtPath(input: unknown, path = "") {
  if (!path) return input;
  return path.split(".").reduce<unknown>((current, part) => current && typeof current === "object" ? (current as Record<string, unknown>)[part] : undefined, input);
}

export function stringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export function normalizeRawListing(raw: RawListing, search: SavedSearch, source: MarketplaceSource, config: SourceConfig = {}): NormalizedListing {
  const map = config.fieldMap || {};
  const get = (field: string, fallback?: string) => valueAtPath(raw, map[field] || field) ?? (fallback ? valueAtPath(raw, fallback) : undefined);
  const sourceUrl = absoluteUrl(get("sourceUrl", "url"), source.baseUrl);
  return {
    sourceId: source.id,
    source: source.name,
    externalId: String(get("externalId", "id") || "").trim() || null,
    sourceUrl,
    title: String(get("title", "name") || "Untitled listing").trim(),
    description: String(get("description") || "").trim(),
    price: parsePrice(get("price")),
    currency: String(get("currency") || "USD"),
    locationText: String(get("locationText", "location") || search.zipCode),
    zipCode: String(get("zipCode") || search.zipCode) || null,
    latitude: parsePrice(get("latitude")),
    longitude: parsePrice(get("longitude")),
    distanceMiles: parsePrice(get("distanceMiles", "distance")),
    category: String(get("category") || search.category || "Other"),
    imageUrls: stringArray(get("imageUrls", "image")).map((url) => absoluteUrl(url, source.baseUrl)),
    sellerName: String(get("sellerName", "seller") || "").trim() || null,
    postedAt: String(get("postedAt") || "").trim() || null,
    scrapedAt: new Date().toISOString(),
    rawJson: raw,
    isActive: true,
  };
}

export function buildTemplatedUrl(template: string, search: SavedSearch) {
  const values: Record<string, string> = {
    zipCode: search.zipCode,
    radiusMiles: String(search.radiusMiles),
    keywords: search.keywords,
    minPrice: String(search.minPrice || ""),
    maxPrice: String(search.maxPrice || ""),
    category: search.category,
  };
  return Object.entries(values).reduce((url, [key, value]) => url.replaceAll(`{{${key}}}`, encodeURIComponent(value)), template);
}
