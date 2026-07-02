import type { NormalizedListing, SavedSearch } from "./types.ts";

export function splitKeywords(value: string) {
  return value.split(/[,\n]/).map((item) => item.trim().toLowerCase()).filter(Boolean);
}

export function listingMatchesSearch(listing: NormalizedListing, search: SavedSearch) {
  const text = `${listing.title} ${listing.description}`.toLowerCase();
  const positive = splitKeywords(search.keywords);
  const negative = splitKeywords(search.negativeKeywords);
  if (negative.some((keyword) => text.includes(keyword))) return false;
  if (positive.length && !positive.some((keyword) => text.includes(keyword))) return false;
  if (search.category !== "Any" && search.category !== "Everything" && listing.category.toLowerCase() !== search.category.toLowerCase()) return false;
  if (listing.price !== null && search.minPrice > 0 && listing.price < search.minPrice) return false;
  if (listing.price !== null && search.maxPrice > 0 && listing.price > search.maxPrice) return false;
  if (listing.distanceMiles !== null && listing.distanceMiles > search.radiusMiles) return false;
  return true;
}
