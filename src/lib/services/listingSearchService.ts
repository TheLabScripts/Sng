import type { Deal } from "@/types/snagd";
import { listingFilterService, type ListingFilters } from "./listingFilterService";

export const listingSearchService = {
  search(listings: Deal[], filters: ListingFilters, savedIds: string[] = []) {
    return listingFilterService.filter(listings, filters, savedIds);
  },
};
