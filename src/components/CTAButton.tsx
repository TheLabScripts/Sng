import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "ghost";

export function CTAButton({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-brand text-white hover:brightness-110 shadow-[0_14px_38px_-18px_rgba(37,99,235,0.42)]"
      : "border border-line bg-surface text-ink hover:border-brand/50 hover:text-brand";

  const external = href.startsWith("http");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}


