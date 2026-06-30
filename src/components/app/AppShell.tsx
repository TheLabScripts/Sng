"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const mainMobileItems = [
  { label: "Dashboard", href: "/app/", icon: DashboardIcon },
  { label: "Feed", href: "/app/deal-feed/", icon: FeedIcon },
  { label: "Analyze", href: "/app/analyze/", icon: AnalyzeIcon },
  { label: "Alerts", href: "/app/alerts/", icon: BellIcon },
] as const;

const moreItems = [
  { label: "Watchlists", href: "/app/watchlists/", icon: WatchIcon },
  { label: "Field Scan", href: "/app/field-scan/", icon: ScanIcon },
  { label: "Vehicle Mode", href: "/app/vehicle-mode/", icon: CarIcon },
  { label: "Saved Deals", href: "/app/saved/", icon: HeartIcon },
  { label: "Stats", href: "/app/stats/", icon: StatsIcon },
  { label: "Billing", href: "/app/billing/", icon: CardIcon },
  { label: "Creator", href: "/app/creator/", icon: CreatorIcon },
  { label: "Account", href: "/app/account/", icon: UserIcon },
] as const;

const desktopItems = [...mainMobileItems, ...moreItems] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("snagd-session")) {
      window.localStorage.setItem("snagd-session", JSON.stringify({ name: "Demo reseller", email: "demo@snagd.app", plan: "Founder" }));
    }
    const seenHint = window.localStorage.getItem("snagd-more-hint-seen");
    if (!seenHint) {
      setShowHint(true);
      window.localStorage.setItem("snagd-more-hint-seen", "true");
      window.setTimeout(() => setShowHint(false), 4800);
    }
  }, []);

  const activeItem = desktopItems.find((item) => item.href !== "/app/" && pathname.startsWith(item.href)) ?? desktopItems[0];
  const moreActive = moreItems.some((item) => isActive(pathname, item.href));

  function signOut() { window.localStorage.removeItem("snagd-session"); window.location.href = "/login/"; }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-line bg-surface/70 px-4 py-5 md:block">
          <SnagdLogo href="/app/" />
          <nav className="mt-8 grid gap-1">
            {desktopItems.map((item) => <AppNavLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-line bg-bg/92 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="text-xs text-muted">Snagd app</p><h1 className="truncate text-xl font-bold text-ink">{activeItem.label}</h1></div>
              <div className="flex items-center gap-2"><span className="hidden rounded-card border border-line bg-surface px-3 py-2 text-xs text-muted sm:inline-flex">Demo session</span><ThemeToggle compact /><button type="button" onClick={signOut} className="hidden h-10 rounded-card border border-line bg-surface px-3 text-sm text-muted transition hover:text-ink sm:inline-flex sm:items-center">Sign out</button></div>
            </div>
          </header>
          <main className="flex-1 px-4 pb-32 pt-5 sm:px-6 md:pb-8">{children}</main>
        </div>
      </div>

      {showHint && <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-brand/35 bg-surface px-4 py-2 text-xs text-brand shadow-card motion-slide md:hidden">Tap More for Field Scan, Vehicle, Saved, Stats</div>}
      {moreOpen && <MoreSheet pathname={pathname} onClose={() => setMoreOpen(false)} />}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/97 pb-[env(safe-area-inset-bottom)] shadow-card backdrop-blur md:hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent" />
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {mainMobileItems.map((item) => <MobileNavLink key={item.href} item={item} active={isActive(pathname, item.href)} />)}
          <button type="button" onClick={() => setMoreOpen(true)} className={`motion-press flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-card px-2 py-2 text-[11px] ${moreActive ? "bg-brand text-bg" : "text-muted"}`}><MoreIcon /><span>More</span><span className="mt-0.5 flex gap-0.5"><i className="h-1 w-1 rounded-full bg-current opacity-40" /><i className="h-1 w-1 rounded-full bg-current" /><i className="h-1 w-1 rounded-full bg-current opacity-40" /></span></button>
        </div>
      </nav>
    </div>
  );
}

function MoreSheet({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] bg-black/45 p-3 md:hidden" onClick={onClose}><div className="motion-slide absolute inset-x-3 bottom-24 rounded-card border border-line bg-surface p-4 shadow-card" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-xs text-muted">More tools</p><h2 className="text-lg font-bold text-ink">Swipe-free navigation</h2></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div><div className="mt-4 grid grid-cols-2 gap-2">{moreItems.map((item) => <MoreLink key={item.href} item={item} active={isActive(pathname, item.href)} onClose={onClose} />)}</div></div></div>;
}

function AppNavLink({ item, active }: { item: (typeof desktopItems)[number]; active: boolean }) { const Icon = item.icon; return <Link href={item.href} className={`motion-press flex h-11 items-center gap-3 rounded-card px-3 text-sm ${active ? "bg-brand text-bg" : "text-muted hover:bg-surface-2 hover:text-ink"}`}><Icon /><span>{item.label}</span></Link>; }
function MobileNavLink({ item, active }: { item: (typeof mainMobileItems)[number]; active: boolean }) { const Icon = item.icon; return <Link href={item.href} className={`motion-press flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-card px-2 py-2 text-[11px] ${active ? "bg-brand text-bg" : "text-muted"}`}><Icon /><span>{item.label}</span></Link>; }
function MoreLink({ item, active, onClose }: { item: (typeof moreItems)[number]; active: boolean; onClose: () => void }) { const Icon = item.icon; return <Link href={item.href} onClick={onClose} className={`motion-press flex items-center gap-3 rounded-card border px-3 py-3 text-sm ${active ? "border-brand bg-brand text-bg" : "border-line bg-surface-2 text-ink"}`}><Icon /><span>{item.label}</span></Link>; }
function isActive(pathname: string, href: string) { if (href === "/app/") return pathname === "/app" || pathname === "/app/"; return pathname.startsWith(href); }
function iconPath(children: React.ReactNode) { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>{children}</svg>; }
function DashboardIcon() { return iconPath(<path d="M4 5h7v6H4V5Zm9 0h7v4h-7V5ZM4 13h7v6H4v-6Zm9-2h7v8h-7v-8Z" stroke="currentColor" strokeWidth="2" />); }
function FeedIcon() { return iconPath(<path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />); }
function AnalyzeIcon() { return iconPath(<path d="M4 19 10 5l4 9 2-4 4 9M8 15h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />); }
function WatchIcon() { return iconPath(<path d="M12 6v6l4 2M21 12a9 9 0 1 1-2.6-6.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />); }
function BellIcon() { return iconPath(<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />); }
function CarIcon() { return iconPath(<path d="m5 13 2-5h10l2 5M5 13h14v5H5v-5Zm2 5v2m10-2v2M7 15h.1M17 15h.1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />); }
function CardIcon() { return iconPath(<path d="M3 7h18v10H3V7Zm0 3h18M7 15h3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />); }
function UserIcon() { return iconPath(<path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />); }
function ScanIcon() { return iconPath(<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />); }
function HeartIcon() { return iconPath(<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />); }
function StatsIcon() { return iconPath(<path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />); }
function CreatorIcon() { return iconPath(<path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.5L12 15.6l-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />); }
function MoreIcon() { return iconPath(<path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />); }