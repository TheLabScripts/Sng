type FunctionContext = {
  params: { vin?: string };
};

type NhtsaDecodeResult = Record<string, string>;
type NhtsaRecallResult = {
  NHTSACampaignNumber?: string;
  Component?: string;
  Summary?: string;
  Consequence?: string;
  Remedy?: string;
  Manufacturer?: string;
};

const jsonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
  "Content-Type": "application/json; charset=utf-8",
};

export async function onRequestGet({ params }: FunctionContext) {
  const vin = String(params.vin || "").toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return Response.json({ error: "Enter a valid 17-character VIN." }, { status: 400, headers: jsonHeaders });
  }

  try {
    const decodeResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`);
    if (!decodeResponse.ok) throw new Error("NHTSA VIN service did not respond.");

    const decodePayload = await decodeResponse.json() as { Results?: NhtsaDecodeResult[] };
    const decoded = decodePayload.Results?.[0];
    if (!decoded?.Make || !decoded?.ModelYear) {
      return Response.json({ error: decoded?.ErrorText || "NHTSA could not decode that VIN." }, { status: 422, headers: jsonHeaders });
    }

    const recallUrl = new URL("https://api.nhtsa.gov/recalls/recallsByVehicle");
    recallUrl.searchParams.set("make", decoded.Make);
    recallUrl.searchParams.set("model", decoded.Model);
    recallUrl.searchParams.set("modelYear", decoded.ModelYear);
    const recallResponse = await fetch(recallUrl);
    const recallPayload = recallResponse.ok
      ? await recallResponse.json() as { results?: NhtsaRecallResult[] }
      : { results: [] as NhtsaRecallResult[] };

    return Response.json({
      vehicle: {
        vin,
        year: decoded.ModelYear,
        make: decoded.Make,
        model: decoded.Model,
        trim: decoded.Trim || decoded.Series || "",
        bodyClass: decoded.BodyClass || "Not reported",
        engineModel: decoded.EngineModel || "",
        displacementL: decoded.DisplacementL || "",
        cylinders: decoded.EngineCylinders || "",
        driveType: decoded.DriveType || "Not reported",
        fuelType: decoded.FuelTypePrimary || "Not reported",
        transmission: decoded.TransmissionStyle || "Not reported",
        plantCountry: decoded.PlantCountry || "Not reported",
        plantCity: decoded.PlantCity || "",
        manufacturer: decoded.Manufacturer || decoded.ManufacturerId || "",
        decodeMessage: decoded.ErrorText || "VIN decoded by NHTSA.",
      },
      recalls: recallPayload.results || [],
      sources: ["NHTSA vPIC", "NHTSA Recalls"],
      checkedAt: new Date().toISOString(),
    }, { headers: jsonHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "VIN lookup failed. Try again." },
      { status: 502, headers: { ...jsonHeaders, "Cache-Control": "no-store" } },
    );
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
