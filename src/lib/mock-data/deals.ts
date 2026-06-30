import type { Deal, SimilarSale } from "@/types/snagd";

export const similarSales: SimilarSale[] = [
  { id: "sale-sectional-1", itemTitle: "Brown leather sectional, clean", thumbnailTone: "violet", price: 260, condition: "Good", source: "Mock sold comp", date: "Jun 26", matchConfidence: "High", notes: "Similar size, fast local pickup." },
  { id: "sale-sectional-2", itemTitle: "Leather corner couch", thumbnailTone: "blue", price: 235, condition: "Good", source: "Mock sold comp", date: "Jun 21", matchConfidence: "High", notes: "Minor wear on arm." },
  { id: "sale-tools-1", itemTitle: "Milwaukee M18 drill bundle", thumbnailTone: "amber", price: 285, condition: "Good", source: "Mock sold comp", date: "Jun 28", matchConfidence: "High", notes: "Battery count drove price." },
  { id: "sale-phone-1", itemTitle: "iPhone 12 cracked but unlocked", thumbnailTone: "red", price: 245, condition: "Damaged", source: "Mock sold comp", date: "Jun 19", matchConfidence: "Medium", notes: "Repair cost varied by buyer." },
];

function salesFor(kind: string) {
  if (kind === "tools") return [similarSales[2], similarSales[0], similarSales[1]];
  if (kind === "phone") return [similarSales[3], similarSales[2], similarSales[1]];
  return [similarSales[0], similarSales[1], similarSales[2]];
}

export const mockDeals: Deal[] = [
  {
    id: "deal-leather-sectional", itemName: "Leather sectional couch", thumbnailTone: "violet", sellerRating: "4.8 seller", listingUrl: "https://example.com/snagd/source/leather-sectional", askingPrice: 90, askingLabel: "$90", estimatedResale: "$220-$280", estimatedResaleLow: 220, estimatedResaleHigh: 280, estimatedProfit: "$100-$150", estimatedProfitLow: 100, estimatedProfitHigh: 150, score: 91, recommendation: "BUY", distance: "7 miles", distanceMiles: 7, risk: "Low", source: "Source placeholder", category: "Furniture", condition: "Good", timePosted: "12 min ago", reason: "Low buy price, clean photos, strong local resale demand, and short pickup distance.", similarSalesCount: 42, underMarketPercent: 32, demand: "High", competition: "Low", confidence: "High", reasonTags: ["Under market by 32%", "Based on 42 similar sales", "High resale demand", "Listed 12 minutes ago", "Low competition", "Minor wear only", "Strong margin"], similarSales: salesFor("furniture")
  },
  {
    id: "deal-milwaukee-tools", itemName: "Milwaukee tool bundle", thumbnailTone: "amber", sellerRating: "New seller", listingUrl: "https://example.com/snagd/source/milwaukee-tools", askingPrice: 140, askingLabel: "$140", estimatedResale: "$240-$300", estimatedResaleLow: 240, estimatedResaleHigh: 300, estimatedProfit: "$75-$120", estimatedProfitLow: 75, estimatedProfitHigh: 120, score: 84, recommendation: "BUY", distance: "12 miles", distanceMiles: 12, risk: "Medium", source: "Manual source layer", category: "Tools", condition: "Good", timePosted: "28 min ago", reason: "Recognizable brand bundle with enough margin after pickup and basic testing.", similarSalesCount: 31, underMarketPercent: 26, demand: "High", competition: "Medium", confidence: "High", reasonTags: ["Based on 31 similar sales", "Strong margin", "Seller urgency detected", "Fast sell-through", "Test batteries before pickup"], similarSales: salesFor("tools")
  },
  {
    id: "deal-iphone-12", itemName: "iPhone 12 cracked screen", thumbnailTone: "red", sellerRating: "4.6 seller", listingUrl: "https://example.com/snagd/source/iphone-12", askingPrice: 180, askingLabel: "$180", estimatedResale: "$220-$280", estimatedResaleLow: 220, estimatedResaleHigh: 280, estimatedProfit: "$10-$55", estimatedProfitLow: 10, estimatedProfitHigh: 55, score: 58, recommendation: "MAYBE", distance: "5 miles", distanceMiles: 5, risk: "High", source: "User supplied listing", category: "Electronics", condition: "Damaged", timePosted: "41 min ago", reason: "Repair uncertainty and activation risk leave only a thin profit window.", similarSalesCount: 18, underMarketPercent: 9, demand: "Medium", competition: "High", confidence: "Medium", reasonTags: ["Risk: repair cost unknown", "Risk: missing condition details", "Thin margin", "Verify activation lock"], similarSales: salesFor("phone")
  },
  {
    id: "deal-free-dresser", itemName: "Free dresser", thumbnailTone: "blue", sellerRating: "4.9 seller", listingUrl: "https://example.com/snagd/source/free-dresser", askingPrice: 0, askingLabel: "Free", estimatedResale: "$60-$120", estimatedResaleLow: 60, estimatedResaleHigh: 120, estimatedProfit: "$45-$90", estimatedProfitLow: 45, estimatedProfitHigh: 90, score: 78, recommendation: "BUY", distance: "9 miles", distanceMiles: 9, risk: "Medium", source: "Source placeholder", category: "Furniture", condition: "Fair", timePosted: "1 hr ago", reason: "Free inventory with resale upside if pickup space and cleaning time are available.", note: "Needs pickup space and possible cleaning.", similarSalesCount: 24, underMarketPercent: 100, demand: "Medium", competition: "Low", confidence: "Medium", reasonTags: ["Free item with resale potential", "Needs pickup space", "Cleaning likely", "Low competition"], similarSales: salesFor("furniture")
  },
  {
    id: "deal-honda-civic", itemName: "2012 Honda Civic", thumbnailTone: "violet", sellerRating: "4.7 seller", listingUrl: "https://example.com/snagd/source/honda-civic", askingPrice: 2400, askingLabel: "$2,400", estimatedResale: "$3,400-$4,200", estimatedResaleLow: 3400, estimatedResaleHigh: 4200, estimatedProfit: "$550-$1,100", estimatedProfitLow: 550, estimatedProfitHigh: 1100, score: 76, recommendation: "MAYBE", distance: "18 miles", distanceMiles: 18, risk: "High", source: "Vehicle source placeholder", category: "Vehicle", condition: "Runs and drives", timePosted: "2 hrs ago", reason: "Possible upside, but title, history, mileage, and repair checks decide the buy.", note: "Vehicle Mode requires VIN/title/history checks before buying.", similarSalesCount: 15, underMarketPercent: 22, demand: "High", competition: "Medium", confidence: "Medium", reasonTags: ["Vehicle check required", "Title/history risk", "Strong upside if clean", "Repair cost unknown"], similarSales: salesFor("tools")
  },
  {
    id: "deal-espresso-machine", itemName: "Breville espresso machine", thumbnailTone: "blue", sellerRating: "4.9 seller", listingUrl: "https://example.com/snagd/source/breville", askingPrice: 110, askingLabel: "$110", estimatedResale: "$190-$240", estimatedResaleLow: 190, estimatedResaleHigh: 240, estimatedProfit: "$55-$95", estimatedProfitLow: 55, estimatedProfitHigh: 95, score: 81, recommendation: "BUY", distance: "4 miles", distanceMiles: 4, risk: "Medium", source: "Manual source layer", category: "Appliances", condition: "Good", timePosted: "3 hrs ago", reason: "Compact item, proven demand, and manageable testing checklist.", similarSalesCount: 28, underMarketPercent: 24, demand: "High", competition: "Medium", confidence: "High", reasonTags: ["Fast sell-through", "Based on 28 similar sales", "Test pump pressure", "Strong margin"], similarSales: salesFor("tools")
  },
];

export const bestDealToday = mockDeals[0];
export const savedDealSeeds = [mockDeals[0], mockDeals[3], mockDeals[4]];
