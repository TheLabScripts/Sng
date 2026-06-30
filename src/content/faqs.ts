export type Faq = { q: string; a: string };

export const faqs = [
  {
    q: "What does Snagd do?",
    a: "Snagd helps resellers analyze local deals, build watchlists, view alerts, track Deal Checks, and prepare for vehicle/VIN workflows.",
  },
  {
    q: "Does Snagd scrape marketplaces or automate logins?",
    a: "No. This dev build uses user-supplied listings, mock source-layer data, and integration placeholders only.",
  },
  {
    q: "What is a Deal Check?",
    a: "A Deal Check is one in-depth listing analysis that returns score, recommendation, profit estimate, risk, and suggested max offer.",
  },
  {
    q: "What is Everything Mode?",
    a: "Everything Mode watches for anything profitable in your area based on budget, pickup distance, profit target, and minimum Snagd Score.",
  },
  {
    q: "Is auth real yet?",
    a: "No. Login, signup, onboarding, watchlists, and session state use localStorage so the app can be tested without a backend.",
  },
  {
    q: "Will Vehicle Mode use real APIs later?",
    a: "The service layer is structured for VIN decode, recalls, market data, vehicle history, comps, maps, notifications, and billing providers.",
  },
];