import { AppCard } from "@/components/app/AppCard";

const plannedAreas = ["Users", "Subscriptions", "Deal checks usage", "Creator codes", "Referrals", "Payouts", "Reported listings", "API usage/costs", "System health", "Feature flags", "Support tools", "Audit logs"];
const requirements = ["MFA required for production admin access", "Role-based access control", "Server-side authorization on every admin API action", "Audit log every admin change", "No secret keys in frontend bundles", "Rate limit sensitive endpoints", "Separate production and staging environments", "Protect admin with Cloudflare Access or equivalent", "Backup owner account recovery plan"];

export default function AdminPlaceholderPage() {
  const mockSession = { isAdmin: false };
  if (!mockSession.isAdmin) {
    return <main className="min-h-screen bg-bg p-6 text-ink"><div className="mx-auto max-w-xl rounded-[18px] border border-line bg-surface p-6 shadow-card"><p className="text-sm font-bold text-pass">Protected admin placeholder</p><h1 className="mt-2 text-2xl font-bold">Admin access is not enabled for this mock user.</h1><p className="mt-3 text-sm leading-6 text-muted">This route intentionally has no normal app link. Production admin should be isolated behind server-side authorization, MFA, audit logging, and an access layer.</p></div></main>;
  }
  return <main className="min-h-screen bg-bg p-6 text-ink"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Admin Plan</h1><div className="mt-6 grid gap-4 md:grid-cols-2"><AppCard><h2 className="font-bold text-ink">Planned panels</h2><div className="mt-3 grid gap-2 text-sm text-muted">{plannedAreas.map((item) => <p key={item}>{item}</p>)}</div></AppCard><AppCard><h2 className="font-bold text-ink">Security requirements</h2><div className="mt-3 grid gap-2 text-sm text-muted">{requirements.map((item) => <p key={item}>{item}</p>)}</div></AppCard></div></div></main>;
}
