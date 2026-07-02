import { AppCard } from "@/components/app/AppCard";

const plannedAreas = ["Users", "Subscriptions", "Stripe customers", "Creator codes", "Referrals", "Commissions", "Payouts", "Deal Check usage", "VIN Check usage", "API usage and costs", "Feature flags", "Reports", "Support tools", "Audit logs"];
const requirements = ["Cloudflare Access or an equivalent access layer", "MFA required in production", "Server-side admin authorization on every request", "Never trust frontend-only admin flags", "No secrets in frontend bundles", "Audit every admin action", "Verify and protect Stripe webhooks", "Rate-limit sensitive endpoints", "Separate production and staging environments"];

export default function AdminAccessPage() {
  const session = { isAdmin: false };
  if (!session.isAdmin) {
    return <main className="min-h-screen bg-bg p-6 text-ink"><div className="mx-auto max-w-xl rounded-[18px] border border-line bg-surface p-6 shadow-card"><p className="text-sm font-bold text-pass">Protected admin</p><h1 className="mt-2 text-2xl font-bold">Admin access is not enabled for this user.</h1><p className="mt-3 text-sm leading-6 text-muted">This route intentionally has no normal app link. Production admin should be isolated behind server-side authorization, MFA, audit logging, and an access layer.</p></div></main>;
  }
  return <main className="min-h-screen bg-bg p-6 text-ink"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Admin Plan</h1><div className="mt-6 grid gap-4 md:grid-cols-2"><AppCard><h2 className="font-bold text-ink">Planned panels</h2><div className="mt-3 grid gap-2 text-sm text-muted">{plannedAreas.map((item) => <p key={item}>{item}</p>)}</div></AppCard><AppCard><h2 className="font-bold text-ink">Security requirements</h2><div className="mt-3 grid gap-2 text-sm text-muted">{requirements.map((item) => <p key={item}>{item}</p>)}</div></AppCard></div></div></main>;
}


