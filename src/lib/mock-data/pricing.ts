import type { PricingPlan } from "@/types/snagd";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 20,
    monthlyPrice: 20,
    annualPrice: 99,
    annualSavings: 141,
    annualLabel: "Founding Annual",
    trialDays: 7,
    summary: "For part-time flippers who want cleaner decisions and fewer wasted pickups.",
    monthlyLimits: ["100 Deal Checks/month", "5 Watchlists", "Monthly limits renew every month"],
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
    price: 39,
    monthlyPrice: 39,
    annualPrice: 199,
    annualSavings: 269,
    annualLabel: "Founding Annual",
    trialDays: 7,
    summary: "For active resellers watching more categories, markets, and price drops.",
    highlighted: true,
    badge: "Most Popular",
    monthlyLimits: ["500 Deal Checks/month", "20 Watchlists", "Monthly limits renew every month"],
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
    price: 79,
    monthlyPrice: 79,
    annualPrice: 399,
    annualSavings: 549,
    annualLabel: "Founding Annual",
    trialDays: 7,
    summary: "For high-volume flips, vehicle-heavy workflows, and bigger-ticket opportunities.",
    monthlyLimits: ["1,500 Deal Checks/month", "50 Watchlists", "Monthly limits renew every month"],
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

export const addOnPacks = [
  { name: "50 Deal Checks", price: 5, cadence: "one-time" },
  { name: "150 Deal Checks", price: 12, cadence: "one-time" },
  { name: "500 Deal Checks", price: 29, cadence: "one-time" },
  { name: "10 VIN Checks", price: 5, cadence: "one-time" },
  { name: "50 VIN Checks", price: 19, cadence: "one-time" },
  { name: "200 VIN Checks", price: 59, cadence: "one-time" },
  { name: "Extra 10 Watchlists", price: 5, cadence: "monthly" },
  { name: "SMS Alert Pack", price: 9, cadence: "monthly" },
];

export const goodPaywalls = [
  "More Deal Checks",
  "More VIN Checks",
  "More watchlists",
  "Faster alerts",
  "Advanced filters",
  "Bulk similar sales",
  "High-ticket presets",
  "SMS/Discord alerts",
  "Vehicle/VIN Intelligence",
];

export const annualPlanCopy = {
  label: "Founding Annual",
  headline: "Pay once, flip all year.",
  note: "Founding annual pricing is limited and may increase for new users later.",
  limits: "Annual users keep the same monthly usage limits, renewed each month.",
};

export const creatorCommission = {
  rate: 30,
  copy: "Creators earn 30% recurring commission while referred subscribers stay active.",
};
