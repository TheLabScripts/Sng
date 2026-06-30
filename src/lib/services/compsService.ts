export type CompsEstimate = {
  source: string;
  range: string;
  confidence: "Low" | "Medium" | "High";
  notes: string;
};

export type CompsService = {
  estimateItemValue(query: string): Promise<CompsEstimate>;
  estimateVehicleValue(vin: string): Promise<CompsEstimate>;
};

// Future adapters can connect to eBay Browse/comps data, MarketCheck-style
// vehicle market data, private-party comps, and category-specific resale data.
export const compsService: CompsService = {
  async estimateItemValue(query) {
    return {
      source: "Mock comps layer",
      range: query.toLowerCase().includes("tool") ? "$240-$300" : "$120-$220",
      confidence: "Medium",
      notes: "Mock range based on category, condition, and local resale heuristics.",
    };
  },
  async estimateVehicleValue() {
    return {
      source: "Mock vehicle comps layer",
      range: "$3,400-$4,200",
      confidence: "Medium",
      notes: "Placeholder for paid market data and private-party comps.",
    };
  },
};