export const vehicleCompsService = { async getVehicleComps(vin: string) { return { vin, source: "Mock private-party vehicle comps", count: 18, range: "$3,400-$4,200" }; } };
