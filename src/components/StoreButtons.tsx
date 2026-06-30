import { site } from "@/content/site";

// App-store download buttons. If the real store URLs aren't set yet (pre-launch),
// they fall back to the waitlist URL or a disabled "coming soon" state — the
// site never ships a dead button.
function StoreBadge({
  href,
  kicker,
  store,
  glyph,
}: {
  href: string;
  kicker: string;
  store: string;
  glyph: React.ReactNode;
}) {
  const live = href !== "";
  const target = live ? href : site.waitlistUrl || "#";
  const label = live ? kicker : "Coming soon —";

  return (
    <a
      href={target}
      {...(target.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-disabled={!live && !site.waitlistUrl}
      className={`group inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 transition-colors hover:border-brand/40 ${
        !live && !site.waitlistUrl ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <span className="text-ink">{glyph}</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
        <span className="text-sm font-semibold text-ink">{store}</span>
      </span>
    </a>
  );
}

export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <StoreBadge
        href={site.appStoreUrl}
        kicker="Download on the"
        store="App Store"
        glyph={
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M16.4 12.9c0-2 1.6-3 1.7-3a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7a3.9 3.9 0 0 0-3.3 2c-1.4 2.4-.4 6 1 8 .7.9 1.4 2 2.5 2 1 0 1.3-.7 2.6-.7s1.6.7 2.6.6c1.1 0 1.8-.9 2.4-1.9a8 8 0 0 0 1.1-2.3c-.1 0-2.1-.8-2.1-3.3ZM14.5 6.4c.6-.7 1-1.6.9-2.6-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 2-.5 2.5-1.2Z" />
          </svg>
        }
      />
      <StoreBadge
        href={site.playStoreUrl}
        kicker="Get it on"
        store="Google Play"
        glyph={
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <path d="M4 3.5 14 12 4 20.5c-.4-.2-.6-.6-.6-1.1V4.6c0-.5.2-.9.6-1.1Z" fill="#bb9af7" />
            <path d="m14 12 3-2.6 2.8 1.6c.8.5.8 1.5 0 2L17 14.6 14 12Z" fill="#7aa2f7" />
            <path d="M4 3.5c.3-.1.7-.1 1 .1L17 9.4 14 12 4 3.5Z" fill="#c0caf5" opacity=".85" />
            <path d="M4 20.5 14 12l3 2.6-12 6.8c-.3.2-.7.2-1 .1Z" fill="#f7768e" opacity=".85" />
          </svg>
        }
      />
    </div>
  );
}
