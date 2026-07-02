import { getCrawlerAdapter } from "./adapters/index.ts";
import { getCrawlerConfig } from "./config.ts";
import { listingMatchesSearch } from "./filters.ts";
import { listingContentHash } from "./hash.ts";
import { CrawlerRepository } from "./repository.ts";
import { scoreListingForSearch } from "./scoring.ts";
import type { CrawlerEnv, ListingMatchScore, MarketplaceSource, RawListing, SavedSearch } from "./types.ts";

export async function createAlertIfQualified(repository: CrawlerRepository, listingTitle: string, search: SavedSearch, matchId: string, score: ListingMatchScore) {
  if (!score.qualifies) return null;
  return repository.createAlertIfQualified(search.userId, search.id, matchId, `${score.dealScore} score: ${listingTitle}`, `${score.reason} Estimated resale $${Math.round(score.estimatedResalePrice)}.`);
}

export async function normalizeAndStoreListings(env: CrawlerEnv, source: MarketplaceSource, search: SavedSearch, rawListings: RawListing[]) {
  const repository = CrawlerRepository.from(env);
  const adapter = getCrawlerAdapter(source.type);
  const maxResults = getCrawlerConfig(env).maxResultsPerRun;
  let processed = 0;
  let newListings = 0;
  let qualified = 0;
  for (const raw of rawListings.slice(0, maxResults)) {
    const normalized = await adapter.normalizeListing(raw, search, source);
    if (!listingMatchesSearch(normalized, search)) continue;
    const contentHash = await listingContentHash(normalized);
    const stored = await repository.upsertListing({ ...normalized, contentHash });
    const score = scoreListingForSearch(normalized, search, stored.duplicateOrRepost);
    const match = await repository.upsertMatch(stored.id, search, score);
    await createAlertIfQualified(repository, normalized.title, search, match.id, score);
    processed += 1;
    if (stored.isNew) newListings += 1;
    if (score.qualifies) qualified += 1;
  }
  return { processed, newListings, qualified };
}

export async function runSourceForSavedSearch(env: CrawlerEnv, sourceId: string, savedSearchId: string, userId?: string) {
  const repository = CrawlerRepository.from(env);
  const search = userId ? await repository.getSavedSearch(userId, savedSearchId) : await repository.getSavedSearchById(savedSearchId);
  if (!search) throw new Error("Saved search not found.");
  const source = await repository.getSource(sourceId);
  if (!source?.isActive) throw new Error("Marketplace source is missing or inactive.");
  const config = getCrawlerConfig(env);
  if (!config.enabled) throw new Error("Crawler is disabled by CRAWLER_ENABLED.");
  if (source.type === "mock" && !config.mockMarketplaceEnabled) throw new Error("Mock marketplace is disabled.");
  const runId = await repository.createRun(source.id, search.id);
  try {
    const adapter = getCrawlerAdapter(source.type);
    const rawListings = await adapter.fetchListings(search, source, env);
    const result = await normalizeAndStoreListings(env, source, search, rawListings);
    await repository.finishRun(runId, "completed", rawListings.length, result.newListings);
    return { runId, source: source.name, listingsFound: rawListings.length, ...result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Crawler source failed.";
    await repository.finishRun(runId, "failed", 0, 0, message);
    throw new Error(`${source.name}: ${message}`);
  }
}

export async function runSavedSearch(env: CrawlerEnv, savedSearchId: string, userId?: string) {
  const repository = CrawlerRepository.from(env);
  const search = userId ? await repository.getSavedSearch(userId, savedSearchId) : await repository.getSavedSearchById(savedSearchId);
  if (!search) throw new Error("Saved search not found.");
  const sources = await repository.listSourcesForSearch(search.id);
  const results: unknown[] = [];
  const errors: string[] = [];
  for (const source of sources) {
    try { results.push(await runSourceForSavedSearch(env, source.id, search.id, search.userId)); }
    catch (error) { errors.push(error instanceof Error ? error.message : "Source failed."); }
  }
  await repository.updateLastScanned(search.id);
  if (!results.length && errors.length) throw new Error(errors.join(" "));
  return { savedSearchId: search.id, status: errors.length ? "partial" : "completed", results, errors };
}

export async function runAllDueSavedSearches(env: CrawlerEnv) {
  const repository = CrawlerRepository.from(env);
  const searches = await repository.listDueSavedSearches();
  const results = [];
  for (const search of searches) {
    try { results.push(await runSavedSearch(env, search.id, search.userId)); }
    catch (error) { results.push({ savedSearchId: search.id, status: "failed", error: error instanceof Error ? error.message : "Scan failed." }); }
  }
  return { due: searches.length, results };
}

export async function runDueSavedSearchesForUser(env: CrawlerEnv, userId: string) {
  const repository = CrawlerRepository.from(env);
  const searches = await repository.listDueSavedSearches(userId);
  const results = [];
  for (const search of searches) {
    try { results.push(await runSavedSearch(env, search.id, userId)); }
    catch (error) { results.push({ savedSearchId: search.id, status: "failed", error: error instanceof Error ? error.message : "Scan failed." }); }
  }
  return { due: searches.length, results };
}
