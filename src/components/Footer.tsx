import Link from "next/link";
import { nav, site } from "@/content/site";
import { Wordmark } from "./Nav";
import { StoreButtons } from "./StoreButtons";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto max-w-shell px-5 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-3 text-sm text-muted">
              {site.tagline} Snagd watches your area, filters the junk, and tells you what&rsquo;s
              actually worth chasing.
            </p>
            <StoreButtons className="mt-5" />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Product">
              {nav.map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Company">
              <FooterLink href="/creators/">Creators &amp; Partners</FooterLink>
              <FooterLink href="/support/">Support</FooterLink>
              <FooterLink href={`mailto:${site.supportEmail}`}>{site.supportEmail}</FooterLink>
            </FooterCol>
            <FooterCol title="Legal">
              <FooterLink href="/legal/privacy/">Privacy Policy</FooterLink>
              <FooterLink href="/legal/terms/">Terms</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Snagd. All rights reserved.</p>
          <p className="font-mono">Local flips worth chasing.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http") || href.startsWith("mailto");
  if (external)
    return (
      <a href={href} className="text-sm text-muted transition-colors hover:text-ink">
        {children}
      </a>
    );
  return (
    <Link href={href} className="text-sm text-muted transition-colors hover:text-ink">
      {children}
    </Link>
  );
}
