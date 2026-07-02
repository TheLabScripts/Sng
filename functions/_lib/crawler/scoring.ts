import { splitKeywords } from "./filters.ts";
import type { ListingMatchScore, NormalizedListing, SavedSearch } from "./types.ts";

const categoryMultipliers: Record<string, number> = { vehicles: 1.28, vehicle: 1.28, motorcycles: 1.32, tools: 1.7, electronics: 1.42, furniture: 2.05, appliances: 1.65, parts: 1.55, sneakers: 1.5, other: 1.45 };
const categoryDemand: Record<string, number> = { vehicles: 14, vehicle: 14, motorcycles: 12, tools: 15, electronics: 13, furniture: 10, appliances: 11, parts: 9, sneakers: 11, other: 7 };
function roundMoney(value: number) { return Math.round(value * 100) / 100; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }

export function getRiskFlags(listing: NormalizedListing, duplicateOrRepost = false) {
  const text = `${listing.title} ${listing.description}`.toLowerCase();
  const flags: string[] = [];
  if (listing.price === null || listing.price < 0) flags.push("missing price");
  if (listing.price !== null && listing.price > 0 && listing.price < 10) flags.push("price too good to be true");
  if (!listing.imageUrls.length) flags.push("no image");
  if (listing.title.trim().split(/\s+/).length < 3) flags.push("vague title");
  if (duplicateOrRepost) flags.push("duplicate/repost");
  if (/\b(damaged|broken|parts only|for parts|not working|untested)\b/.test(text)) flags.push("damaged/parts-only keywords");
  if (/\b(salvage|rebuilt|flood|no title)\b/.test(text) && /vehicle|car|truck|motorcycle/.test(`${listing.category} ${text}`)) flags.push("salvage/rebuilt vehicle signal");
  return flags;
}

export function estimateResaleValue(listing: NormalizedListing) {
  const raw = listing.rawJson as { estimatedResalePrice?: unknown; compPrices?: unknown };
  const manual = Number(raw.estimatedResalePrice);
  if (Number.isFinite(manual) && manual > 0) return roundMoney(manual);
  if (Array.isArray(raw.compPrices)) {
    const prices = raw.compPrices.map(Number).filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
    if (prices.length) return roundMoney(prices[Math.floor(prices.length / 2)]);
  }
  if (listing.price === null) return 0;
  return roundMoney(listing.price * (categoryMultipliers[listing.category.toLowerCase()] || categoryMultipliers.other));
}

export function estimateCosts(listing: NormalizedListing, savedSearch: SavedSearch) {
  const distance = listing.distanceMiles ?? Math.min(savedSearch.radiusMiles, 10);
  const pickupCost = distance * 2 * 0.22;
  const category = listing.category.toLowerCase();
  const handling = category.includes("vehicle") ? 180 : category === "furniture" ? 28 : category === "appliances" ? 24 : 12;
  const riskReserve = /damaged|broken|repair|untested|parts/i.test(`${listing.title} ${listing.description}`) ? Math.max(20, (listing.price || 0) * 0.18) : 0;
  return roundMoney(pickupCost + handling + riskReserve);
}

export function calculateEstimatedProfit(resalePrice: number, askingPrice: number, costs: number) { return roundMoney(resalePrice - askingPrice - costs); }

export function calculateDealScore(listing: NormalizedListing, profit: number, savedSearch: SavedSearch, resalePrice = estimateResaleValue(listing), riskFlags = getRiskFlags(listing)) {
  const asking = listing.price || 0;
  const margin = resalePrice > 0 ? profit / resalePrice : 0;
  const distance = listing.distanceMiles ?? savedSearch.radiusMiles;
  const text = `${listing.title} ${listing.description}`.toLowerCase();
  const keywordHits = splitKeywords(savedSearch.keywords).filter((keyword) => text.includes(keyword)).length;
  const profitPoints = clamp((profit / Math.max(savedSearch.minEstimatedProfit || 50, 50)) * 24, -20, 32);
  const marginPoints = clamp(margin * 42, -18, 26);
  const distancePoints = clamp(14 - (distance / Math.max(savedSearch.radiusMiles, 1)) * 12, 0, 14);
  const priceValuePoints = asking > 0 && resalePrice > asking ? clamp(((resalePrice - asking) / resalePrice) * 22, 0, 22) : 0;
  const keywordPoints = clamp(keywordHits * 4, 0, 12);
  const demandPoints = categoryDemand[listing.category.toLowerCase()] || categoryDemand.other;
  const riskPenalty = riskFlags.length * 7 + (riskFlags.includes("salvage/rebuilt vehicle signal") ? 12 : 0);
  return Math.round(clamp(10 + profitPoints + marginPoints + distancePoints + priceValuePoints + keywordPoints + demandPoints - riskPenalty, 0, 100));
}

export function scoreListingForSearch(listing: NormalizedListing, savedSearch: SavedSearch, duplicateOrRepost = false): ListingMatchScore {
  const estimatedResalePrice = estimateResaleValue(listing);
  const estimatedCosts = estimateCosts(listing, savedSearch);
  const estimatedProfit = calculateEstimatedProfit(estimatedResalePrice, listing.price || 0, estimatedCosts);
  const riskFlags = getRiskFlags(listing, duplicateOrRepost);
  const dealScore = calculateDealScore(listing, estimatedProfit, savedSearch, estimatedResalePrice, riskFlags);
  const qualifies = estimatedProfit >= savedSearch.minEstimatedProfit && dealScore >= savedSearch.minDealScore;
  const suggestedMaxBuyPrice = Math.max(0, roundMoney(estimatedResalePrice - estimatedCosts - savedSearch.minEstimatedProfit));
  const reason = `${estimatedProfit >= 0 ? "$" + Math.round(estimatedProfit) + " estimated profit" : "Negative estimated margin"}; score ${dealScore}/100; ${riskFlags.length ? riskFlags.join(", ") : "no major automated risk flags"}.`;
  return { estimatedResalePrice, estimatedCosts, estimatedProfit, dealScore, reason, riskFlags, qualifies, suggestedMaxBuyPrice, suggestedSellerMessage: `Hi, is the ${listing.title} still available? If it matches the description, would you consider $${Math.round(suggestedMaxBuyPrice)} for pickup?` };
}
