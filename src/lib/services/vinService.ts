import type { VehicleRecall, VehicleVinResult } from "@/types/snagd";

type VinApiPayload = {
  error?: string;
  vehicle?: {
    vin: string;
    year: string;
    make: string;
    model: string;
    trim: string;
    bodyClass: string;
    engineModel: string;
    displacementL: string;
    cylinders: string;
    driveType: string;
    fuelType: string;
    transmission: string;
    plantCountry: string;
    plantCity: string;
    manufacturer: string;
    decodeMessage: string;
  };
  recalls?: Array<{
    NHTSACampaignNumber?: string;
    Component?: string;
    Summary?: string;
    Consequence?: string;
    Remedy?: string;
  }>;
};

export type VinService = {
  decodeVin(vin: string): Promise<VehicleVinResult>;
  getRecalls(vin: string): Promise<string[]>;
};

function normalizeVin(vin: string) {
  return vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
}

function apiUrl(vin: string) {
  const configuredBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
  return `${configuredBase}/api/vin/${encodeURIComponent(vin)}`;
}

function mapRecall(recall: NonNullable<VinApiPayload["recalls"]>[number]): VehicleRecall {
  return {
    campaignNumber: recall.NHTSACampaignNumber || "NHTSA campaign",
    component: recall.Component || "Safety recall",
    summary: recall.Summary || "Open the NHTSA campaign for details.",
    consequence: recall.Consequence,
    remedy: recall.Remedy,
  };
}

async function fetchVin(vin: string) {
  const response = await fetch(apiUrl(vin), { headers: { Accept: "application/json" } });
  const payload = await response.json() as VinApiPayload;
  if (!response.ok || !payload.vehicle) throw new Error(payload.error || "VIN lookup failed. Try again.");
  return payload;
}

export const vinService: VinService = {
  async decodeVin(inputVin) {
    const vin = normalizeVin(inputVin);
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) throw new Error("Enter a valid 17-character VIN.");

    const payload = await fetchVin(vin);
    const vehicle = payload.vehicle!;
    const recallDetails = (payload.recalls || []).map(mapRecall);
    const engineParts = [vehicle.displacementL ? `${Number(vehicle.displacementL).toFixed(1)}L` : "", vehicle.cylinders ? `${vehicle.cylinders}-cylinder` : "", vehicle.engineModel].filter(Boolean);

    return {
      vin,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      bodyClass: vehicle.bodyClass,
      engine: engineParts.join(" ") || "Not reported",
      driveType: vehicle.driveType,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      plantLocation: [vehicle.plantCity, vehicle.plantCountry].filter(Boolean).join(", "),
      manufacturer: vehicle.manufacturer,
      decodeMessage: vehicle.decodeMessage,
      recallDetails,
      recalls: recallDetails.map((recall) => `${recall.component}: ${recall.summary}`),
      marketValueRange: "Pricing source not connected",
      privatePartyComps: "Free government data does not include market prices.",
      titleHistoryRisk: "Medium",
      mileageRisk: "Medium",
      repairRisks: recallDetails.length ? ["Review open recall campaigns before purchase."] : ["No recall campaigns were returned for this year, make, and model."],
      suggestedMaxOffer: 0,
      estimatedFlipProfit: "Add your resale target",
      walkAwayWarnings: ["Verify the physical VIN matches the title.", "Use an approved history provider for title, theft, flood, and odometer checks."],
      riskLevel: recallDetails.length ? "Medium" : "Low",
      aiSummary: `${vehicle.year} ${vehicle.make} ${vehicle.model} decoded from NHTSA manufacturer data.`,
    };
  },

  async getRecalls(vin) {
    const result = await this.decodeVin(vin);
    return result.recalls;
  },
};
