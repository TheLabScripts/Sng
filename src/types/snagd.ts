export type Recommendation = "BUY" | "MAYBE" | "PASS";
export type RiskLevel = "Low" | "Medium" | "High";
export type ConfidenceLevel = "Low" | "Medium" | "High";
export type DemandLevel = "Low" | "Medium" | "High";
export type CompetitionLevel = "Low" | "Medium" | "High";
export type DealStatus = "New" | "Saved" | "Messaged Seller" | "Planning Pickup" | "Bought" | "Passed" | "Lost / Sold to Someone Else" | "Listed for Resale" | "Sold";

export type SimilarSale = {
  id: string;
  itemTitle: string;
  thumbnailTone: string;
  price: number;
  condition: string;
  source: string;
  date: string;
  matchConfidence: ConfidenceLevel;
  notes: string;
};

export type Deal = {
  id: string;
  itemName: string;
  thumbnailTone: string;
  sellerRating?: string;
  listingUrl?: string;
  messageUrl?: string;
  askingPrice: number;
  askingLabel: string;
  estimatedResale: string;
  estimatedResaleLow: number;
  estimatedResaleHigh: number;
  estimatedProfit: string;
  estimatedProfitLow: number;
  estimatedProfitHigh: number;
  score: number;
  recommendation: Recommendation;
  distance: string;
  distanceMiles: number;
  risk: RiskLevel;
  source: string;
  category: string;
  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleMileage?: number;
  cleanTitle?: boolean;
  vinChecked?: boolean;
  auctionHistorySignals?: boolean;
  priceDropped?: boolean;
  condition: string;
  timePosted: string;
  reason: string;
  note?: string;
  similarSalesCount: number;
  underMarketPercent: number;
  demand: DemandLevel;
  competition: CompetitionLevel;
  confidence: ConfidenceLevel;
  reasonTags: string[];
  similarSales: SimilarSale[];
  status?: DealStatus;
  dataOrigin?: "demo" | "crawler" | "provider";
  imageUrls?: string[];
  crawlerListingId?: string;
  riskFlags?: string[];
  estimatedCosts?: number;
  suggestedMaxBuyPrice?: number;
  suggestedSellerMessage?: string;
};

export type CrawlerSavedSearch = {
  id: string; userId: string; name: string; zipCode: string; radiusMiles: number; category: string; keywords: string;
  negativeKeywords: string; minPrice: number; maxPrice: number; minEstimatedProfit: number; minDealScore: number;
  isActive: boolean; scanIntervalMinutes: number; lastScannedAt: string | null; createdAt: string; updatedAt: string; matchCount?: number;
};

export type CrawlerListing = {
  id: string; source: string; externalId?: string | null; sourceUrl: string; title: string; description: string;
  price: number | null; currency: string; locationText: string; zipCode?: string | null; distanceMiles?: number | null;
  category: string; imageUrls: string[]; sellerName?: string | null; postedAt?: string | null; scrapedAt: string;
  savedSearchId: string; estimatedResalePrice: number; estimatedCosts: number; estimatedProfit: number; dealScore: number;
  reason: string; riskFlags: string[]; status: "new" | "saved" | "ignored" | "contacted" | "bought" | "sold";
};

export type CrawlerAlert = {
  id: string; listing_match_id: string; listing_id: string; saved_search_id: string; listing_title: string; source_url: string; image_urls: string;
  deal_score: number; estimated_profit: number; title: string; body: string;
  status: "unread" | "read" | "muted" | "sent" | "failed"; created_at: string; source?: string;
};

export type Alert = { id: string; type: string; item: string; score: number; profit: string; distance: string; timePosted: string; why: string; severity: "profit" | "amber" | "risk" | "info"; };
export type Watchlist = { id: string; name: string; nichePreset: string; everythingMode: boolean; location: string; radius: number; maxPickupDistance: number; category: string; includeKeywords: string; excludeKeywords: string; maxBuyPrice: number; minimumEstimatedProfit: number; minimumSnagdScore: number; conditionPreference: string; alertSpeedPreference: string; notificationMethod: string; producingDeals?: number; hotToday?: boolean; };
export type PricingPlan = { id: "starter" | "pro" | "power"; name: string; price: number; monthlyPrice: number; annualPrice: number; annualSavings: number; annualLabel: string; summary: string; features: string[]; monthlyLimits: string[]; highlighted?: boolean; badge?: string; trialDays: number; };
export type UsageSummary = { plan: string; dealChecksUsed: number; dealChecksLimit: number; watchlistsUsed: number; watchlistsLimit: number; everythingMode: boolean; billingCycleEnds: string; vinChecksUsed?: number; vinChecksLimit?: number; };
export type CreatorStats = { creatorCode: string; referralLink: string; referralClicks: number; trialSignups: number; paidSubscribers: number; activeSubscribers: number; monthlyRecurringCommission: number; lifetimeCommission: number; estimatedPayout: number; payoutStatus: string; nextPayoutDate: string; conversionRate: number; };
export type OnboardingProfile = { preset: string; location: string; searchRadius: number; maxPickupDistance: number; maxBuyPrice: number; minimumProfitTarget: number; minimumSnagdScore: number; alertPreference: string; everythingMode: boolean; automotiveMode?: boolean; defaultFeedCategories?: string[]; };
export type DealAnalysisInput = { title: string; askingPrice: number; category: string; condition: string; location: string; description: string; listingUrl?: string; estimatedPickupDistance: number; notes?: string; };
export type DealAnalysisResult = { recommendation: Recommendation; snagdScore: number; askingPrice: number; estimatedResaleValue: number; estimatedProfit: number; suggestedMaxOffer: number; confidenceLevel: ConfidenceLevel; riskLevel: RiskLevel; pickupCostEstimate: number; repairCostEstimate: number; timeToSellEstimate: string; suggestedSellerMessage: string; redFlags: string[]; explanation: string; similarSalesCount: number; underMarketPercent: number; demand: DemandLevel; competition: CompetitionLevel; similarSales: SimilarSale[]; };
export type FieldScanResult = { id: string; itemDetected: string; confidence: ConfidenceLevel; suggestedCategory: string; estimatedRetailPrice: number; estimatedResalePrice: string; likelySaleRange: string; recentSimilarSales: SimilarSale[]; basedOnSales: number; sellThroughSpeed: string; suggestedMaxBuyPrice: number; estimatedProfit: string; demand: DemandLevel; recommendation: Recommendation; riskNotes: string[]; };
export type LifetimeStats = { lifetimeEarnings: number; lifetimeProfit: number; monthlyProfit: number; weeklyProfitOpportunities: number; averageProfitPerFlip: number; bestCategory: string; bestDeal: string; dealsBought: number; dealsSold: number; dealsPassed: number; dealsLost: number; estimatedMissedProfit: number; savedDealsCount: number; activeWatchlists: number; totalDealsTracked: number; winRate: number; totalEstimatedOpportunitiesFound: number; dealStreak: string; profitStreak: string; weeklyActionStreak: string; };
export type TrendingCategory = { name: string; newDeals: number; averageProfit: number; demand: DemandLevel; trend: "up" | "steady" | "down"; };
export type PriceAlert = { id: string; copy: string; item: string; impact: string; };
export type VehicleRecall = {
  campaignNumber: string;
  component: string;
  summary: string;
  consequence?: string;
  remedy?: string;
};

export type VehicleVinResult = {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyClass: string;
  engine: string;
  driveType?: string;
  fuelType?: string;
  transmission?: string;
  plantLocation?: string;
  manufacturer?: string;
  decodeMessage?: string;
  recallDetails?: VehicleRecall[];
  recalls: string[];
  marketValueRange: string;
  privatePartyComps: string;
  titleHistoryRisk: RiskLevel;
  mileageRisk: RiskLevel;
  repairRisks: string[];
  suggestedMaxOffer: number;
  estimatedFlipProfit: string;
  walkAwayWarnings: string[];
  askingPrice?: number;
  riskLevel?: RiskLevel;
  marketDemand?: DemandLevel;
  comparableVehicleCount?: number;
  daysToSellEstimate?: string;
  intelligenceSummary?: string;
  recommendation?: Recommendation;
  savedChecks?: number;
};
