import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { mockWatchlists, savedDealSeeds, savedFieldScans, savedVehicleChecks } from "@/lib/mock-data";

export default function SavedPage() {
  return <div className="mx-auto max-w-shell"><div><h2 className="text-2xl font-bold text-ink">Saved</h2><p className="mt-1 text-sm text-muted">Saved deals, searches, field scans, and vehicle checks live here.</p></div><div className="mt-5 grid gap-4 sm:grid-cols-4"><Count label="Saved deals" value={savedDealSeeds.length} /><Count label="Saved watchlists" value={mockWatchlists.length} /><Count label="Field scans" value={savedFieldScans.length} /><Count label="Vehicle checks" value={savedVehicleChecks.length} /></div><div className="mt-5 grid gap-4 lg:grid-cols-2">{savedDealSeeds.map((deal) => <DealCard key={deal.id} deal={deal} />)}</div><AppCard className="mt-5"><h3 className="text-lg font-bold text-ink">Filters</h3><div className="mt-3 flex flex-wrap gap-2">{["Category", "Score", "Profit", "Risk", "Vehicles", "Field scans"].map((item) => <span key={item} className="rounded-card border border-line bg-surface-2 px-3 py-2 text-sm text-muted">{item}</span>)}</div></AppCard></div>;
}
function Count({ label, value }: { label: string; value: number }) { return <AppCard><p className="text-sm text-muted">{label}</p><p className="mt-2 font-mono text-3xl font-bold text-brand">{value}</p></AppCard>; }
