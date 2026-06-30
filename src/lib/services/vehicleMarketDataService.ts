export const vehicleMarketDataService = { async getMarketValue(vin: string) { return { vin, source: "Mock MarketCheck-style vehicle market data", range: "$3,400-$4,200", comps: 18 }; } };
