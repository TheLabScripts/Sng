export const vehicleRecallService = { async lookupRecalls(vin: string) { return { vin, source: "Mock NHTSA recall placeholder", recalls: ["Airbag campaign check required"] }; } };
