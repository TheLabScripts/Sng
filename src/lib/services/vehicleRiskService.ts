import type { RiskLevel, VehicleVinResult } from "@/types/snagd";

export type VehicleRiskSummary = {
  riskLevel: RiskLevel;
  titleSignal: string;
  accidentSignal: string;
  odometerSignal: string;
  theftFloodSalvageSignal: string;
};

export const vehicleRiskService = {
  summarize(vehicle: VehicleVinResult): VehicleRiskSummary {
    return {
      riskLevel: vehicle.riskLevel ?? vehicle.titleHistoryRisk,
      titleSignal: `${vehicle.titleHistoryRisk} title/history risk placeholder`,
      accidentSignal: "Accident signal requires a future approved history provider",
      odometerSignal: `${vehicle.mileageRisk} mileage/odometer risk placeholder`,
      theftFloodSalvageSignal: "Theft, salvage, and flood checks are future provider-backed signals"
    };
  }
};
