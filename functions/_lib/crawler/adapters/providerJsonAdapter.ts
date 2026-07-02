import { getCrawlerConfig, parseSourceConfig } from "../config.ts";
import type { CrawlerAdapter, RawListing } from "../types.ts";
import { normalizeRawListing, valueAtPath } from "./utils.ts";

export const providerJsonAdapter: CrawlerAdapter = {
  name: "Provider JSON Adapter",
  sourceType: "provider_json",
  buildSearchUrl(search, source) {
    const config = parseSourceConfig(source.configJson);
    const template = config.providerUrl || source.baseUrl;
    return template.replaceAll("{{zipCode}}", encodeURIComponent(search.zipCode)).replaceAll("{{keywords}}", encodeURIComponent(search.keywords)).replaceAll("{{radiusMiles}}", String(search.radiusMiles));
  },
  async fetchListings(search, source, env) {
    const config = parseSourceConfig(source.configJson);
    const url = this.buildSearchUrl(search, source);
    if (!url) throw new Error("Provider JSON source requires providerUrl or baseUrl.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getCrawlerConfig(env).requestTimeoutMs);
    try {
      const response = await fetch(url, { headers: { Accept: "application/json", ...(config.providerHeaders || {}) }, signal: controller.signal });
      if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}.`);
      return this.parseListings(JSON.stringify(await response.json()), search, source);
    } finally { clearTimeout(timeout); }
  },
  async parseListings(raw, _search, source) {
    if (Array.isArray(raw)) return raw;
    const config = parseSourceConfig(source.configJson);
    const payload = JSON.parse(raw) as unknown;
    const items = valueAtPath(payload, config.itemsPath || "") as unknown;
    if (!Array.isArray(items)) throw new Error("Provider payload did not contain an array at configJson.itemsPath.");
    return items.filter((item): item is RawListing => Boolean(item && typeof item === "object"));
  },
  async normalizeListing(raw, search, source) { return normalizeRawListing(raw, search, source, parseSourceConfig(source.configJson)); },
};
