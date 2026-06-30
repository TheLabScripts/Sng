export type Plan = {
  id: "starter" | "pro" | "power";
  name: string;
  monthly: number;
  annualTotal: number;
  annualSavings: number;
  blurb: string;
  highlight?: boolean;
  badge?: string;
  dealChecks: string;
  watchlists: string;
  vinChecks: string;
  annualLabel: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 20,
    annualTotal: 99,
    annualSavings: 141,
    blurb: "For part-time flippers who want cleaner decisions and fewer wasted pickups.",
    dealChecks: "100 Deal Checks/month",
    watchlists: "5 Watchlists",
    vinChecks: "Manual analyzer",
    annualLabel: "Founding Annual",
    features: [
      "100 Deal Checks/month",
      "5 Watchlists",
      "Manual listing analyzer",
      "Basic similar sales",
      "In-app/email alerts",
      "Save/share deals",
      "Basic profit tracking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 39,
    annualTotal: 199,
    annualSavings: 269,
    blurb: "For active resellers watching more categories, markets, and price drops.",
    highlight: true,
    badge: "Most Popular",
    dealChecks: "500 Deal Checks/month",
    watchlists: "20 Watchlists",
    vinChecks: "Basic VIN lookup",
    annualLabel: "Founding Annual",
    features: [
      "500 Deal Checks/month",
      "20 Watchlists",
      "Faster alerts",
      "Better similar sales",
      "Advanced filters",
      "Price drop alerts",
      "Basic VIN lookup",
      "Better stats/profit tracking",
    ],
  },
  {
    id: "power",
    name: "Power",
    monthly: 79,
    annualTotal: 399,
    annualSavings: 549,
    blurb: "For high-volume flips, vehicle-heavy workflows, and bigger-ticket opportunities.",
    dealChecks: "1,500 Deal Checks/month",
    watchlists: "50 Watchlists",
    vinChecks: "Vehicle/VIN Intelligence",
    annualLabel: "Founding Annual",
    features: [
      "1,500 Deal Checks/month",
      "50 Watchlists",
      "Priority alerts",
      "Vehicle/VIN Intelligence",
      "More VIN checks",
      "Bulk similar sales lookup",
      "Advanced profit tracker",
      "SMS/Discord alerts (planned)",
      "High-ticket presets",
    ],
  },
];

export const addOns = [
  { name: "50 Deal Checks", price: 5, cadence: "one-time" },
  { name: "150 Deal Checks", price: 12, cadence: "one-time" },
  { name: "500 Deal Checks", price: 29, cadence: "one-time" },
  { name: "10 VIN Checks", price: 5, cadence: "one-time" },
  { name: "50 VIN Checks", price: 19, cadence: "one-time" },
  { name: "200 VIN Checks", price: 59, cadence: "one-time" },
  { name: "Extra 10 Watchlists", price: 5, cadence: "monthly" },
  { name: "SMS Alert Pack", price: 9, cadence: "monthly" },
];

export const trial = {
  days: 7,
  note: "Every plan starts with a 7-day free trial. Annual plans keep the same monthly limits, renewed each month.",
};

export const creatorCommission = {
  rate: 30,
  copy: "Creators earn 30% recurring commission while referred subscribers stay active.",
};

export const annualPlanCopy = {
  label: "Founding Annual",
  headline: "Pay once, flip all year.",
  note: "Founding annual pricing is limited and may increase for new users later.",
  limits: "Annual users keep the same monthly usage limits, renewed each month.",
};
