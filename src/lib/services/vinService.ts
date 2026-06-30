import type { VehicleVinResult } from "@/types/snagd";
import { mockVehicleVinResult } from "@/lib/mock-data";

export type VinService = {
  decodeVin(vin: string): Promise<VehicleVinResult>;
  getRecalls(vin: string): Promise<string[]>;
};

// Future server adapters:
// - NHTSA vPIC for VIN decoding
// - NHTSA recalls endpoint for safety campaigns
// - NMVTIS-approved history provider for title/history risk
export const vinService: VinService = {
  async decodeVin(vin) {
    return { ...mockVehicleVinResult, vin: vin || mockVehicleVinResult.vin };
  },
  async getRecalls() {
    return mockVehicleVinResult.recalls;
  },
};
