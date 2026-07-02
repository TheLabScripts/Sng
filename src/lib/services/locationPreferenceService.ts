export type LocationPreference = { zip: string; radius: number };

const storageKey = "snagd-location-preference";
export const defaultLocationPreference: LocationPreference = { zip: "08102", radius: 25 };

export const locationPreferenceService = {
  load(): LocationPreference {
    if (typeof window === "undefined") return defaultLocationPreference;
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null") as Partial<LocationPreference> | null;
      return { zip: saved?.zip || defaultLocationPreference.zip, radius: Number(saved?.radius) || defaultLocationPreference.radius };
    } catch {
      return defaultLocationPreference;
    }
  },
  save(preference: LocationPreference) {
    window.localStorage.setItem(storageKey, JSON.stringify(preference));
  },
};
