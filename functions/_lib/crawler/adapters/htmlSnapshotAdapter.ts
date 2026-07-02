import { getCrawlerConfig, parseSourceConfig } from "../config.ts";
import type { CrawlerAdapter } from "../types.ts";
import { parseHtmlWithSelectors } from "./htmlParser.ts";
import { normalizeRawListing } from "./utils.ts";

export const htmlSnapshotAdapter: CrawlerAdapter = {
  name: "HTML Snapshot Adapter",
  sourceType: "html_snapshot",
  buildSearchUrl(_search, source) { return parseSourceConfig(source.configJson).snapshotUrl || source.baseUrl; },
  async fetchListings(search, source, env) {
    const config = parseSourceConfig(source.configJson);
    if (config.snapshotHtml) return this.parseListings(config.snapshotHtml, search, source);
    const snapshotUrl = this.buildSearchUrl(search, source);
    if (!snapshotUrl) throw new Error("HTML snapshot source requires snapshotUrl, baseUrl, or snapshotHtml.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getCrawlerConfig(env).requestTimeoutMs);
    try {
      const response = await fetch(snapshotUrl, { signal: controller.signal });
      if (!response.ok) throw new Error(`Snapshot returned HTTP ${response.status}.`);
      return this.parseListings(await response.text(), search, source);
    } finally { clearTimeout(timeout); }
  },
  async parseListings(raw, _search, source) {
    if (Array.isArray(raw)) return raw;
    const config = parseSourceConfig(source.configJson);
    return parseHtmlWithSelectors(raw, config.selectors, source.baseUrl || config.snapshotUrl || "");
  },
  async normalizeListing(raw, search, source) { return normalizeRawListing(raw, search, source, parseSourceConfig(source.configJson)); },
};
