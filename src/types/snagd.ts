export type Recommendation = "BUY" | "MAYBE" | "PASS";
export type RiskLevel = "Low" | "Medium" | "High";
export type ConfidenceLevel = "Low" | "Medium" | "High";

export type Deal = {
  id: string;
  itemName: string;
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
  condition: string;
  timePosted: string;
  reason: string;
  note?: string;
};

export type Alert = {
  id: string;
  type: string;
  item: string;
  score: number;
  profit: string;
  distance: string;
  timePosted: string;
  why: string;
  severity: "profit" | "amber" | "risk" | "info";
};

export type Watchlist = {
  id: string;
  name: string;
  nichePreset: string;
  everythingMode: boolean;
  location: string;
  radius: number;
  maxPickupDistance: number;
  category: string;
  includeKeywords: string;
  excludeKeywords: string;
  maxBuyPrice: number;
  minimumEstimatedProfit: number;
  minimumSnagdScore: number;
  conditionPreference: string;
  alertSpeedPreference: string;
  notificationMethod: string;
};

export type PricingPlan = {
  id: "founder" | "pro" | "power";
  name: string;
  price: number;
  summary: string;
  features: string[];
  highlighted?: boolean;
};

export type UsageSummary = {
  plan: string;
  dealChecksUsed: number;
  dealChecksLimit: number;
  watchlistsUsed: number;
  watchlistsLimit: number;
  everythingMode: boolean;
  billingCycleEnds: string;
};

export type CreatorStats = {
  creatorCode: string;
  referralClicks: number;
  trialSignups: number;
  paidSubscribers: number;
  activeSubscribers: number;
  monthlyRecurringCommission: number;
  estimatedPayout: number;
  conversionRate: number;
};

export type OnboardingProfile = {
  preset: string;
  location: string;
  searchRadius: number;
  maxPickupDistance: number;
  maxBuyPrice: number;
  minimumProfitTarget: number;
  minimumSnagdScore: number;
  alertPreference: string;
  everythingMode: boolean;
};

export type DealAnalysisInput = {
  title: string;
  askingPrice: number;
  category: string;
  condition: string;
  location: string;
  description: string;
  listingUrl?: string;
  estimatedPickupDistance: number;
  notes?: string;
};

export type DealAnalysisResult = {
  recommendation: Recommendation;
  snagdScore: number;
  askingPrice: number;
  estimatedResaleValue: number;
  estimatedProfit: number;
  suggestedMaxOffer: number;
  confidenceLevel: ConfidenceLevel;
  riskLevel: RiskLevel;
  pickupCostEstimate: number;
  repairCostEstimate: number;
  timeToSellEstimate: string;
  suggestedSellerMessage: string;
  redFlags: string[];
  explanation: string;
};

export type VehicleVinResult = {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyClass: string;
  engine: string;
  recalls: string[];
  marketValueRange: string;
  privatePartyComps: string;
  titleHistoryRisk: RiskLevel;
  mileageRisk: RiskLevel;
  repairRisks: string[];
  suggestedMaxOffer: number;
  estimatedFlipProfit: string;
  walkAwayWarnings: string[];
};