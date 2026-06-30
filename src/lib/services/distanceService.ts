export type DistanceEstimate = {
  miles: number;
  pickupCost: number;
  driveTime: string;
};

export type DistanceService = {
  estimatePickup(origin: string, destination: string): Promise<DistanceEstimate>;
};

// Future adapter: Maps route/distance provider. Keep keys server-side and return
// normalized distance/cost data to the client.
export const distanceService: DistanceService = {
  async estimatePickup() {
    return {
      miles: 11,
      pickupCost: 19,
      driveTime: "22 min each way",
    };
  },
};
