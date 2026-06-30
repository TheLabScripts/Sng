import Link from "next/link";
import { SnagdLogo } from "@/components/ui/SnagdLogo";

const productLinks = [
  { label: "Pricing", href: "/pricing/" },
  { label: "Creators", href: "/creators/" },
  { label: "Login", href: "/login/" },
  { label: "Sign up", href: "/signup/" },
];

const appLinks = [
  { label: "Dashboard demo", href: "/app/" },
  { label: "Analyze a deal", href: "/app/analyze/" },
  { label: "Vehicle Mode", href: "/app/vehicle-mode/" },
  { label: "Billing", href: "/app/billing/" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/55">
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <SnagdLogo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Snagd watches your area, filters the junk, and tells you what is actually worth chasing.
            </p>
            <p className="mt-4 text-sm font-bold text-brand">Get Snag&apos;d.</p>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="App demo" links={appLinks} />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Snagd. All rights reserved.</p>
          <p>Safe source layers only. No marketplace login automation.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm text-muted transition hover:text-ink">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

