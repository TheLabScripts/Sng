import { CreatorDashboardClient } from "@/components/creator/CreatorDashboardClient";
import { mockCreatorStats } from "@/lib/mock-data";

export default function CreatorDashboardPage() { return <CreatorDashboardClient stats={mockCreatorStats} />; }
