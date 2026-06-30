// Sample deals shown on the marketing site. Clearly illustrative â€” these
// mirror what the app produces, they are not live marketplace data.
import type { DealCard } from "./SnagdScoreCard";

export const mockDeals: DealCard[] = [
  {
    title: "Leather sectional couch",
    asking: "$90",
    resale: "$220â€“280",
    profit: "$100â€“150",
    maxOffer: "$75",
    score: 91,
    verdict: "BUY",
    distance: "7 miles away",
  },
  {
    title: "Milwaukee tool bundle",
    asking: "$140",
    resale: "$240â€“300",
    profit: "$75â€“120",
    maxOffer: "$120",
    score: 84,
    verdict: "BUY",
    distance: "12 miles away",
  },
  {
    title: "Free dresser",
    asking: "Free",
    resale: "$60â€“120",
    profit: "$45â€“90",
    score: 78,
    verdict: "BUY",
    risk: "Medium",
    distance: "4 miles away",
    note: "Needs pickup space and a light clean. Strong margin for $0 in.",
  },
  {
    title: "iPhone 12 â€” cracked screen",
    asking: "$180",
    resale: "$220â€“280",
    profit: "$10â€“55",
    score: 58,
    verdict: "MAYBE",
    risk: "High",
    distance: "9 miles away",
    note: "Thin spread after a screen repair. Only worth it under $150.",
  },
];

export const heroDeal: DealCard = mockDeals[0];

