import type { VehicleVinResult } from "@/types/snagd";

export const mockVehicleVinResult: VehicleVinResult = {
  vin: "1HGCM82633A004352",
  year: "2012",
  make: "Honda",
  model: "Civic",
  trim: "EX",
  bodyClass: "Sedan",
  engine: "1.8L I4",
  recalls: ["Airbag inflator campaign check required", "Power window master switch inspection"],
  marketValueRange: "$3,400-$4,200",
  privatePartyComps: "Clean-title local comps cluster near $3,850 with 145k-175k miles.",
  titleHistoryRisk: "Medium",
  mileageRisk: "Medium",
  repairRisks: ["Check AC compressor", "Scan for emissions codes", "Inspect tires and front brakes"],
  suggestedMaxOffer: 2550,
  estimatedFlipProfit: "$550-$1,100",
  walkAwayWarnings: [
    "No title in seller name",
    "Unexplained warning lights",
    "Overheating during test drive",
    "Major frame rust",
  ],
};