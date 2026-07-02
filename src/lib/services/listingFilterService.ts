import type { Deal, RiskLevel } from "@/types/snagd";

export type PostedWithin = "Any time" | "Last hour" | "Today" | "3 days" | "Week";
export type ListingFilters = {
  category: string; keyword: string; includeKeywords: string; excludeKeywords: string;
  priceMin: number; priceMax: number; radius: number; postedWithin: PostedWithin;
  minimumScore: number; minimumProfit: number; minimumUnderMarket: number;
  condition: string; sellerRating: string; source: string;
  savedOnly: boolean; priceDropsOnly: boolean; freeOnly: boolean;
  yearMin: number; yearMax: number; make: string; model: string; mileageMax: number;
  vehiclePriceMax: number; vehicleProfitMin: number; titleRisk: "Any" | RiskLevel;
  cleanTitleOnly: boolean; vinCheckedOnly: boolean; auctionSignalsOnly: boolean;
};

export const defaultListingFilters: ListingFilters = {
  category: "Smart Picks", keyword: "", includeKeywords: "", excludeKeywords: "", priceMin: 0, priceMax: 0,
  radius: 25, postedWithin: "Any time", minimumScore: 0, minimumProfit: 0, minimumUnderMarket: 0,
  condition: "Any", sellerRating: "Any", source: "Any", savedOnly: false, priceDropsOnly: false, freeOnly: false,
  yearMin: 0, yearMax: 0, make: "", model: "", mileageMax: 0, vehiclePriceMax: 0, vehicleProfitMin: 0,
  titleRisk: "Any", cleanTitleOnly: false, vinCheckedOnly: false, auctionSignalsOnly: false,
};

function terms(value: string) { return value.toLowerCase().split(/[,\s]+/).filter(Boolean); }
function postedHours(value: string) { const amount = Number.parseFloat(value) || 0; return value.includes("min") ? amount / 60 : value.includes("day") ? amount * 24 : amount; }
function allowedHours(value: PostedWithin) { return value === "Last hour" ? 1 : value === "Today" ? 24 : value === "3 days" ? 72 : value === "Week" ? 168 : Infinity; }
function vehicleYear(deal: Deal) { return deal.vehicleYear || Number(deal.itemName.match(/\b(19|20)\d{2}\b/)?.[0] || 0); }

export const listingFilterService = {
  filter(deals: Deal[], filters: ListingFilters, savedIds: string[]) {
    const include = terms(filters.includeKeywords);
    const exclude = terms(filters.excludeKeywords);
    return deals.filter((deal) => {
      const searchable = `${deal.itemName} ${deal.category} ${deal.condition} ${deal.reason} ${deal.reasonTags.join(" ")}`.toLowerCase();
      const isVehicle = deal.category === "Vehicle";
      const year = vehicleYear(deal);
      if (filters.category === "Smart Picks" && deal.score < 76 && deal.recommendation !== "BUY") return false;
      if (!["Smart Picks", "Everything", "Watchlists"].includes(filters.category) && filters.category !== "Free" && !deal.category.toLowerCase().includes(filters.category.toLowerCase().replace(/s$/, ""))) return false;
      if (filters.category === "Free" && deal.askingPrice !== 0) return false;
      if (filters.keyword && !searchable.includes(filters.keyword.toLowerCase())) return false;
      if (include.some((word) => !searchable.includes(word)) || exclude.some((word) => searchable.includes(word))) return false;
      if (filters.priceMin && deal.askingPrice < filters.priceMin) return false;
      if (filters.priceMax && deal.askingPrice > filters.priceMax) return false;
      if (deal.distanceMiles > filters.radius || postedHours(deal.timePosted) > allowedHours(filters.postedWithin)) return false;
      if (deal.score < filters.minimumScore || deal.estimatedProfitLow < filters.minimumProfit || deal.underMarketPercent < filters.minimumUnderMarket) return false;
      if (filters.condition !== "Any" && deal.condition !== filters.condition) return false;
      if (filters.sellerRating !== "Any" && !deal.sellerRating?.toLowerCase().includes(filters.sellerRating.toLowerCase())) return false;
      if (filters.source !== "Any" && deal.source !== filters.source) return false;
      if (filters.savedOnly && !savedIds.includes(deal.id)) return false;
      if (filters.priceDropsOnly && !deal.priceDropped && !deal.reasonTags.some((tag) => tag.toLowerCase().includes("price drop"))) return false;
      if (filters.freeOnly && deal.askingPrice !== 0) return false;
      if (isVehicle && filters.yearMin && year < filters.yearMin) return false;
      if (isVehicle && filters.yearMax && year > filters.yearMax) return false;
      if (isVehicle && filters.make && !`${deal.vehicleMake || ""} ${deal.itemName}`.toLowerCase().includes(filters.make.toLowerCase())) return false;
      if (isVehicle && filters.model && !`${deal.vehicleModel || ""} ${deal.itemName}`.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (isVehicle && filters.mileageMax && (deal.vehicleMileage || Infinity) > filters.mileageMax) return false;
      if (isVehicle && filters.vehiclePriceMax && deal.askingPrice > filters.vehiclePriceMax) return false;
      if (isVehicle && filters.vehicleProfitMin && deal.estimatedProfitLow < filters.vehicleProfitMin) return false;
      if (isVehicle && filters.titleRisk !== "Any" && deal.risk !== filters.titleRisk) return false;
      if (isVehicle && filters.cleanTitleOnly && !deal.cleanTitle) return false;
      if (isVehicle && filters.vinCheckedOnly && !deal.vinChecked) return false;
      if (isVehicle && filters.auctionSignalsOnly && !deal.auctionHistorySignals) return false;
      return true;
    });
  },
};
