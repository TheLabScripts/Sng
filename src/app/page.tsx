import Link from "next/link";

const workflow = [
  { title: "Set the hunt", body: "Choose your ZIP, radius, category, keywords, budget, minimum profit, and minimum score." },
  { title: "Scan connected sources", body: "Approved listing sources are normalized, deduplicated, filtered, and scored automatically." },
  { title: "Move on real matches", body: "Open the original listing, save it, contact the seller, and track the result without placeholder inventory." },
];

const capabilities = [
  { title: "ZIP-based saved searches", body: "Run multiple searches with their own radius, price range, keyword exclusions, and alert threshold." },
  { title: "Transparent deal scoring", body: "See resale estimate, costs, profit, distance, demand, keyword strength, and automated risk flags." },
  { title: "Source-first listing details", body: "Every result links back to its original source and keeps scraped time, images, seller, and location data." },
  { title: "Manual listing analyzer", body: "Paste a listing yourself when a marketplace requires a user-assisted or provider-authorized flow." },
  { title: "VIN field tools", body: "Decode VIN barcodes with audible confirmation and move directly into the vehicle report." },
  { title: "Real alert state", body: "Alerts appear only when a stored listing clears your saved search profit and score thresholds." },
];

export default function HomePage() {
  return <>
    <section className="relative overflow-hidden border-b border-line bg-bg"><div className="pointer-events-none absolute inset-0 soft-grid opacity-70" /><div className="pointer-events-none absolute right-[-10rem] top-[-12rem] hidden h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl lg:block" /><div className="relative mx-auto grid min-h-[82svh] max-w-shell gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"><div className="animate-rise"><p className="text-sm font-bold text-brand">Local resale intelligence</p><h1 className="mt-4 text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">Real listings. Clear margins. Faster moves.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-muted">Snagd scans connected marketplace sources around your ZIP, ranks underpriced listings, and tells you what is worth chasing. No bundled marketplace cards are substituted when a source is offline.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white shadow-card">Create account</Link><Link href="/app/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface/90 px-6 text-sm font-bold text-ink">Open app</Link></div></div><ConnectionPanel /></div></section>
    <Section eyebrow="How it works" title="From saved search to a real seller listing."><div className="grid gap-4 md:grid-cols-3">{workflow.map((item, index) => <Feature key={item.title} number={`${index + 1}`} title={item.title} body={item.body} />)}</div></Section>
    <Section eyebrow="Production foundation" title="Everything needed to turn listing data into decisions."><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{capabilities.map((item) => <Feature key={item.title} title={item.title} body={item.body} />)}</div></Section>
    <section className="border-t border-line bg-surface/40"><div className="mx-auto max-w-shell px-4 py-14 text-center sm:px-6"><h2 className="text-3xl font-bold text-ink sm:text-4xl">Build searches around what you actually flip.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">Connect approved sources, set your thresholds, and let Snagd surface qualifying listings automatically.</p><Link href="/signup/" className="mt-7 inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">Get started</Link></div></section>
  </>;
}

function ConnectionPanel() {
  return <div className="float-soft rounded-[26px] border border-line bg-surface p-4 shadow-card"><div className="rounded-[22px] border border-line bg-surface-2 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-brand">Live listing pipeline</p><h2 className="mt-2 text-3xl font-extrabold text-ink">Source to score</h2></div><span className="rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-sm font-bold text-profit">REAL DATA ONLY</span></div><div className="mt-6 grid gap-3">{["Saved search becomes due", "Approved source returns listings", "Listings normalize and deduplicate", "Profit and risk score calculates", "Qualified match reaches your feed"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-card border border-line bg-surface p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{index + 1}</span><p className="text-sm font-bold text-ink">{step}</p></div>)}</div></div></div>;
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="border-b border-line bg-bg px-4 py-14 sm:px-6"><div className="mx-auto max-w-shell"><p className="text-sm font-bold text-brand">{eyebrow}</p><h2 className="mt-3 max-w-3xl text-3xl font-bold text-ink sm:text-4xl">{title}</h2><div className="mt-8">{children}</div></div></section>;
}

function Feature({ number, title, body }: { number?: string; title: string; body: string }) {
  return <div className="rounded-card border border-line bg-surface p-5 shadow-card">{number && <span className="font-mono text-sm font-bold text-brand">{number}</span>}<h3 className="mt-2 text-lg font-bold text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-muted">{body}</p></div>;
}
