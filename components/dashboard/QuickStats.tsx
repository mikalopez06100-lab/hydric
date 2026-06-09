interface QuickStatsProps {
  weightLost: number;
  activeDays: number;
  completionPct: number;
}

export function QuickStats({
  weightLost,
  activeDays,
  completionPct,
}: QuickStatsProps) {
  const stats = [
    {
      tag: "Perte",
      value: weightLost > 0 ? `−${weightLost.toLocaleString("fr-FR")}` : "0",
      unit: " kg",
    },
    {
      tag: "Série",
      value: String(activeDays),
      unit: " j",
    },
    {
      tag: "Complét.",
      value: String(completionPct),
      unit: " %",
    },
  ];

  return (
    <div
      className="mx-4 mt-4 grid grid-cols-3 gap-px overflow-hidden border border-rule bg-rule"
      style={{ borderRadius: 2 }}
    >
      {stats.map((stat) => (
        <div key={stat.tag} className="bg-paper px-2.5 py-3.5">
          <div className="eyebrow-line mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-medium uppercase tracking-wider text-ink-soft">
            {stat.tag}
          </div>
          <div className="font-serif text-[23px] font-light leading-none text-ink">
            {stat.value}
            <span className="text-[11px] opacity-55">{stat.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
