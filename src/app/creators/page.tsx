import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CreatorEarningsCalculator } from "@/components/CreatorEarningsCalculator";
import { CreatorPlaybook } from "@/components/creator/CreatorPlaybook";
import { creatorCommission } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Creators", description: "Earn 30% recurring commission for every referred Snagd subscriber while that subscriber stays active." };

export default function CreatorsPage() {
  return <main className="pb-20 pt-12"><Container><section className="profit-hero overflow-hidden rounded-[28px] border border-profit/35 p-6 shadow-card sm:p-10"><p className="text-sm font-bold text-profit">Snagd Creator Program</p><h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">Turn useful reseller content into <span className="text-profit">recurring income.</span></h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Earn {creatorCommission.rate}% recurring commission for every referred subscriber while that subscriber stays active.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/signup/" className="inline-flex h-12 items-center rounded-card bg-brand px-6 text-sm font-bold text-white">Apply as creator</Link><Link href="/app/creator/" className="inline-flex h-12 items-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">View dashboard</Link></div></section><section className="mt-10 grid gap-4 sm:grid-cols-3">{[["30%", "recurring commission"], ["Every month", "while subscribers stay active"], ["Your link", "code and tracking dashboard"]].map(([value, label]) => <div key={label} className="rounded-[20px] border border-line bg-surface p-5"><p className="font-mono text-3xl font-bold text-profit">{value}</p><p className="mt-2 text-sm text-muted">{label}</p></div>)}</section><section className="mt-10"><CreatorEarningsCalculator /></section><section className="mt-12"><CreatorPlaybook /></section></Container></main>;
}
