import type { OnboardingProfile } from "@/types/snagd";

export const defaultOnboardingProfile: OnboardingProfile = {
  preset: "Everything profitable",
  location: "Columbus, OH",
  searchRadius: 25,
  maxPickupDistance: 18,
  maxBuyPrice: 500,
  minimumProfitTarget: 75,
  minimumSnagdScore: 76,
  alertPreference: "Fast in-app + email",
  everythingMode: true,
};