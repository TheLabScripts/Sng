export function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
      {children}
    </span>
  );
}


