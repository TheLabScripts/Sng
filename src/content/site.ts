// Single source of truth for brand strings + external links.
// "Snagd" is the technical brand. "Get Snag'd" is a marketing phrase only —
// never used in code identifiers, routes, or env vars.

export const site = {
  name: "Snagd",
  tagline: "Local flips worth chasing.",
  secondaryTagline:
    "Know what to buy, what to offer, and what you can make — before you message the seller.",
  marketingPhrase: "Get Snag'd",
  // External links resolve from env at build time, with safe fallbacks so the
  // site never ships a dead button before the app is published.
  appStoreUrl: process.env.NEXT_PUBLIC_APP_STORE_URL || "",
  playStoreUrl: process.env.NEXT_PUBLIC_PLAY_STORE_URL || "",
  waitlistUrl: process.env.NEXT_PUBLIC_WAITLIST_URL || "",
  creatorSignupUrl: process.env.NEXT_PUBLIC_CREATOR_SIGNUP_URL || "",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@snagd.app",
  social: {
    tiktok: "https://www.tiktok.com/@getsnagd",
    instagram: "https://www.instagram.com/getsnagd",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Creators", href: "/creators/" },
  { label: "Support", href: "/support/" },
] as const;

// The marketplaces Snagd helps you evaluate listings from. Wording is
// deliberate: Snagd analyzes listings you bring in or future compliant
// source integrations — it does NOT scrape these platforms in V1.
export const marketplaces = [
  "Facebook Marketplace",
  "Craigslist",
  "OfferUp",
  "Nextdoor",
  "eBay",
  "Garage Sales",
  "Estate Sales",
] as const;
