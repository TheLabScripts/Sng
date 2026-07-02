import type { CrawlerEnv, CrawlerRun, D1Database, MarketplaceSource, MatchStatus, NormalizedListing, SavedSearch } from "./types.ts";

type Row = Record<string, unknown>;
const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const bool = (value: unknown) => value === 1 || value === true;
const num = (value: unknown) => Number(value || 0);
const str = (value: unknown) => String(value ?? "");
const nullable = (value: unknown) => value === null || value === undefined || value === "" ? null : String(value);

function savedSearchFromRow(row: Row): SavedSearch {
  return { id: str(row.id), userId: str(row.user_id), name: str(row.name), zipCode: str(row.zip_code), radiusMiles: num(row.radius_miles), category: str(row.category), keywords: str(row.keywords), negativeKeywords: str(row.negative_keywords), minPrice: num(row.min_price), maxPrice: num(row.max_price), minEstimatedProfit: num(row.min_estimated_profit), minDealScore: num(row.min_deal_score), isActive: bool(row.is_active), scanIntervalMinutes: num(row.scan_interval_minutes), lastScannedAt: nullable(row.last_scanned_at), createdAt: str(row.created_at), updatedAt: str(row.updated_at) };
}

function sourceFromRow(row: Row): MarketplaceSource {
  return { id: str(row.id), name: str(row.name), type: str(row.type) as MarketplaceSource["type"], baseUrl: str(row.base_url), isActive: bool(row.is_active), configJson: str(row.config_json), createdAt: str(row.created_at), updatedAt: str(row.updated_at) };
}

function runFromRow(row: Row): CrawlerRun {
  return { id: str(row.id), sourceId: str(row.source_id), savedSearchId: str(row.saved_search_id), status: str(row.status) as CrawlerRun["status"], startedAt: str(row.started_at), finishedAt: nullable(row.finished_at), listingsFound: num(row.listings_found), newListingsFound: num(row.new_listings_found), errorMessage: nullable(row.error_message), createdAt: str(row.created_at) };
}

export class CrawlerRepository {
  private readonly db: D1Database;

  constructor(db: D1Database) { this.db = db; }
  static from(env: CrawlerEnv) {
    if (!env.DB) throw new Error("D1 binding DB is not configured.");
    return new CrawlerRepository(env.DB);
  }

  async listSavedSearches(userId: string) {
    const result = await this.db.prepare(`SELECT s.*, COUNT(DISTINCT lm.id) AS match_count FROM saved_searches s LEFT JOIN listing_matches lm ON lm.saved_search_id = s.id AND lm.user_id = s.user_id WHERE s.user_id = ? GROUP BY s.id ORDER BY s.is_active DESC, s.created_at DESC`).bind(userId).all<Row>();
    return (result.results || []).map((row) => ({ ...savedSearchFromRow(row), matchCount: num(row.match_count) }));
  }

  async getSavedSearch(userId: string, searchId: string) {
    const row = await this.db.prepare(`SELECT * FROM saved_searches WHERE id = ? AND user_id = ?`).bind(searchId, userId).first<Row>();
    return row ? savedSearchFromRow(row) : null;
  }

  async getSavedSearchById(searchId: string) {
    const row = await this.db.prepare(`SELECT * FROM saved_searches WHERE id = ?`).bind(searchId).first<Row>();
    return row ? savedSearchFromRow(row) : null;
  }

  async createSavedSearch(userId: string, input: Partial<SavedSearch>) {
    const timestamp = now();
    const search: SavedSearch = { id: id("search"), userId, name: input.name?.trim() || "New saved search", zipCode: input.zipCode?.trim() || "", radiusMiles: Math.max(1, input.radiusMiles || 25), category: input.category || "Any", keywords: input.keywords || "", negativeKeywords: input.negativeKeywords || "", minPrice: Math.max(0, input.minPrice || 0), maxPrice: Math.max(0, input.maxPrice || 0), minEstimatedProfit: Math.max(0, input.minEstimatedProfit || 0), minDealScore: Math.min(100, Math.max(0, input.minDealScore || 0)), isActive: input.isActive !== false, scanIntervalMinutes: Math.max(5, input.scanIntervalMinutes || 30), lastScannedAt: null, createdAt: timestamp, updatedAt: timestamp };
    if (!search.zipCode) throw new Error("zipCode is required.");
    await this.db.prepare(`INSERT INTO saved_searches (id,user_id,name,zip_code,radius_miles,category,keywords,negative_keywords,min_price,max_price,min_estimated_profit,min_deal_score,is_active,scan_interval_minutes,last_scanned_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(search.id, search.userId, search.name, search.zipCode, search.radiusMiles, search.category, search.keywords, search.negativeKeywords, search.minPrice, search.maxPrice, search.minEstimatedProfit, search.minDealScore, search.isActive ? 1 : 0, search.scanIntervalMinutes, null, timestamp, timestamp).run();
    const sources = await this.listActiveSources();
    if (sources.length) await this.db.batch(sources.map((source) => this.db.prepare(`INSERT OR IGNORE INTO saved_search_sources (saved_search_id,source_id,created_at) VALUES (?,?,?)`).bind(search.id, source.id, timestamp)));
    return search;
  }

  async updateSavedSearch(userId: string, searchId: string, input: Partial<SavedSearch>) {
    const columns: Record<string, string> = { name: "name", zipCode: "zip_code", radiusMiles: "radius_miles", category: "category", keywords: "keywords", negativeKeywords: "negative_keywords", minPrice: "min_price", maxPrice: "max_price", minEstimatedProfit: "min_estimated_profit", minDealScore: "min_deal_score", isActive: "is_active", scanIntervalMinutes: "scan_interval_minutes" };
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const [key, column] of Object.entries(columns)) {
      const value = input[key as keyof SavedSearch];
      if (value === undefined) continue;
      sets.push(`${column} = ?`);
      values.push(typeof value === "boolean" ? (value ? 1 : 0) : value);
    }
    if (!sets.length) return this.getSavedSearch(userId, searchId);
    sets.push("updated_at = ?"); values.push(now(), searchId, userId);
    await this.db.prepare(`UPDATE saved_searches SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`).bind(...values).run();
    return this.getSavedSearch(userId, searchId);
  }

  async disableSavedSearch(userId: string, searchId: string) { return this.updateSavedSearch(userId, searchId, { isActive: false }); }

  async listDueSavedSearches(userId?: string) {
    const whereUser = userId ? "AND user_id = ?" : "";
    const statement = this.db.prepare(`SELECT * FROM saved_searches WHERE is_active = 1 ${whereUser} AND (last_scanned_at IS NULL OR datetime(last_scanned_at, '+' || scan_interval_minutes || ' minutes') <= datetime('now')) ORDER BY COALESCE(last_scanned_at, '1970-01-01') ASC LIMIT 100`);
    const result = userId ? await statement.bind(userId).all<Row>() : await statement.all<Row>();
    return (result.results || []).map(savedSearchFromRow);
  }

  async updateLastScanned(searchId: string) { await this.db.prepare(`UPDATE saved_searches SET last_scanned_at = ?, updated_at = ? WHERE id = ?`).bind(now(), now(), searchId).run(); }

  async listActiveSources() {
    const result = await this.db.prepare(`SELECT * FROM marketplace_sources WHERE is_active = 1 ORDER BY name`).all<Row>();
    return (result.results || []).map(sourceFromRow);
  }

  async getSource(sourceId: string) {
    const row = await this.db.prepare(`SELECT * FROM marketplace_sources WHERE id = ?`).bind(sourceId).first<Row>();
    return row ? sourceFromRow(row) : null;
  }

  async listSourcesForSearch(searchId: string) {
    const result = await this.db.prepare(`SELECT ms.* FROM marketplace_sources ms JOIN saved_search_sources sss ON sss.source_id = ms.id WHERE sss.saved_search_id = ? AND ms.is_active = 1 ORDER BY ms.name`).bind(searchId).all<Row>();
    const mapped = (result.results || []).map(sourceFromRow);
    return mapped.length ? mapped : this.listActiveSources();
  }

  async createRun(sourceId: string, searchId: string) {
    const timestamp = now();
    const runId = id("run");
    await this.db.prepare(`INSERT INTO crawler_runs (id,source_id,saved_search_id,status,started_at,created_at) VALUES (?,?,?,'running',?,?)`).bind(runId, sourceId, searchId, timestamp, timestamp).run();
    return runId;
  }

  async finishRun(runId: string, status: CrawlerRun["status"], listingsFound: number, newListingsFound: number, errorMessage?: string) {
    await this.db.prepare(`UPDATE crawler_runs SET status=?,finished_at=?,listings_found=?,new_listings_found=?,error_message=? WHERE id=?`).bind(status, now(), listingsFound, newListingsFound, errorMessage || null, runId).run();
  }

  async findListing(listing: NormalizedListing & { contentHash: string }) {
    const query = listing.externalId ? `SELECT * FROM listings WHERE source = ? AND external_id = ? LIMIT 1` : `SELECT * FROM listings WHERE source = ? AND source_url = ? AND content_hash = ? LIMIT 1`;
    return listing.externalId ? this.db.prepare(query).bind(listing.source, listing.externalId).first<Row>() : this.db.prepare(query).bind(listing.source, listing.sourceUrl, listing.contentHash).first<Row>();
  }

  async upsertListing(listing: NormalizedListing & { contentHash: string }) {
    const existing = await this.findListing(listing);
    const timestamp = now();
    const listingId = existing ? str(existing.id) : id("listing");
    if (existing) {
      await this.db.prepare(`UPDATE listings SET source_id=?,source_url=?,title=?,description=?,price=?,currency=?,location_text=?,zip_code=?,latitude=?,longitude=?,distance_miles=?,category=?,image_urls=?,seller_name=?,posted_at=?,scraped_at=?,raw_json=?,content_hash=?,is_active=1,updated_at=? WHERE id=?`).bind(listing.sourceId, listing.sourceUrl, listing.title, listing.description, listing.price, listing.currency, listing.locationText, listing.zipCode, listing.latitude, listing.longitude, listing.distanceMiles, listing.category, JSON.stringify(listing.imageUrls), listing.sellerName, listing.postedAt, listing.scrapedAt, JSON.stringify(listing.rawJson), listing.contentHash, timestamp, listingId).run();
    } else {
      await this.db.prepare(`INSERT INTO listings (id,source_id,source,external_id,source_url,title,description,price,currency,location_text,zip_code,latitude,longitude,distance_miles,category,image_urls,seller_name,posted_at,scraped_at,raw_json,content_hash,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)`).bind(listingId, listing.sourceId, listing.source, listing.externalId, listing.sourceUrl, listing.title, listing.description, listing.price, listing.currency, listing.locationText, listing.zipCode, listing.latitude, listing.longitude, listing.distanceMiles, listing.category, JSON.stringify(listing.imageUrls), listing.sellerName, listing.postedAt, listing.scrapedAt, JSON.stringify(listing.rawJson), listing.contentHash, timestamp, timestamp).run();
    }
    // Seeing the same canonical listing on a later scan is an update, not a repost.
    return { id: listingId, isNew: !existing, duplicateOrRepost: false };
  }

  async upsertMatch(listingId: string, search: SavedSearch, score: { estimatedResalePrice: number; estimatedCosts: number; estimatedProfit: number; dealScore: number; reason: string; riskFlags: string[] }) {
    const existing = await this.db.prepare(`SELECT id,status FROM listing_matches WHERE listing_id=? AND saved_search_id=? AND user_id=?`).bind(listingId, search.id, search.userId).first<Row>();
    const matchId = existing ? str(existing.id) : id("match");
    const timestamp = now();
    if (existing) await this.db.prepare(`UPDATE listing_matches SET estimated_resale_price=?,estimated_costs=?,estimated_profit=?,deal_score=?,reason=?,risk_flags=?,updated_at=? WHERE id=?`).bind(score.estimatedResalePrice, score.estimatedCosts, score.estimatedProfit, score.dealScore, score.reason, JSON.stringify(score.riskFlags), timestamp, matchId).run();
    else await this.db.prepare(`INSERT INTO listing_matches (id,listing_id,saved_search_id,user_id,estimated_resale_price,estimated_costs,estimated_profit,deal_score,reason,risk_flags,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,'new',?,?)`).bind(matchId, listingId, search.id, search.userId, score.estimatedResalePrice, score.estimatedCosts, score.estimatedProfit, score.dealScore, score.reason, JSON.stringify(score.riskFlags), timestamp, timestamp).run();
    return { id: matchId, isNew: !existing };
  }

  async createAlertIfQualified(userId: string, searchId: string, matchId: string, title: string, body: string) {
    const muted = await this.db.prepare(`SELECT 1 AS muted FROM muted_saved_search_alerts WHERE user_id=? AND saved_search_id=?`).bind(userId, searchId).first<Row>();
    if (muted) return null;
    const alertId = id("alert");
    await this.db.prepare(`INSERT OR IGNORE INTO alerts (id,user_id,listing_match_id,channel,title,body,status,sent_at,created_at) VALUES (?,?,?,'in_app',?,?,'unread',?,?)`).bind(alertId, userId, matchId, title, body, now(), now()).run();
    return alertId;
  }

  async listListingsForUser(userId: string, limit = 100) {
    const result = await this.db.prepare(`SELECT l.*,lm.id AS listing_match_id,lm.saved_search_id,lm.estimated_resale_price,lm.estimated_costs,lm.estimated_profit,lm.deal_score,lm.reason,lm.risk_flags,lm.status AS match_status FROM listing_matches lm JOIN listings l ON l.id=lm.listing_id WHERE lm.user_id=? AND lm.status <> 'ignored' ORDER BY lm.deal_score DESC,lm.created_at DESC LIMIT ?`).bind(userId, Math.min(250, Math.max(1, limit))).all<Row>();
    return result.results || [];
  }

  async getListingForUser(userId: string, listingId: string) {
    return this.db.prepare(`SELECT l.*,lm.id AS listing_match_id,lm.saved_search_id,lm.estimated_resale_price,lm.estimated_costs,lm.estimated_profit,lm.deal_score,lm.reason,lm.risk_flags,lm.status AS match_status FROM listing_matches lm JOIN listings l ON l.id=lm.listing_id WHERE lm.user_id=? AND l.id=? LIMIT 1`).bind(userId, listingId).first<Row>();
  }

  async updateListingStatus(userId: string, listingId: string, status: MatchStatus) {
    await this.db.prepare(`UPDATE listing_matches SET status=?,updated_at=? WHERE listing_id=? AND user_id=?`).bind(status, now(), listingId, userId).run();
    return this.getListingForUser(userId, listingId);
  }

  async listAlerts(userId: string) {
    const result = await this.db.prepare(`SELECT a.*,l.id AS listing_id,l.title AS listing_title,l.source_url,l.image_urls,lm.saved_search_id,lm.deal_score,lm.estimated_profit FROM alerts a JOIN listing_matches lm ON lm.id=a.listing_match_id JOIN listings l ON l.id=lm.listing_id WHERE a.user_id=? ORDER BY CASE a.status WHEN 'unread' THEN 0 ELSE 1 END,a.created_at DESC LIMIT 200`).bind(userId).all<Row>();
    return result.results || [];
  }

  async markAlert(userId: string, alertId: string, status: "read" | "unread") {
    await this.db.prepare(`UPDATE alerts SET status=? WHERE id=? AND user_id=?`).bind(status, alertId, userId).run();
  }

  async muteSearchAlerts(userId: string, searchId: string) {
    const search = await this.getSavedSearch(userId, searchId);
    if (!search) return false;
    await this.db.prepare(`INSERT OR REPLACE INTO muted_saved_search_alerts (user_id,saved_search_id,muted_at) VALUES (?,?,?)`).bind(userId, searchId, now()).run();
    return true;
  }

  async listRuns(limit = 50) {
    const result = await this.db.prepare(`SELECT cr.*,ms.name AS source_name,ss.name AS saved_search_name FROM crawler_runs cr JOIN marketplace_sources ms ON ms.id=cr.source_id JOIN saved_searches ss ON ss.id=cr.saved_search_id ORDER BY cr.created_at DESC LIMIT ?`).bind(Math.min(200, Math.max(1, limit))).all<Row>();
    return result.results || [];
  }

  async getRun(runId: string) {
    const row = await this.db.prepare(`SELECT cr.*,ms.name AS source_name,ss.name AS saved_search_name FROM crawler_runs cr JOIN marketplace_sources ms ON ms.id=cr.source_id JOIN saved_searches ss ON ss.id=cr.saved_search_id WHERE cr.id=?`).bind(runId).first<Row>();
    return row ? { ...runFromRow(row), sourceName: str(row.source_name), savedSearchName: str(row.saved_search_name) } : null;
  }

  async claimCreatorReferral(userId: string, creatorCode: string, referralSource?: string) {
    const timestamp = now();
    await this.db.prepare(`INSERT OR IGNORE INTO creator_referrals (id,user_id,creator_code,referral_source,claimed_at,created_at) VALUES (?,?,?,?,?,?)`).bind(id("referral"), userId, creatorCode.trim().toUpperCase(), referralSource || null, timestamp, timestamp).run();
  }
}
