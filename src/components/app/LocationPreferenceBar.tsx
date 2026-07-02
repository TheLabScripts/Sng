"use client";

import { useEffect, useState } from "react";
import { defaultLocationPreference, locationPreferenceService } from "@/lib/services/locationPreferenceService";

export function LocationPreferenceBar() {
  const [location, setLocation] = useState(defaultLocationPreference);
  const [saved, setSaved] = useState(false);
  useEffect(() => setLocation(locationPreferenceService.load()), []);
  return <section className="rounded-[18px] border border-line bg-surface p-3 shadow-soft"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Current browsing location</p><p className="mt-1 text-sm font-bold text-ink">ZIP {location.zip} / {location.radius} miles</p></div><button type="button" onClick={() => { locationPreferenceService.save(location); setSaved(true); window.setTimeout(() => setSaved(false), 1200); }} className="rounded-card border border-brand/30 bg-brand/10 px-3 py-2 text-xs font-bold text-brand">{saved ? "Updated" : "Update Location"}</button></div></section>;
}
