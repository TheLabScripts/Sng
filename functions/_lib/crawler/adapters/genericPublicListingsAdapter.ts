import { getCrawlerConfig, parseSourceConfig } from "../config.ts";
import type { CrawlerAdapter } from "../types.ts";
import { parseHtmlWithSelectors } from "./htmlParser.ts";
import { buildTemplatedUrl, normalizeRawListing } from "./utils.ts";

const lastRequestAt = new Map<string, number>();

export const genericPublicListingsAdapter: CrawlerAdapter = {
  name: "Generic Public Listings Adapter",
  sourceType: "generic_public",
  buildSearchUrl(search, source) { return buildTemplatedUrl(source.baseUrl, search); },
  async fetchListings(search, source, env) {
    const config = parseSourceConfig(source.configJson);
    if (!config.selectors) throw new Error("Generic public source is missing selectors in configJson.");
    const crawlerConfig = getCrawlerConfig(env);
    const delay = Math.max(1000, config.requestDelayMs || 3000);
    const previous = lastRequestAt.get(source.id) || 0;
    const wait = delay - (Date.now() - previous);
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), crawlerConfig.requestTimeoutMs);
    try {
      const response = await fetch(this.buildSearchUrl(search, source), { headers: { "Accept": "text/html,application/xhtml+xml", "User-Agent": crawlerConfig.userAgent }, redirect: "follow", signal: controller.signal });
      if (!response.ok) throw new Error(`Public source returned HTTP ${response.status}.`);
      lastRequestAt.set(source.id, Date.now());
      return this.parseListings(await response.text(), search, source);
    } finally { clearTimeout(timeout); }
  },
  async parseListings(raw, _search, source) {
    if (Array.isArray(raw)) return raw;
    return parseHtmlWithSelectors(raw, parseSourceConfig(source.configJson).selectors, source.baseUrl);
  },
  async normalizeListing(raw, search, source) { return normalizeRawListing(raw, search, source, parseSourceConfig(source.configJson)); },
};
