import type { ListingSourceAdapter } from "./listingSourceService";

export const realListingsProvider: ListingSourceAdapter = {
  id: "real-listings-provider",
  label: "Connected listings",
  async search() {
    // Future server-side boundary for approved APIs, licensed feeds, user links, email ingestion, or extension input.
    return [];
  },
};
