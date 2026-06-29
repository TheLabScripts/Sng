// Pricing lives here so it can be retuned without touching UI.
// Positioned to undercut Swoopa at every tier while stepping up from the
// original $20 floor. Annual billing is the churn/LTV lever.

export type Plan = {
  id: "founder" | "pro" | "power";
  name: string;
  monthly: number;
  annualMonthly: number; // effective monthly price when billed yearly
  annualTotal: number;
  blurb: string;
  highlight?: boolean;
  badge?: string;
  dealChecks: string;
  watchlists: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "founder",
    name: "Founder",
    monthly: 29,
    annualMonthly: 19,
    annualTotal: 228,
    blurb: "For the part-time flipper who wants the junk filtered out.",
    dealChecks: "100 Deal Checks / mo",
    watchlists: "5 Watchlists",
    features: [
      "AI Snagd Score on every listing",
      "Buy / Maybe / Pass verdicts",
      "Estimated resale, profit & max offer",
      "Everything Mode",
      "In-app + email alerts",
      "Basic risk & scam warnings",
      "Creator code support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 59,
    annualMonthly: 39,
    annualTotal: 468,
    blurb: "For the active reseller running multiple niches at once.",
    highlight: true,
    badge: "Most popular",
    dealChecks: "500 Deal Checks / mo",
    watchlists: "20 Watchlists",
    features: [
      "Everything in Founder",
      "Faster alert speed",
      "Advanced filters & niche presets",
      "Deeper comp analysis",
      "Price-drop & urgency alerts",
      "SMS + Discord alerts (as available)",
      "Priority alert settings",
    ],
  },
  {
    id: "power",
    name: "Power Flipper",
    monthly: 99,
    annualMonthly: 69,
    annualTotal: 828,
    blurb: "For the full-time hustler treating flips like a business.",
    dealChecks: "2,000 Deal Checks / mo",
    watchlists: "Unlimited Watchlists",
    features: [
      "Everything in Pro",
      "Priority (fastest) alerts",
      "High-ticket category presets",
      "Bulk deal review",
      "Team / member access",
      "Advanced analytics",
    ],
  },
];

export const addOns = [
  { name: "50 Deal Checks", price: 7 },
  { name: "150 Deal Checks", price: 15 },
  { name: "500 Deal Checks", price: 35 },
  { name: "SMS alert pack", price: 9 },
  { name: "Priority alert boost", price: 12 },
];

export const trial = {
  days: 7,
  dealChecks: 20,
  watchlists: 3,
  note: "Full features for 7 days. Card required. Rolls into Founder unless you cancel — cancel anytime.",
};

// Honest comparison data vs the main competitor (Swoopa), pulled from their
// public pricing page. Used in the pricing comparison block.
export const competitor = {
  name: "Swoopa",
  entryMonthly: 47,
  entryCommitted: 28,
  popularMonthly: 144,
  popularCommitted: 99,
};
