import type { ConfidenceLevel, DealAnalysisInput, DealAnalysisResult, Recommendation, RiskLevel } from "@/types/snagd";

const commonFastFlipTerms = [
  "couch",
  "sectional",
  "dresser",
  "milwaukee",
  "dewalt",
  "makita",
  "nintendo",
  "iphone",
  "washer",
  "dryer",
  "espresso",
  "bike",
];

export function analyzeDeal(input: DealAnalysisInput): DealAnalysisResult {
  const title = input.title.toLowerCase();
  const description = input.description.toLowerCase();
  const combined = `${title} ${description} ${input.category.toLowerCase()} ${input.condition.toLowerCase()}`;
  const askingPrice = Math.max(0, Number.isFinite(input.askingPrice) ? input.askingPrice : 0);
  const distance = Math.max(0, Number.isFinite(input.estimatedPickupDistance) ? input.estimatedPickupDistance : 0);

  const resaleValue = estimateResaleValue(combined, askingPrice);
  const pickupCost = Math.round(distance * 1.25 + (distance > 18 ? 12 : 5));
  const repairCost = estimateRepairCost(combined, input.condition);
  const estimatedProfit = Math.round(resaleValue - askingPrice - pickupCost - repairCost);
  const riskLevel = estimateRisk(combined, input.condition, estimatedProfit, askingPrice);
  const confidenceLevel = estimateConfidence(combined, input.description, input.listingUrl);

  const margin = askingPrice === 0 ? estimatedProfit / 75 : estimatedProfit / Math.max(askingPrice, 1);
  const commonBonus = commonFastFlipTerms.some((term) => combined.includes(term)) ? 9 : 0;
  const freeBonus = askingPrice === 0 && resaleValue > 60 ? 12 : 0;
  const vehicleBonus = isVehicle(combined) && estimatedProfit > 500 ? 7 : 0;
  const distancePenalty = distance > 30 ? 16 : distance > 18 ? 9 : distance > 10 ? 4 : 0;
  const riskPenalty = riskLevel === "High" ? 16 : riskLevel === "Medium" ? 6 : 0;
  const profitScore = Math.min(34, Math.max(-22, estimatedProfit / 5));
  const marginScore = Math.min(18, Math.max(-18, margin * 20));

  const snagdScore = clampScore(
    Math.round(48 + profitScore + marginScore + commonBonus + freeBonus + vehicleBonus - distancePenalty - riskPenalty),
  );
  const recommendation = getRecommendation(snagdScore, riskLevel, estimatedProfit);
  const suggestedMaxOffer = Math.max(0, Math.round(resaleValue * 0.62 - pickupCost - repairCost));
  const redFlags = buildRedFlags(combined, riskLevel, estimatedProfit, distance, askingPrice);

  return {
    recommendation,
    snagdScore,
    askingPrice,
    estimatedResaleValue: resaleValue,
    estimatedProfit,
    suggestedMaxOffer,
    confidenceLevel,
    riskLevel,
    pickupCostEstimate: pickupCost,
    repairCostEstimate: repairCost,
    timeToSellEstimate: estimateTimeToSell(combined, riskLevel),
    suggestedSellerMessage: buildSellerMessage(input.title, suggestedMaxOffer),
    redFlags,
    explanation: buildExplanation(recommendation, estimatedProfit, distance, riskLevel, confidenceLevel, askingPrice),
  };
}

function estimateResaleValue(combined: string, askingPrice: number) {
  if (isVehicle(combined)) return 3850;
  if (combined.includes("milwaukee") || combined.includes("dewalt") || combined.includes("makita")) return 275;
  if (combined.includes("sectional") || combined.includes("couch") || combined.includes("sofa")) return 250;
  if (combined.includes("iphone") && combined.includes("crack")) return 255;
  if (combined.includes("iphone")) return 335;
  if (combined.includes("dresser") && askingPrice === 0) return 95;
  if (combined.includes("dresser")) return 125;
  if (combined.includes("espresso") || combined.includes("breville")) return 215;
  if (combined.includes("washer") || combined.includes("dryer") || combined.includes("appliance")) return 260;
  if (askingPrice === 0) return 85;
  return Math.round(Math.max(askingPrice * 1.65, askingPrice + 55));
}

function estimateRepairCost(combined: string, condition: string) {
  const normalizedCondition = condition.toLowerCase();
  let cost = 0;
  if (combined.includes("crack") || combined.includes("screen")) cost += 75;
  if (combined.includes("broken") || combined.includes("parts")) cost += 90;
  if (combined.includes("clean") || normalizedCondition.includes("fair")) cost += 18;
  if (normalizedCondition.includes("damaged")) cost += 70;
  if (isVehicle(combined)) cost += 425;
  return cost;
}

function estimateRisk(combined: string, condition: string, profit: number, askingPrice: number): RiskLevel {
  const normalizedCondition = condition.toLowerCase();
  if (isVehicle(combined)) return "High";
  if (combined.includes("no title") || combined.includes("locked") || combined.includes("crack")) return "High";
  if (normalizedCondition.includes("damaged") || combined.includes("as-is") || profit < 35) return "High";
  if (askingPrice === 0 || normalizedCondition.includes("fair") || combined.includes("untested")) return "Medium";
  return "Low";
}

function estimateConfidence(combined: string, description: string, listingUrl?: string): ConfidenceLevel {
  let points = 0;
  if (description.length > 80) points += 1;
  if (listingUrl) points += 1;
  if (commonFastFlipTerms.some((term) => combined.includes(term))) points += 1;
  if (combined.includes("unknown") || combined.includes("untested")) points -= 1;
  if (points >= 2) return "High";
  if (points <= 0) return "Low";
  return "Medium";
}

function getRecommendation(score: number, risk: RiskLevel, profit: number): Recommendation {
  if (score >= 78 && profit >= 45 && risk !== "High") return "BUY";
  if (score >= 74 && profit >= 500) return "MAYBE";
  if (score >= 60 && profit >= 25) return "MAYBE";
  return "PASS";
}

function buildRedFlags(combined: string, risk: RiskLevel, profit: number, distance: number, askingPrice: number) {
  const flags: string[] = [];
  if (risk === "High") flags.push("High risk inputs need verification before pickup.");
  if (profit < 40) flags.push("Profit spread is thin after pickup and repair estimates.");
  if (distance > 25) flags.push("Pickup distance may erase margin or slow response time.");
  if (askingPrice === 0) flags.push("Free items can carry cleaning, space, and loading risk.");
  if (isVehicle(combined)) flags.push("Run VIN, title, history, mileage, and repair checks before buying.");
  if (combined.includes("crack") || combined.includes("broken")) flags.push("Repair cost can move quickly if hidden damage appears.");
  return flags.length ? flags : ["No major red flags from the mock score. Still verify condition in person."];
}

function buildSellerMessage(title: string, offer: number) {
  const offerText = offer > 0 ? `$${offer}` : "pickup today";
  return `Hi, I am interested in the ${title || "item"}. If it is still available and matches the photos, would you take ${offerText}? I can coordinate pickup quickly.`;
}

function buildExplanation(
  recommendation: Recommendation,
  profit: number,
  distance: number,
  risk: RiskLevel,
  confidence: ConfidenceLevel,
  askingPrice: number,
) {
  if (recommendation === "BUY") {
    return `This looks worth chasing because the margin clears the target after pickup, the distance is manageable, and risk is ${risk.toLowerCase()} with ${confidence.toLowerCase()} confidence.`;
  }
  if (recommendation === "MAYBE") {
    return `There may be upside, but the deal needs verification. Estimated profit is $${profit}, pickup is ${distance} miles, and risk is ${risk.toLowerCase()}. Negotiate below the asking price of $${askingPrice}.`;
  }
  return `Pass for now. The projected margin is too thin or the risk is too high compared with the pickup and repair assumptions.`;
}

function estimateTimeToSell(combined: string, risk: RiskLevel) {
  if (isVehicle(combined)) return "1-3 weeks after title/history checks";
  if (combined.includes("iphone") || combined.includes("nintendo") || combined.includes("tool")) return "2-6 days";
  if (combined.includes("couch") || combined.includes("dresser") || combined.includes("furniture")) return "5-12 days";
  return risk === "High" ? "1-3 weeks" : "4-10 days";
}

function isVehicle(combined: string) {
  return ["vehicle", "car", "honda", "civic", "toyota", "ford", "chevy", "title", "vin"].some((term) =>
    combined.includes(term),
  );
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}