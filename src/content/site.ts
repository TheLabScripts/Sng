export const site = {
  name: "Snagd",
  tagline: "Local flips worth chasing.",
  secondaryTagline: "Know the profit before you buy.",
  marketingPhrase: "Get Snag'd",
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
  { label: "Login", href: "/login/" },
] as const;

export const marketplaces = [
  "User-supplied listings",
  "Manual source layers",
  "Local lead notes",
  "Yard sale finds",
  "Estate sale finds",
  "Compliant data providers",
] as const;