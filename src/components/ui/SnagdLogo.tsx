import Link from "next/link";

export function SnagdLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-ink" aria-label="Snagd home">
      <span className="grid h-8 w-8 place-items-center rounded-card bg-profit text-bg">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            d="M7.4 14.8c.8 1.8 2.4 2.8 4.7 2.8 2.1 0 3.5-.8 3.5-2.1 0-1.1-.8-1.7-2.8-2.1l-2-.4C7.8 12.4 6 10.8 6 8.2 6 5 8.7 3 12.4 3c3 0 5.2 1.2 6.3 3.7l-3.1 1.6c-.6-1.4-1.7-2-3.3-2-1.8 0-2.9.7-2.9 1.8 0 1 .7 1.6 2.6 2l2.1.4c3.4.7 5 2.3 5 4.9 0 3.3-2.8 5.2-7.1 5.2-3.6 0-6.2-1.5-7.4-4.2l2.8-1.6Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="font-display text-lg font-bold">Snagd</span>
    </Link>
  );
}