"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Droplets, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getHydrationDomain,
  getTrendDomain,
  type TrendPeriod,
  type TrendPoint,
} from "@/lib/trends";

type Metric = "weight" | "hydration";

const PERIODS: { id: TrendPeriod; label: string }[] = [
  { id: "day", label: "Jour" },
  { id: "week", label: "Semaine" },
  { id: "month", label: "Mois" },
];

const METRICS: {
  id: Metric;
  label: string;
  icon: typeof Scale;
  unit: string;
}[] = [
  { id: "weight", label: "Poids", icon: Scale, unit: "kg" },
  { id: "hydration", label: "Hydratation", icon: Droplets, unit: "L" },
];

type TrendsData = {
  period: TrendPeriod;
  weight: TrendPoint[];
  hydration: TrendPoint[];
  goals: { weight_kg: number | null; water_ml: number };
};

function ValueLabel({
  x,
  y,
  value,
  unit,
}: {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  unit: string;
}) {
  const nx = typeof x === "number" ? x : Number(x);
  const ny = typeof y === "number" ? y : Number(y);
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(nx) || !Number.isFinite(ny) || !Number.isFinite(num)) {
    return null;
  }
  const text = unit === "kg" ? num.toFixed(2) : num.toFixed(2);
  return (
    <text
      x={nx}
      y={ny - 10}
      textAnchor="middle"
      fill="#6E8FA0"
      fontSize={10}
      fontFamily="var(--font-mono), ui-monospace, monospace"
    >
      {text}
    </text>
  );
}

export function HealthTrendsChart({
  weightGoalKg,
  waterGoalMl,
}: {
  weightGoalKg?: number;
  waterGoalMl: number;
}) {
  const [period, setPeriod] = useState<TrendPeriod>("day");
  const [metric, setMetric] = useState<Metric>("weight");
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);
    void fetch(`/api/trends?period=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger les tendances");
        return r.json();
      })
      .then((json: TrendsData) => setData(json))
      .catch(() =>
        setFetchError(
          "Données indisponibles. Vérifiez votre connexion ou réactivez le projet Supabase."
        )
      )
      .finally(() => setLoading(false));
  }, [period]);

  const activeMetric = METRICS.find((m) => m.id === metric)!;
  const rawPoints = useMemo(
    () => (metric === "weight" ? data?.weight : data?.hydration) ?? [],
    [data?.hydration, data?.weight, metric]
  );

  const chartData = useMemo(
    () =>
      rawPoints.map((p) => ({
        ...p,
        display:
          p.value != null
            ? metric === "hydration"
              ? p.value / 1000
              : p.value
            : undefined,
      })),
    [rawPoints, metric]
  );

  const hasValues = chartData.some((p) => p.display != null);

  const goalKg = weightGoalKg ?? data?.goals.weight_kg ?? null;
  const goalWaterMl = waterGoalMl ?? data?.goals.water_ml ?? 2500;

  const goalLine =
    metric === "weight" ? goalKg : goalWaterMl / 1000;

  const yDomain: [number, number] =
    metric === "weight"
      ? getTrendDomain(rawPoints, goalKg)
      : [
          getHydrationDomain(rawPoints, goalWaterMl)[0] / 1000,
          getHydrationDomain(rawPoints, goalWaterMl)[1] / 1000,
        ];

  const goalLabel =
    metric === "weight" && goalKg != null
      ? `Objectif ${goalKg} kg`
      : metric === "hydration"
        ? `Objectif ${(goalWaterMl / 1000).toFixed(1)} L`
        : null;

  return (
    <div
      className="mx-4 mb-4 overflow-hidden border border-rule bg-paper"
      style={{ borderRadius: 2 }}
    >
      <div className="border-b border-rule px-4 py-3">
        <p className="eyebrow-line font-mono text-[9px] uppercase tracking-wider text-ink-soft">
          Tendances santé
        </p>
        <h2 className="mt-1 font-serif text-lg font-normal text-ink">
          Poids &amp; <em className="italic text-water">hydratation</em>
        </h2>
      </div>

      <div className="flex gap-2 px-4 py-3">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={cn(
              "flex-1 border py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
              period === p.id
                ? "border-water bg-water text-bone"
                : "border-water/40 text-water hover:bg-water-mist"
            )}
            style={{ borderRadius: 2 }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative px-2 pb-2 pt-1">
        <p className="absolute left-4 top-1 z-10 font-mono text-[9px] uppercase tracking-wider text-ink-soft">
          {activeMetric.unit}
        </p>

        {loading ? (
          <div className="flex h-52 items-center justify-center">
            <p className="font-mono text-[10px] text-ink-soft">Chargement…</p>
          </div>
        ) : fetchError ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-xs text-clay-deep">{fetchError}</p>
          </div>
        ) : !hasValues ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-xs text-ink-soft">
              Pas encore assez de données pour afficher la courbe.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              Enregistrez votre poids ou votre hydratation
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={chartData}
              margin={{ top: 30, right: 12, left: -4, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hydricTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6E8FA0" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6E8FA0" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#E2DCCF"
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#8A918B" }}
                axisLine={{ stroke: "#E2DCCF" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 9, fill: "#8A918B" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  metric === "weight" ? v.toFixed(0) : v.toFixed(1)
                }
                width={34}
              />
              {goalLine != null && goalLabel && (
                <ReferenceLine
                  y={goalLine}
                  stroke="#6E8FA0"
                  strokeDasharray="6 4"
                  strokeOpacity={0.55}
                  label={{
                    value: goalLabel,
                    position: "insideTopLeft",
                    fill: "#6E8FA0",
                    fontSize: 9,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="display"
                stroke="#6E8FA0"
                strokeWidth={2}
                fill="url(#hydricTrendFill)"
                dot={{
                  r: 4,
                  fill: "#FBF9F4",
                  stroke: "#6E8FA0",
                  strokeWidth: 2,
                }}
                connectNulls={false}
              >
                <LabelList
                  dataKey="display"
                  content={(props) => (
                    <ValueLabel
                      x={props.x}
                      y={props.y}
                      value={
                        typeof props.value === "number" ||
                        typeof props.value === "string"
                          ? props.value
                          : undefined
                      }
                      unit={activeMetric.unit}
                    />
                  )}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center gap-10 border-t border-rule px-4 py-3">
        {METRICS.map((m) => {
          const Icon = m.icon;
          const active = metric === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetric(m.id)}
              className="relative flex flex-col items-center gap-1.5"
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute -top-3 h-0 w-0 border-x-[5px] border-b-[6px] border-x-transparent border-b-water"
                />
              )}
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center border transition-colors",
                  active
                    ? "border-water bg-water text-bone"
                    : "border-rule bg-bone-deep text-ink-faint"
                )}
                style={{ borderRadius: "50%" }}
              >
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-wider",
                  active ? "text-water" : "text-ink-faint"
                )}
              >
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
