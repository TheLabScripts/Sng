export function LegalBody({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: [string, string][];
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl font-black tracking-tight text-ink">{title}</h1>
      <p className="mt-3 font-mono text-xs text-muted">
        Last updated: {updated}
      </p>
      <div className="mt-10 space-y-8">
        {sections.map(([h, b]) => (
          <section key={h}>
            <h2 className="font-display text-lg font-bold text-ink">{h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{b}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

