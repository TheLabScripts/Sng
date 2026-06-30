import type { FieldScanResult, LifetimeStats, PriceAlert, TrendingCategory } from "@/types/snagd";
import { mockDeals, savedDealSeeds, similarSales } from "./deals";

export const todaysProfitOpportunities = {
  total: 847,
  highScoreDeals: mockDeals.filter((deal) => deal.score >= 76).length,
  lastHourDeals: 12,
  underMarketDeals: 3,
};

export const priceAlerts: PriceAlert[] = [
  { id: "price-sectional", item: "2021 Camry XLE", copy: "2021 Camry XLE is 32% under market", impact: "Message seller before this disappears" },
  { id: "price-tools", item: "PS5 Disc console", copy: "PS5 Disc console is $140 under resale midpoint", impact: "Electronics watchlist is moving fast today" },
  { id: "price-dresser", item: "Free dresser", copy: "Free dresser has $90 resale potential", impact: "Pickup space is the only blocker" },
];

export const trendingCategories: TrendingCategory[] = [
  { name: "Furniture", newDeals: 14, averageProfit: 118, demand: "High", trend: "up" },
  { name: "Tools", newDeals: 9, averageProfit: 96, demand: "High", trend: "up" },
  { name: "Electronics", newDeals: 11, averageProfit: 54, demand: "Medium", trend: "steady" },
  { name: "Free items", newDeals: 7, averageProfit: 72, demand: "Medium", trend: "up" },
  { name: "Vehicles", newDeals: 4, averageProfit: 820, demand: "High", trend: "steady" },
  { name: "Appliances", newDeals: 6, averageProfit: 88, demand: "Medium", trend: "steady" },
];

export const lifetimeStats: LifetimeStats = {
  lifetimeEarnings: 12840,
  lifetimeProfit: 4685,
  monthlyProfit: 1240,
  weeklyProfitOpportunities: 2240,
  averageProfitPerFlip: 146,
  bestCategory: "Vehicles",
  bestDeal: "2021 Toyota Camry XLE",
  dealsBought: 38,
  dealsSold: 32,
  dealsPassed: 71,
  dealsLost: 14,
  estimatedMissedProfit: 920,
  savedDealsCount: savedDealSeeds.length,
  activeWatchlists: 4,
  totalDealsTracked: 155,
  winRate: 64,
  totalEstimatedOpportunitiesFound: 18460,
  dealStreak: "3 days checking profitable deals",
  profitStreak: "5 profitable opportunities reviewed this week",
  weeklyActionStreak: "2 flips logged this month",
};

export const fieldScanResult: FieldScanResult = {
  id: "scan-breville",
  itemDetected: "Breville Barista Express espresso machine",
  confidence: "High",
  suggestedCategory: "Appliances",
  estimatedRetailPrice: 699,
  estimatedResalePrice: "$260-$340",
  likelySaleRange: "$245-$325",
  recentSimilarSales: similarSales,
  basedOnSales: 37,
  sellThroughSpeed: "3-7 days",
  suggestedMaxBuyPrice: 170,
  estimatedProfit: "$80-$145",
  demand: "High",
  recommendation: "BUY",
  riskNotes: ["Ask to see water flow", "Check grinder sound", "Look for missing portafilter", "Confirm no leak under tray"],
};

export const savedFieldScans = [fieldScanResult];
export const savedVehicleChecks = ["2012 Honda Civic", "2008 Toyota Tacoma"];


