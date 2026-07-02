import type { CrawlerConfig, CrawlerEnv, SourceConfig } from "./types.ts";

function numberValue(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function booleanValue(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

export function getCrawlerConfig(env: CrawlerEnv): CrawlerConfig {
  return {
    enabled: booleanValue(env.CRAWLER_ENABLED, true),
    intervalMinutes: numberValue(env.CRAWLER_INTERVAL_MINUTES, 30, 5, 10080),
    mockMarketplaceEnabled: booleanValue(env.MOCK_MARKETPLACE_ENABLED, false),
    maxResultsPerRun: numberValue(env.MAX_CRAWLER_RESULTS_PER_RUN, 50, 1, 250),
    requestTimeoutMs: numberValue(env.CRAWLER_REQUEST_TIMEOUT_MS, 12000, 1000, 60000),
    userAgent: env.CRAWLER_USER_AGENT || "SnagdCrawler/1.0 (+https://snagd.app/crawler-policy)",
  };
}

export function parseSourceConfig(configJson: string): SourceConfig {
  try { return JSON.parse(configJson || "{}") as SourceConfig; } catch { throw new Error("Source configJson is not valid JSON."); }
}
