import type { Deal } from "@/types/snagd";

export type ListingSourceAdapter = { id: string; label: string; search: () => Promise<Deal[]> };

export const listingSourceService = {
  async collect(adapters: ListingSourceAdapter[]) {
    const batches = await Promise.all(adapters.map((adapter) => adapter.search()));
    return batches.flat();
  },
};
