import type { VehicleVinResult } from "@/types/snagd";

export type VehicleAuctionPhotoSignal = {
  hasAuctionPhotos: boolean;
  label: string;
  notes: string;
};

export const vehicleAuctionPhotoService = {
  findAuctionPhotoSignal(vehicle: VehicleVinResult): VehicleAuctionPhotoSignal {
    return {
      hasAuctionPhotos: false,
      label: "Auction photo placeholder",
      notes: `No mock auction photos are attached to VIN ${vehicle.vin}. A paid auction/history provider can attach images later.`
    };
  }
};
