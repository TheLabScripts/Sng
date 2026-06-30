export type Plan = {
  id: "founder" | "pro" | "power";
  name: string;
  monthly: number;
  annualMonthly: number;
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
    monthly: 20,
    annualMonthly: 20,
    annualTotal: 240,
    blurb: "For the part-time flipper who wants better decisions.",
    dealChecks: "100 Deal Checks / mo",
    watchlists: "5 Watchlists",
    features: [
      "Snagd Score on every checked listing",
      "Buy / Maybe / Pass verdicts",
      "Estimated resale, profit, and max offer",
      "Everything Mode",
      "In-app and email alerts",
      "Basic resale estimates",
      "Basic risk warnings",
      "Creator code support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 39,
    annualMonthly: 39,
    annualTotal: 468,
    blurb: "For active resellers running more niches.",
    highlight: true,
    badge: "Most flexible",
    dealChecks: "500 Deal Checks / mo",
    watchlists: "20 Watchlists",
    features: [
      "Everything in Founder",
      "Faster alerts",
      "More niche presets",
      "Advanced filters",
      "Better comps",
      "SMS and Discord alerts when available",
      "Priority alert settings",
    ],
  },
  {
    id: "power",
    name: "Power Flipper",
    monthly: 79,
    annualMonthly: 79,
    annualTotal: 948,
    blurb: "For high-volume flippers and teams.",
    dealChecks: "Higher usage limits",
    watchlists: "Expanded Watchlists",
    features: [
      "Everything in Pro",
      "Priority alerts",
      "High-ticket presets",
      "Bulk deal review",
      "Team access",
      "Advanced analytics",
      "Vehicle tools expanded",
    ],
  },
];

export const addOns = [
  { name: "50 extra Deal Checks", price: 5 },
  { name: "150 extra Deal Checks", price: 12 },
  { name: "500 extra Deal Checks", price: 29 },
  { name: "Extra Watchlists", price: 8 },
  { name: "SMS alert pack", price: 9 },
  { name: "Priority alert boost", price: 12 },
];

export const trial = {
  days: 7,
  dealChecks: 20,
  watchlists: 3,
  note: "Demo trial copy. Production billing should connect through Stripe.",
};