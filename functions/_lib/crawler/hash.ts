export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function listingContentHash(input: { title: string; price: number | null; sourceUrl: string; locationText: string }) {
  return sha256([input.title.trim().toLowerCase(), input.price ?? "missing", input.sourceUrl.trim(), input.locationText.trim().toLowerCase()].join("|"));
}

export function buildListingDedupKey(input: { source: string; externalId?: string | null; sourceUrl: string; contentHash: string }) {
  return input.externalId ? `${input.source}:external:${input.externalId}` : `${input.source}:fallback:${input.sourceUrl}:${input.contentHash}`;
}
