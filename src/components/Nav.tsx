"use client";

import Link from "next/link";
import { useState } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Creators", href: "/creators/" },
  { label: "Login", href: "/login/" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-4 sm:px-6">
        <SnagdLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle compact />
          <Link
            href="/signup/"
            className="rounded-card bg-profit px-4 py-2 text-sm font-bold text-bg transition hover:brightness-105"
          >
            Get Snagd
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <button
            className="grid h-10 w-10 place-items-center rounded-card border border-line bg-surface text-ink"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span className="relative h-4 w-5">
              <span className={`absolute left-0 top-1 h-0.5 w-5 bg-current transition ${open ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`absolute bottom-1 left-0 h-0.5 w-5 bg-current transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav className="mx-auto flex max-w-shell flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-card px-3 py-3 text-sm text-ink transition hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/signup/"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-card bg-profit px-3 py-3 text-center text-sm font-bold text-bg"
            >
              Get Snagd
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Wordmark() {
  return <SnagdLogo />;
}