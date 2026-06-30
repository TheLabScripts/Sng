import { notFound } from "next/navigation";
import { DealDetailClient } from "@/components/app/DealDetailClient";
import { mockDeals } from "@/lib/mock-data";

export function generateStaticParams() { return mockDeals.map((deal) => ({ id: deal.id })); }

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = mockDeals.find((item) => item.id === params.id);
  if (!deal) notFound();
  return <DealDetailClient deal={deal} />;
}

