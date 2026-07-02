import { parseSourceConfig } from "../config.ts";
import type { CrawlerAdapter } from "../types.ts";
import { htmlSnapshotAdapter } from "./htmlSnapshotAdapter.ts";
import { providerJsonAdapter } from "./providerJsonAdapter.ts";

export const facebookMarketplaceAdapter: CrawlerAdapter = {
  name: "Facebook Marketplace Adapter Placeholder",
  sourceType: "facebook_placeholder",
  buildSearchUrl(search, source) {
    const config = parseSourceConfig(source.configJson);
    return config.mode === "provider" ? providerJsonAdapter.buildSearchUrl(search, source) : htmlSnapshotAdapter.buildSearchUrl(search, source);
  },
  async fetchListings(search, source, env) {
    const config = parseSourceConfig(source.configJson);
    if (config.mode === "provider") return providerJsonAdapter.fetchListings(search, source, env);
    if (config.mode === "snapshot") return htmlSnapshotAdapter.fetchListings(search, source, env);
    throw new Error("Facebook adapter only supports compliant provider JSON or user-provided HTML snapshot mode. Live login/browser crawling is intentionally not implemented.");
  },
  async parseListings(raw, search, source) {
    return parseSourceConfig(source.configJson).mode === "provider" ? providerJsonAdapter.parseListings(raw, search, source) : htmlSnapshotAdapter.parseListings(raw, search, source);
  },
  async normalizeListing(raw, search, source) {
    return parseSourceConfig(source.configJson).mode === "provider" ? providerJsonAdapter.normalizeListing(raw, search, source) : htmlSnapshotAdapter.normalizeListing(raw, search, source);
  },
};

// TODO: Connect live Facebook inventory only through written Meta authorization,
// a licensed data provider, or an explicit user-authorized import flow. Do not add
// credential automation, CAPTCHA bypass, proxy rotation, or ban-evasion behavior.
