import type { PricingPlan } from "@/types/snagd";

export const pricingPlans: PricingPlan[] = [
  {
    id: "founder",
    name: "Founder",
    price: 20,
    summary: "For part-time flippers who want better decisions without overbuilding the workflow.",
    features: [
      "100 Deal Checks/month",
      "5 Watchlists",
      "Everything Mode",
      "Standard alerts",
      "Email/in-app alerts",
      "Basic resale estimates",
      "Basic risk warnings",
      "Creator code support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    summary: "For active resellers running more niches and watching more areas.",
    highlighted: true,
    features: [
      "500 Deal Checks/month",
      "20 Watchlists",
      "Faster alerts",
      "More niche presets",
      "Advanced filters",
      "Better comps",
      "SMS/Discord alerts when available",
      "Priority alert settings",
    ],
  },
  {
    id: "power",
    name: "Power Flipper",
    price: 79,
    summary: "For high-volume flippers, teams, and high-ticket categories.",
    features: [
      "Higher usage limits",
      "Priority alerts",
      "High-ticket presets",
      "Bulk deal review",
      "Team access",
      "Advanced analytics",
      "Vehicle tools expanded",
    ],
  },
];

export const addOnPacks = [
  { name: "50 extra Deal Checks", price: 5 },
  { name: "150 extra Deal Checks", price: 12 },
  { name: "500 extra Deal Checks", price: 29 },
  { name: "Extra Watchlists", price: 8 },
  { name: "SMS alert pack", price: 9 },
  { name: "Priority alert boost", price: 12 },
  { name: "Advanced comps pack", price: 19 },
  { name: "10 VIN Checks", price: 5 },
  { name: "50 VIN Checks", price: 19 },
  { name: "200 VIN Checks", price: 59 },
];

export const goodPaywalls = [
  "More watchlists",
  "More Deal Checks",
  "Faster alerts",
  "SMS/Discord alerts",
  "Advanced comps",
  "High-ticket categories",
  "Bulk analysis",
  "Priority scanning",
  "Vehicle Mode advanced checks",
];
