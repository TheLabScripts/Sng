import type { VehicleVinResult } from "@/types/snagd";

export type VehicleImageCandidate = {
  kind: "stock" | "auction" | "fallback";
  label: string;
  source: string;
};

export const vehicleImageService = {
  getBestImage(vehicle: VehicleVinResult): VehicleImageCandidate {
    if (vehicle.vin.endsWith("3456")) {
      return { kind: "stock", label: `${vehicle.year} ${vehicle.make} ${vehicle.model} stock image placeholder`, source: "mock-stock-image" };
    }
    return { kind: "fallback", label: `${vehicle.make} ${vehicle.model} silhouette placeholder`, source: "mock-fallback" };
  }
};
