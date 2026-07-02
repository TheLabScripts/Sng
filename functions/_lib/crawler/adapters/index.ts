import type { CrawlerAdapter, SourceType } from "../types.ts";
import { facebookMarketplaceAdapter } from "./facebookMarketplaceAdapter.ts";
import { genericPublicListingsAdapter } from "./genericPublicListingsAdapter.ts";
import { htmlSnapshotAdapter } from "./htmlSnapshotAdapter.ts";
import { mockMarketplaceAdapter } from "./mockMarketplaceAdapter.ts";
import { providerJsonAdapter } from "./providerJsonAdapter.ts";

const adapters: Record<SourceType, CrawlerAdapter> = {
  mock: mockMarketplaceAdapter,
  html_snapshot: htmlSnapshotAdapter,
  generic_public: genericPublicListingsAdapter,
  facebook_placeholder: facebookMarketplaceAdapter,
  provider_json: providerJsonAdapter,
};

export function getCrawlerAdapter(sourceType: SourceType) {
  const adapter = adapters[sourceType];
  if (!adapter) throw new Error(`No crawler adapter registered for ${sourceType}.`);
  return adapter;
}

export { facebookMarketplaceAdapter, genericPublicListingsAdapter, htmlSnapshotAdapter, mockMarketplaceAdapter, providerJsonAdapter };
