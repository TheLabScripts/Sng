import type { ListingSourceAdapter } from "./listingSourceService";

export const marketplaceSourceAdapter: ListingSourceAdapter = {
  id: "marketplace-adapter",
  label: "Marketplace source",
  async search() { return []; },
};
