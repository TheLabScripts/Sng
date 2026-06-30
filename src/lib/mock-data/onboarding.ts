import type { OnboardingProfile } from "@/types/snagd";

export const defaultOnboardingProfile: OnboardingProfile = {
  preset: "Everything profitable",
  location: "43215",
  searchRadius: 25,
  maxPickupDistance: 18,
  maxBuyPrice: 400,
  minimumProfitTarget: 75,
  minimumSnagdScore: 76,
  alertPreference: "Fast in-app + email",
  everythingMode: true,
  automotiveMode: false,
  defaultFeedCategories: ["Smart Picks", "Everything"],
};
