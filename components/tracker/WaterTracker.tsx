"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DRINK_VOLUMES_ML,
  GULP_ML,
  HYDRATION_DRINKS,
  WATER_INCREMENT_ML,
} from "@/lib/water-constants";
import { formatLiters, WATER_TYPE_EMOJI, WATER_TYPE_LABELS } from "@/lib/water";
import { useWaterStore } from "@/store/useWaterStore";
import { cn } from "@/lib/utils";
import type { WaterType } from "@/types";

export function WaterTrackerPage() {
  const { logs, total_ml, goal_ml, loading, addLog, removeLog } = useWaterStore();
  const [gulpCount, setGulpCount] = useState(2);
  const [selectedDrink, setSelectedDrink] = useState<WaterType | null>(null);
  const [customMl, setCustomMl] = useState("200");

  const remaining = Math.max(0, goal_ml - total_ml);
  const fillPct = Math.min(100, (total_ml / goal_ml) * 100);
  const gulpTotal = gulpCount * GULP_ML;

  async function addGulps() {
    if (gulpCount < 1) return;
    await addLog(gulpTotal, "water");
  }

  async function addDrink(type: WaterType, amount_ml: number) {
    await addLog(amount_ml, type);
    setSelectedDrink(null);
  }

  return (
    <div className="px-4 pb-4">
      <div className="card-v2 mb-3 p-[18px]">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">Eau du jour</h2>
          <span
            className="bg-sage-mist px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-sage-deep"
            style={{ borderRadius: 2 }}
          >
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

        <div className="mb-4 h-[3px] overflow-hidden bg-water-mist">
          <div
            className="h-full bg-water transition-all duration-500"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        {/* Eau — tranches de 250 ml */}
        <p className="eyebrow-line mb-2 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Eau
        </p>
        <div className="mb-4 flex items-center justify-center gap-5">
          <button
            type="button"
            disabled={loading || total_ml < WATER_INCREMENT_ML}
            onClick={() => {
              const last = logs[logs.length - 1];
              if (last) void removeLog(last.id);
            }}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-rule bg-bone-deep text-lg font-medium text-ink disabled:opacity-40"
            aria-label="Annuler la dernière entrée"
          >
            −
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-mid">
            + {WATER_INCREMENT_ML} ml
          </span>
          <button
            type="button"
            disabled={loading}
            onClick={() => void addLog(WATER_INCREMENT_ML, "water")}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-clay text-lg font-medium text-bone disabled:opacity-40"
            aria-label={`Ajouter ${WATER_INCREMENT_ML} ml`}
          >
            +
          </button>
        </div>

        {/* Gorgées */}
        <p className="eyebrow-line mb-2 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Gorgées
        </p>
        <div className="mb-4 rounded-sm border border-rule bg-bone-deep p-3">
          <p className="text-center text-[11px] text-ink-mid">
            ~{GULP_ML} ml par gorgée
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={loading || gulpCount <= 1}
              onClick={() => setGulpCount((c) => Math.max(1, c - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-lg text-ink disabled:opacity-40"
              aria-label="Moins une gorgée"
            >
              −
            </button>
            <div className="min-w-[72px] text-center">
              <div className="font-serif text-2xl font-light text-ink">
                {gulpCount}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                = {gulpTotal} ml
              </div>
            </div>
            <button
              type="button"
              disabled={loading || gulpCount >= 20}
              onClick={() => setGulpCount((c) => Math.min(20, c + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-lg text-ink disabled:opacity-40"
              aria-label="Plus une gorgée"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => void addGulps()}
            className="btn-clay mt-3 w-full py-2.5 text-[11px] disabled:opacity-50"
          >
            Ajouter {gulpCount} gorgée{gulpCount > 1 ? "s" : ""}
          </button>
        </div>

        {/* Tisanes & bouillons */}
        <p className="eyebrow-line mb-2 flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Thé, tisanes & bouillons
        </p>
        <div className="grid grid-cols-2 gap-2">
          {HYDRATION_DRINKS.map((drink) => (
            <button
              key={drink.type}
              type="button"
              disabled={loading}
              onClick={() =>
                setSelectedDrink(
                  selectedDrink === drink.type ? null : drink.type
                )
              }
              className={cn(
                "border px-3 py-2.5 text-left text-[12px] transition-colors",
                selectedDrink === drink.type
                  ? "border-sage-deep bg-sage-mist text-ink"
                  : "border-rule bg-paper text-ink-mid"
              )}
              style={{ borderRadius: 2 }}
            >
              <span className="mr-1">{drink.emoji}</span>
              {drink.label}
            </button>
          ))}
        </div>

        {selectedDrink && (
          <div className="mt-2 border border-rule bg-paper p-3" style={{ borderRadius: 2 }}>
            <p className="mb-2 text-[11px] text-ink-mid">Volume</p>
            <div className="flex flex-wrap gap-2">
              {DRINK_VOLUMES_ML.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  disabled={loading}
                  onClick={() => void addDrink(selectedDrink, ml)}
                  className="border border-rule bg-bone-deep px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink hover:border-sage-deep disabled:opacity-50"
                  style={{ borderRadius: 2 }}
                >
                  {ml} ml
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min={25}
                max={2000}
                step={25}
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                className="flex-1 border border-rule bg-bone px-2 py-1.5 text-sm text-ink outline-none focus:border-sage-deep"
                style={{ borderRadius: 2 }}
                placeholder="Autre volume"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  const ml = parseInt(customMl, 10);
                  if (ml >= 25 && ml <= 2000) void addDrink(selectedDrink, ml);
                }}
                className="btn-clay shrink-0 px-3 py-1.5 text-[10px] disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}
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
                {log.type === "water" &&
                  log.amount_ml % GULP_ML === 0 &&
                  log.amount_ml < WATER_INCREMENT_ML && (
                    <span className="font-mono text-[9px] text-ink-soft">
                      ({log.amount_ml / GULP_ML} gorgée
                      {log.amount_ml / GULP_ML > 1 ? "s" : ""})
                    </span>
                  )}
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
