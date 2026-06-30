import { DealFeedClient } from "@/components/app/DealFeedClient";
import { mockDeals } from "@/lib/mock-data";

export default function DealFeedPage() {
  return <DealFeedClient deals={mockDeals} />;
}
