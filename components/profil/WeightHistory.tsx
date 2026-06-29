"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WEIGHT_SOURCE_LABELS } from "@/lib/scales/catalog";
import type { WeightLog } from "@/types";

export function WeightHistory({
  goalKg,
  refreshKey = 0,
}: {
  goalKg?: number;
  refreshKey?: number;
}) {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetch("/api/weight")
      .then((r) => (r.ok ? r.json() : { logs: [] }))
      .then((data: { logs: WeightLog[] }) => {
        setLogs(
          [...(data.logs ?? [])].sort(
            (a, b) =>
              new Date(b.measured_at ?? b.logged_at).getTime() -
              new Date(a.measured_at ?? a.logged_at).getTime()
          )
        );
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <p className="font-mono text-[10px] text-ink-soft">Chargement de l&apos;historique…</p>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-center text-xs text-ink-soft">
        Aucune pesée enregistrée. Connectez une balance ou saisissez votre poids
        manuellement.
      </p>
    );
  }

  const chronological = [...logs].reverse();
  const weights = chronological.map((l) => Number(l.weight_kg));
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;
  const latest = logs[0];
  const oldest = logs[logs.length - 1];
  const delta =
    logs.length >= 2
      ? Math.round((Number(oldest.weight_kg) - Number(latest.weight_kg)) * 10) / 10
      : 0;

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-serif text-2xl font-light text-ink">
            {Number(latest.weight_kg).toLocaleString("fr-FR")}{" "}
            <span className="text-sm text-ink-soft">kg</span>
          </p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Dernière pesée ·{" "}
            {WEIGHT_SOURCE_LABELS[latest.source ?? "manual"] ?? "Saisie"}
          </p>
        </div>
        {logs.length >= 2 && (
          <p
            className={`font-mono text-xs ${
              delta > 0 ? "text-sage-deep" : delta < 0 ? "text-clay-deep" : "text-ink-soft"
            }`}
          >
            {delta > 0 ? `−${delta}` : delta < 0 ? `+${Math.abs(delta)}` : "0"} kg
          </p>
        )}
      </div>

      <div className="flex h-16 items-end gap-0.5 border-b border-rule pb-1">
        {chronological.slice(-20).map((log) => {
          const w = Number(log.weight_kg);
          const h = ((w - min) / range) * 100;
          const isGoal = goalKg != null && Math.abs(w - goalKg) < 0.5;
          return (
            <div
              key={log.id}
              className={`flex-1 min-w-[4px] transition-all ${
                isGoal ? "bg-sage-deep" : "bg-water/60"
              }`}
              style={{ height: `${Math.max(12, h)}%`, borderRadius: 1 }}
              title={`${w} kg`}
            />
          );
        })}
      </div>

      <ul className="mt-3 max-h-40 space-y-0 overflow-y-auto">
        {logs.slice(0, 10).map((log) => (
          <li
            key={log.id}
            className="flex items-center justify-between border-b border-rule py-1.5 text-[11px] last:border-0"
          >
            <span className="text-ink">
              {Number(log.weight_kg).toLocaleString("fr-FR")} kg
              <span className="ml-2 font-mono text-[9px] uppercase text-ink-soft">
                {WEIGHT_SOURCE_LABELS[log.source ?? "manual"]}
              </span>
            </span>
            <span className="font-mono text-[9px] text-ink-soft">
              {format(
                new Date(log.measured_at ?? log.logged_at),
                "dd MMM yyyy",
                { locale: fr }
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
