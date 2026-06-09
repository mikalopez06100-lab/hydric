"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatLiters, WATER_TYPE_EMOJI, WATER_TYPE_LABELS } from "@/lib/mock-data";
import { useWaterStore } from "@/store/useWaterStore";
import { cn } from "@/lib/utils";

const INCREMENT = 250;

export function WaterTrackerPage() {
  const { logs, total_ml, goal_ml, addLog, removeLog } = useWaterStore();
  const remaining = Math.max(0, goal_ml - total_ml);
  const fillPct = Math.min(100, (total_ml / goal_ml) * 100);

  return (
    <div className="px-4 pb-4">
      <div className="card-v2 mb-3 p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">Eau du jour</h2>
          <span className="bg-sage-mist px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-sage-deep" style={{ borderRadius: 2 }}>
            Obj. {formatLiters(goal_ml)}
          </span>
        </div>

        <div className="relative mb-3.5 flex h-[130px] items-center justify-center overflow-hidden border border-rule bg-gradient-to-b from-water-mist to-water-pale">
          <div
            className="absolute bottom-0 left-0 right-0 bg-water/25 transition-all duration-500"
            style={{
              height: `${fillPct}%`,
              borderRadius: "80% 80% 0 0 / 30% 30% 0 0",
            }}
          />
          <div className="relative z-10 text-center">
            <div className="font-serif text-[38px] font-light leading-none text-water">
              {(total_ml / 1000).toLocaleString("fr-FR", {
                minimumFractionDigits: total_ml % 1000 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-base opacity-60"> L</span>
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-water">
              {remaining > 0
                ? `— Encore ${formatLiters(remaining)}`
                : "— Objectif atteint"}
            </div>
          </div>
        </div>

        <div className="mb-3.5 h-[3px] overflow-hidden bg-water-mist">
          <div
            className="h-full bg-water transition-all duration-500"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (total_ml >= INCREMENT) {
                const last = logs[logs.length - 1];
                if (last) removeLog(last.id);
              }
            }}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-rule bg-bone-deep text-lg font-medium text-ink"
            aria-label="Retirer 250 ml"
          >
            −
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mid">
            + 250 ml
          </span>
          <button
            type="button"
            onClick={() => addLog(INCREMENT, "water")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-clay text-lg font-medium text-bone"
            aria-label="Ajouter 250 ml"
          >
            +
          </button>
        </div>
      </div>

      <p className="eyebrow-line mb-2 flex items-center gap-2 px-0 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-soft">
        Log du jour
      </p>
      <div className="card-v2 overflow-hidden">
        {logs.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-soft">
            Aucune entrée aujourd&apos;hui
          </p>
        ) : (
          [...logs].reverse().map((log, i) => (
            <div
              key={log.id}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5",
                i < logs.length - 1 && "border-b border-rule"
              )}
            >
              <div className="flex items-center gap-2.5 text-[12px] text-ink">
                <span className="flex h-5 w-5 items-center justify-center text-sage-deep">
                  {WATER_TYPE_EMOJI[log.type]}
                </span>
                {WATER_TYPE_LABELS[log.type]} — {log.amount_ml} ml
              </div>
              <span className="font-mono text-[10px] tracking-wide text-ink-soft">
                {format(new Date(log.logged_at), "HH.mm", { locale: fr })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function SuggestedRecipeCard({
  id,
  title,
  subtitle,
  emoji,
}: {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
}) {
  return (
    <Link href={`/recettes/${id}`} className="card-v2 mx-4 mb-2 block px-4 py-3.5">
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-sage-mist text-base"
          style={{ borderRadius: 4 }}
        >
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-semibold text-ink">{title}</h4>
          <p className="text-[11px] text-ink-soft">{subtitle}</p>
        </div>
        <span className="font-mono text-sm font-medium text-sage-deep">→</span>
      </div>
    </Link>
  );
}
