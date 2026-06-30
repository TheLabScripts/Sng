export function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percent = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-ink">{label}</span>
        <span className="font-mono text-muted tnum">
          {used}/{limit}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-profit" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
