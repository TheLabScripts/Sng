"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Dashboard", href: "/app/", icon: DashboardIcon },
  { label: "Deal Feed", href: "/app/deal-feed/", icon: FeedIcon },
  { label: "Analyze", href: "/app/analyze/", icon: AnalyzeIcon },
  { label: "Watchlists", href: "/app/watchlists/", icon: WatchIcon },
  { label: "Alerts", href: "/app/alerts/", icon: BellIcon },
  { label: "Vehicle Mode", href: "/app/vehicle-mode/", icon: CarIcon },
  { label: "Billing", href: "/app/billing/", icon: CardIcon },
  { label: "Account", href: "/app/account/", icon: UserIcon },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const existing = window.localStorage.getItem("snagd-session");
    if (!existing) {
      window.localStorage.setItem(
        "snagd-session",
        JSON.stringify({ name: "Demo reseller", email: "demo@snagd.app", plan: "Founder" }),
      );
    }
  }, []);

  const activeItem =
    navItems.find((item) => item.href !== "/app/" && pathname.startsWith(item.href)) ?? navItems[0];

  function signOut() {
    window.localStorage.removeItem("snagd-session");
    window.location.href = "/login/";
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-line bg-surface/70 px-4 py-5 md:block">
          <SnagdLogo href="/app/" />
          <nav className="mt-8 grid gap-1">
            {navItems.map((item) => (
              <AppNavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-line bg-bg/92 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">Snagd app</p>
                <h1 className="truncate text-xl font-bold text-ink">{activeItem.label}</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-card border border-line bg-surface px-3 py-2 text-xs text-muted sm:inline-flex">
                  Demo session
                </span>
                <ThemeToggle compact />
                <button
                  type="button"
                  onClick={signOut}
                  className="hidden h-10 rounded-card border border-line bg-surface px-3 text-sm text-muted transition hover:text-ink sm:inline-flex sm:items-center"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-8">{children}</main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/96 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="no-scrollbar flex overflow-x-auto px-2 py-2">
          {navItems.map((item) => (
            <MobileNavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </div>
      </nav>
    </div>
  );
}

function AppNavLink({
  item,
  active,
}: {
  item: (typeof navItems)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex h-11 items-center gap-3 rounded-card px-3 text-sm transition ${
        active ? "bg-profit text-bg" : "text-muted hover:bg-surface-2 hover:text-ink"
      }`}
    >
      <Icon />
      <span>{item.label}</span>
    </Link>
  );
}

function MobileNavLink({
  item,
  active,
}: {
  item: (typeof navItems)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex min-w-[76px] flex-col items-center justify-center gap-1 rounded-card px-2 py-2 text-[11px] ${
        active ? "bg-profit text-bg" : "text-muted"
      }`}
    >
      <Icon />
      <span className="whitespace-nowrap">{item.label.replace(" Mode", "")}</span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/app/") return pathname === "/app" || pathname === "/app/";
  return pathname.startsWith(href);
}

function iconPath(children: React.ReactNode) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

function DashboardIcon() {
  return iconPath(<path d="M4 5h7v6H4V5Zm9 0h7v4h-7V5ZM4 13h7v6H4v-6Zm9-2h7v8h-7v-8Z" stroke="currentColor" strokeWidth="2" />);
}

function FeedIcon() {
  return iconPath(<path d="M5 6h14M5 12h14M5 18h9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />);
}

function AnalyzeIcon() {
  return iconPath(<path d="M4 19 10 5l4 9 2-4 4 9M8 15h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />);
}

function WatchIcon() {
  return iconPath(<path d="M12 6v6l4 2M21 12a9 9 0 1 1-2.6-6.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />);
}

function BellIcon() {
  return iconPath(<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />);
}

function CarIcon() {
  return iconPath(<path d="m5 13 2-5h10l2 5M5 13h14v5H5v-5Zm2 5v2m10-2v2M7 15h.1M17 15h.1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />);
}

function CardIcon() {
  return iconPath(<path d="M3 7h18v10H3V7Zm0 3h18M7 15h3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />);
}

function UserIcon() {
  return iconPath(<path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />);
}