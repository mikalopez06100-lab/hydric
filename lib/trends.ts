import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";

export type TrendPeriod = "day" | "week" | "month";
export type TrendMetric = "weight" | "hydration";

export type TrendPoint = {
  key: string;
  label: string;
  value: number | null;
};

type WeightRow = { weight_kg: number; logged_at: string; measured_at?: string | null };
type WaterRow = { amount_ml: number; logged_at: string };

function weightAt(row: WeightRow): Date {
  return new Date(row.measured_at ?? row.logged_at);
}

function waterAt(row: WaterRow): Date {
  return new Date(row.logged_at);
}

function bucketKey(date: Date, period: TrendPeriod): string {
  if (period === "day") return format(date, "yyyy-MM-dd");
  if (period === "week") {
    return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
  }
  return format(startOfMonth(date), "yyyy-MM");
}

function bucketLabel(key: string, period: TrendPeriod): string {
  const date =
    period === "month"
      ? parseISO(`${key}-01`)
      : parseISO(key);
  if (period === "day") return format(date, "d MMM", { locale: fr });
  if (period === "week") return format(date, "d MMM", { locale: fr });
  return format(date, "MMM yy", { locale: fr });
}

function getInterval(period: TrendPeriod): { start: Date; end: Date } {
  const end = new Date();
  if (period === "day") return { start: subDays(end, 29), end };
  if (period === "week") return { start: subWeeks(end, 11), end };
  return { start: subMonths(end, 5), end };
}

function buildBuckets(period: TrendPeriod): string[] {
  const { start, end } = getInterval(period);
  if (period === "day") {
    return eachDayOfInterval({ start, end }).map((d) => bucketKey(d, period));
  }
  if (period === "week") {
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((d) =>
      bucketKey(d, period)
    );
  }
  return eachMonthOfInterval({ start, end }).map((d) => bucketKey(d, period));
}

function inBucket(date: Date, key: string, period: TrendPeriod): boolean {
  return bucketKey(date, period) === key;
}

function trimTrendPoints(points: TrendPoint[]): TrendPoint[] {
  const firstWithData = points.findIndex((p) => p.value != null);
  if (firstWithData === -1) {
    return points.length > 0 ? [points[points.length - 1]!] : [];
  }
  return points.slice(firstWithData);
}

export function buildWeightTrend(
  logs: WeightRow[],
  period: TrendPeriod
): TrendPoint[] {
  const buckets = buildBuckets(period);
  const sorted = [...logs].sort(
    (a, b) => weightAt(a).getTime() - weightAt(b).getTime()
  );

  return trimTrendPoints(
    buckets.map((key) => {
      const inRange = sorted.filter((row) => inBucket(weightAt(row), key, period));
      if (!inRange.length) {
        return { key, label: bucketLabel(key, period), value: null };
      }
      const avg =
        inRange.reduce((sum, row) => sum + Number(row.weight_kg), 0) /
        inRange.length;
      return {
        key,
        label: bucketLabel(key, period),
        value: Math.round(avg * 100) / 100,
      };
    })
  );
}

export function buildHydrationTrend(
  logs: WaterRow[],
  period: TrendPeriod
): TrendPoint[] {
  const buckets = buildBuckets(period);
  const sorted = [...logs].sort(
    (a, b) => waterAt(a).getTime() - waterAt(b).getTime()
  );

  return trimTrendPoints(
    buckets.map((key) => {
      const inRange = sorted.filter((row) => inBucket(waterAt(row), key, period));
      if (!inRange.length) {
        return { key, label: bucketLabel(key, period), value: null };
      }
      const total = inRange.reduce((sum, row) => sum + row.amount_ml, 0);
      const activeDays = new Set(
        inRange.map((row) => format(waterAt(row), "yyyy-MM-dd"))
      ).size;
      const value =
        period === "day" ? total : Math.round(total / Math.max(1, activeDays));
      return {
        key,
        label: bucketLabel(key, period),
        value,
      };
    })
  );
}

export function getTrendDomain(
  points: TrendPoint[],
  goal: number | null | undefined,
  padding = 0.08
): [number, number] {
  const values = points
    .map((p) => p.value)
    .filter((v): v is number => v != null);
  if (goal != null) values.push(goal);
  if (!values.length) return [0, 100];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || Math.max(max * 0.1, 1);
  const pad = span * padding;
  return [
    Math.floor((min - pad) * 10) / 10,
    Math.ceil((max + pad) * 10) / 10,
  ];
}

export function getHydrationDomain(
  points: TrendPoint[],
  goalMl: number,
  padding = 0.12
): [number, number] {
  const values = points
    .map((p) => p.value)
    .filter((v): v is number => v != null);
  values.push(goalMl);
  if (!values.length) return [0, goalMl * 1.2];

  const max = Math.max(...values);
  const min = 0;
  const span = max - min || goalMl;
  return [min, Math.ceil(max + span * padding)];
}
