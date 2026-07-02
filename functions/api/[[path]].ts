import { authenticateRequest, createAnonymousSession, requireAdmin } from "../_lib/auth.ts";
import { runAllDueSavedSearches, runDueSavedSearchesForUser, runSavedSearch, runSourceForSavedSearch } from "../_lib/crawler/crawlerService.ts";
import { CrawlerRepository } from "../_lib/crawler/repository.ts";
import { scoreListingForSearch } from "../_lib/crawler/scoring.ts";
import type { CrawlerEnv, MatchStatus, NormalizedListing, SavedSearch } from "../_lib/crawler/types.ts";

type Context = { request: Request; env: CrawlerEnv; params: { path?: string | string[] }; waitUntil?: (promise: Promise<unknown>) => void };
type Row = Record<string, unknown>;
const matchStatuses = new Set<MatchStatus>(["new", "saved", "ignored", "contacted", "bought", "sold"]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin");
  return { "Access-Control-Allow-Origin": origin || new URL(request.url).origin, "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Snagd-Dev-User, X-Snagd-Dev-Role", "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", Vary: "Origin" };
}

function json(request: Request, data: unknown, status = 200) { return Response.json(data, { status, headers: { ...corsHeaders(request), "Cache-Control": "no-store" } }); }
async function body(request: Request) { try { return await request.json() as Record<string, unknown>; } catch { throw new Error("Request body must be valid JSON."); } }
function asNumber(value: unknown, fallback = 0) { if (value === null || value === undefined || value === "") return fallback; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function asString(value: unknown, fallback = "") { return typeof value === "string" ? value : fallback; }
function parseJsonArray(value: unknown) { try { const parsed = JSON.parse(String(value || "[]")); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }

function serializeListing(row: Row) {
  return {
    id: String(row.id), source: String(row.source), externalId: row.external_id || null, sourceUrl: String(row.source_url), title: String(row.title),
    description: String(row.description || ""), price: row.price === null ? null : Number(row.price), currency: String(row.currency || "USD"),
    locationText: String(row.location_text || ""), zipCode: row.zip_code || null, latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude), distanceMiles: row.distance_miles === null ? null : Number(row.distance_miles),
    category: String(row.category || "Other"), imageUrls: parseJsonArray(row.image_urls), sellerName: row.seller_name || null,
    postedAt: row.posted_at || null, scrapedAt: row.scraped_at, listingMatchId: row.listing_match_id, savedSearchId: row.saved_search_id,
    estimatedResalePrice: Number(row.estimated_resale_price || 0), estimatedCosts: Number(row.estimated_costs || 0),
    estimatedProfit: Number(row.estimated_profit || 0), dealScore: Number(row.deal_score || 0), reason: String(row.reason || ""),
    riskFlags: parseJsonArray(row.risk_flags), status: row.match_status || "new",
  };
}

function manualListing(input: Record<string, unknown>, userId: string): { listing: NormalizedListing; search: SavedSearch } {
  const timestamp = new Date().toISOString();
  const title = asString(input.title).trim();
  if (!title) throw new Error("title is required.");
  const listing: NormalizedListing = { sourceId: "manual", source: "Manual analyzer", externalId: null, sourceUrl: asString(input.url) || "about:blank", title, description: asString(input.description), price: input.price === null ? null : asNumber(input.price), currency: "USD", locationText: asString(input.location || input.zipCode), zipCode: asString(input.zipCode || input.location) || null, latitude: null, longitude: null, distanceMiles: asNumber(input.distanceMiles, 0), category: asString(input.category, "Other"), imageUrls: asString(input.imageUrl) ? [asString(input.imageUrl)] : [], sellerName: null, postedAt: null, scrapedAt: timestamp, rawJson: { estimatedResalePrice: input.estimatedResalePrice, compPrices: input.compPrices }, isActive: true };
  const search: SavedSearch = { id: "manual", userId, name: "Manual analysis", zipCode: listing.zipCode || "", radiusMiles: Math.max(1, listing.distanceMiles || 25), category: "Any", keywords: title, negativeKeywords: "", minPrice: 0, maxPrice: 0, minEstimatedProfit: asNumber(input.minEstimatedProfit, 50), minDealScore: asNumber(input.minDealScore, 60), isActive: true, scanIntervalMinutes: 30, lastScannedAt: null, createdAt: timestamp, updatedAt: timestamp };
  return { listing, search };
}

export async function onRequest(context: Context) {
  const { request, env } = context;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  try {
    const path = new URL(request.url).pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
    const parts = path ? path.split("/") : [];
    if (parts[0] === "session" && parts[1] === "anonymous" && request.method === "POST") return json(request, await createAnonymousSession(env), 201);
    const user = await authenticateRequest(request, env);
    const repository = CrawlerRepository.from(env);

    if (parts[0] === "saved-searches" && parts.length === 1 && request.method === "GET") return json(request, { savedSearches: await repository.listSavedSearches(user.id) });
    if (parts[0] === "saved-searches" && parts.length === 1 && request.method === "POST") return json(request, { savedSearch: await repository.createSavedSearch(user.id, await body(request)) }, 201);
    if (parts[0] === "saved-searches" && parts.length === 2 && request.method === "PATCH") return json(request, { savedSearch: await repository.updateSavedSearch(user.id, parts[1], await body(request)) });
    if (parts[0] === "saved-searches" && parts.length === 2 && request.method === "DELETE") return json(request, { savedSearch: await repository.disableSavedSearch(user.id, parts[1]) });
    if (parts[0] === "saved-searches" && parts[2] === "run" && request.method === "POST") return json(request, await runSavedSearch(env, parts[1], user.id));

    if (parts[0] === "listings" && parts.length === 1 && request.method === "GET") {
      if (new URL(request.url).searchParams.get("refresh") === "due") await runDueSavedSearchesForUser(env, user.id);
      return json(request, { listings: (await repository.listListingsForUser(user.id, asNumber(new URL(request.url).searchParams.get("limit"), 100))).map(serializeListing) });
    }
    if (parts[0] === "listings" && parts[1] === "analyze" && request.method === "POST") { const input = manualListing(await body(request), user.id); return json(request, { analysis: scoreListingForSearch(input.listing, input.search), listing: input.listing }); }
    if (parts[0] === "listings" && parts.length === 2 && request.method === "GET") { const listing = await repository.getListingForUser(user.id, parts[1]); return listing ? json(request, { listing: serializeListing(listing) }) : json(request, { error: "Listing not found." }, 404); }
    if (parts[0] === "listings" && parts.length === 2 && request.method === "PATCH") { const input = await body(request); const status = asString(input.status) as MatchStatus; if (!matchStatuses.has(status)) return json(request, { error: "Invalid listing status." }, 400); const listing = await repository.updateListingStatus(user.id, parts[1], status); return listing ? json(request, { listing: serializeListing(listing) }) : json(request, { error: "Listing not found." }, 404); }

    if (parts[0] === "alerts" && parts[1] === "mute" && request.method === "PATCH") { const input = await body(request); const ok = await repository.muteSearchAlerts(user.id, asString(input.savedSearchId)); return json(request, { ok }, ok ? 200 : 404); }
    if (parts[0] === "alerts" && parts.length === 1 && request.method === "GET") return json(request, { alerts: await repository.listAlerts(user.id) });
    if (parts[0] === "alerts" && parts.length === 2 && request.method === "PATCH") { const input = await body(request); const status = input.status === "unread" ? "unread" : "read"; await repository.markAlert(user.id, parts[1], status); return json(request, { ok: true }); }

    if (parts[0] === "crawler" && parts[1] === "run-due" && request.method === "POST") { requireAdmin(user); return json(request, await runAllDueSavedSearches(env)); }
    if (parts[0] === "crawler" && parts[1] === "mock" && request.method === "POST") { const input = await body(request); return json(request, await runSourceForSavedSearch(env, "source-mock-marketplace", asString(input.savedSearchId), user.id)); }
    if (parts[0] === "crawler" && parts[1] === "runs" && parts.length === 2 && request.method === "GET") { requireAdmin(user); return json(request, { runs: await repository.listRuns() }); }
    if (parts[0] === "crawler" && parts[1] === "runs" && parts.length === 3 && request.method === "GET") { requireAdmin(user); const run = await repository.getRun(parts[2]); return run ? json(request, { run }) : json(request, { error: "Crawler run not found." }, 404); }
    if (parts[0] === "referrals" && parts[1] === "claim" && request.method === "POST") { const input = await body(request); const creatorCode = asString(input.creatorCode).trim(); if (!creatorCode) return json(request, { error: "creatorCode is required." }, 400); await repository.claimCreatorReferral(user.id, creatorCode, asString(input.referralSource)); return json(request, { ok: true }); }

    return json(request, { error: "API route not found." }, 404);
  } catch (error) {
    if (error instanceof Response) return new Response(error.body, { status: error.status, headers: { ...Object.fromEntries(error.headers), ...corsHeaders(request) } });
    return json(request, { error: error instanceof Error ? error.message : "Unexpected API error." }, 500);
  }
}
