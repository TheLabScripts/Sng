import type { CrawlerAlert, CrawlerListing, CrawlerSavedSearch, Deal, DealStatus } from "@/types/snagd";

class CrawlerApiError extends Error { constructor(message: string, readonly status: number) { super(message); } }

function localUserId() {
  let id = window.localStorage.getItem("snagd-api-user-id");
  if (!id) { id = `local-${globalThis.crypto?.randomUUID?.() || Date.now()}`; window.localStorage.setItem("snagd-api-user-id", id); }
  return id;
}

function authHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Snagd-Dev-User": localUserId() };
  try {
    const session = JSON.parse(window.localStorage.getItem("snagd-session") || "{}") as { apiToken?: string; isAdmin?: boolean };
    if (session.apiToken) headers.Authorization = `Bearer ${session.apiToken}`;
    if (session.isAdmin) headers["X-Snagd-Dev-Role"] = "admin";
  } catch { /* Ignore malformed local session. */ }
  return headers;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`/api/${path}`, { ...init, headers: { ...authHeaders(), ...(init.headers || {}) }, credentials: "same-origin" });
  const payload = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new CrawlerApiError(payload.error || `Crawler API returned ${response.status}.`, response.status);
  return payload as T;
}

export const crawlerApiClient = {
  listSavedSearches: () => request<{ savedSearches: CrawlerSavedSearch[] }>("saved-searches"),
  createSavedSearch: (input: Partial<CrawlerSavedSearch>) => request<{ savedSearch: CrawlerSavedSearch }>("saved-searches", { method: "POST", body: JSON.stringify(input) }),
  updateSavedSearch: (id: string, input: Partial<CrawlerSavedSearch>) => request<{ savedSearch: CrawlerSavedSearch }>(`saved-searches/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }),
  disableSavedSearch: (id: string) => request<{ savedSearch: CrawlerSavedSearch }>(`saved-searches/${encodeURIComponent(id)}`, { method: "DELETE" }),
  runSavedSearch: (id: string) => request<Record<string, unknown>>(`saved-searches/${encodeURIComponent(id)}/run`, { method: "POST" }),
  listListings: (refreshDue = false) => request<{ listings: CrawlerListing[] }>(`listings${refreshDue ? "?refresh=due" : ""}`),
  getListing: (id: string) => request<{ listing: CrawlerListing }>(`listings/${encodeURIComponent(id)}`),
  updateListingStatus: (id: string, status: CrawlerListing["status"]) => request<{ listing: CrawlerListing }>(`listings/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  analyzeListing: (input: Record<string, unknown>) => request<{ analysis: Record<string, unknown>; listing: Record<string, unknown> }>("listings/analyze", { method: "POST", body: JSON.stringify(input) }),
  listAlerts: () => request<{ alerts: CrawlerAlert[] }>("alerts"),
  markAlert: (id: string, status: "read" | "unread") => request<{ ok: boolean }>(`alerts/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  muteSearchAlerts: (savedSearchId: string) => request<{ ok: boolean }>("alerts/mute", { method: "PATCH", body: JSON.stringify({ savedSearchId }) }),
  claimReferral: (creatorCode: string, referralSource: string) => request<{ ok: boolean }>("referrals/claim", { method: "POST", body: JSON.stringify({ creatorCode, referralSource }) }),
};

export function crawlerListingToDeal(listing: CrawlerListing): Deal {
  const resaleLow = Math.max(0, Math.round(listing.estimatedResalePrice * 0.94));
  const resaleHigh = Math.max(resaleLow, Math.round(listing.estimatedResalePrice * 1.06));
  const profitLow = Math.round(listing.estimatedProfit - listing.estimatedCosts * 0.2);
  const profitHigh = Math.round(listing.estimatedProfit + listing.estimatedCosts * 0.2);
  const underMarket = listing.estimatedResalePrice > 0 && listing.price !== null ? Math.max(0, Math.round(((listing.estimatedResalePrice - listing.price) / listing.estimatedResalePrice) * 100)) : 0;
  const suggestedMaxBuyPrice = Math.max(0, Math.round(listing.estimatedResalePrice - listing.estimatedCosts - 50));
  const statusMap: Record<CrawlerListing["status"], DealStatus> = { new: "New", saved: "Saved", ignored: "Passed", contacted: "Messaged Seller", bought: "Bought", sold: "Sold" };
  return {
    id: listing.id, crawlerListingId: listing.id, dataOrigin: "crawler", itemName: listing.title, thumbnailTone: listing.riskFlags.length ? "amber" : "blue", imageUrls: listing.imageUrls,
    sellerRating: listing.sellerName || undefined, listingUrl: listing.sourceUrl, messageUrl: listing.sourceUrl, askingPrice: listing.price || 0,
    askingLabel: listing.price === null ? "No price" : new Intl.NumberFormat("en-US", { style: "currency", currency: listing.currency || "USD", maximumFractionDigits: 0 }).format(listing.price),
    estimatedResale: `$${resaleLow.toLocaleString()}-$${resaleHigh.toLocaleString()}`, estimatedResaleLow: resaleLow, estimatedResaleHigh: resaleHigh,
    estimatedProfit: `$${profitLow.toLocaleString()}-$${profitHigh.toLocaleString()}`, estimatedProfitLow: profitLow, estimatedProfitHigh: profitHigh,
    score: listing.dealScore, recommendation: listing.dealScore >= 75 && listing.estimatedProfit > 0 ? "BUY" : listing.dealScore >= 50 ? "MAYBE" : "PASS",
    distance: listing.distanceMiles === null || listing.distanceMiles === undefined ? listing.locationText || "Distance unavailable" : `${listing.distanceMiles.toFixed(1)} miles`,
    distanceMiles: listing.distanceMiles || 0, risk: listing.riskFlags.length >= 2 ? "High" : listing.riskFlags.length ? "Medium" : "Low", source: listing.source,
    category: listing.category, condition: /damaged|broken/i.test(`${listing.title} ${listing.description}`) ? "Damaged" : "Good", timePosted: listing.postedAt ? new Date(listing.postedAt).toLocaleString() : `Scanned ${new Date(listing.scrapedAt).toLocaleString()}`,
    reason: listing.reason, note: listing.description, similarSalesCount: 0, underMarketPercent: underMarket, demand: "Medium", competition: "Medium", confidence: "Medium",
    reasonTags: [listing.source, `$${Math.round(listing.estimatedCosts)} estimated costs`, ...listing.riskFlags.slice(0, 3)], riskFlags: listing.riskFlags, similarSales: [], status: statusMap[listing.status],
    estimatedCosts: listing.estimatedCosts, suggestedMaxBuyPrice,
    suggestedSellerMessage: `Hi, is the ${listing.title} still available? If it matches the description, would you consider $${suggestedMaxBuyPrice} for pickup?`,
  };
}

export function isCrawlerApiUnavailable(error: unknown) { return error instanceof TypeError || (error instanceof CrawlerApiError && [401, 404, 500, 503].includes(error.status)); }
