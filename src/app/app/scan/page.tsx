import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";

const scanTools = [
  { title: "Analyze Listing", href: "/app/analyze/", copy: "Paste a title, price, condition, and location to score a deal.", meta: "Listing research" },
  { title: "Field Scan", href: "/app/field-scan/", copy: "Use a photo to identify an item and estimate resale.", meta: "Yard sales / thrift" },
  { title: "VIN Scan", href: "/app/vehicle-mode/", copy: "Scan or enter a VIN, estimate market value, risk, and offer.", meta: "Vehicle flips" },
  { title: "Similar Sales Lookup", href: "/app/analyze/", copy: "Review connected sold comps and decide if the margin is real.", meta: "Comps" },
];

export default function ScanHubPage() {
  return (
    <div className="mx-auto max-w-[430px] md:max-w-shell">
      <section className="field-tool-hero rounded-[24px] border border-brand/40 p-5 shadow-card">
        <p className="text-sm font-bold text-brand">FIELD TOOLKIT</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">Choose a field tool</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Research an item, scan a find, check a vehicle, or compare similar sales before you message the seller.</p>
      </section>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {scanTools.map((tool) => <Link key={tool.title} href={tool.href} className="motion-press rounded-[18px] border border-line bg-surface p-4 shadow-soft hover:border-brand"><p className="text-xs font-bold uppercase text-brand">{tool.meta}</p><h2 className="mt-2 text-xl font-bold text-ink">{tool.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{tool.copy}</p><p className="mt-4 text-sm font-bold text-brand">Open tool</p></Link>)}
      </div>
      <AppCard className="mt-4"><h2 className="text-lg font-bold text-ink">Quick flow</h2><div className="mt-3 grid gap-2 text-sm text-muted"><p>1. Scan or paste the listing.</p><p>2. Check resale value and similar sales.</p><p>3. Message seller or save the deal.</p><p>4. Track outcome in profit stats.</p></div></AppCard>
    </div>
  );
}


