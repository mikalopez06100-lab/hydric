import { differenceInCalendarDays, parseISO } from "date-fns";
import type { DayType } from "@/types";

/**
 * J0 (start_date) = hydrique. J1 = alimentaire. J2 = hydrique. Etc.
 */
export function getDayType(
  startDate: string | Date,
  targetDate: Date = new Date()
): DayType {
  const start =
    typeof startDate === "string" ? parseISO(startDate) : startDate;
  const diff = differenceInCalendarDays(targetDate, start);
  return diff % 2 === 0 ? "hydric" : "food";
}

export function getWeekPlan(
  startDate: string | Date,
  days = 7,
  fromDate: Date = new Date()
): Array<{ date: Date; type: DayType }> {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(fromDate);
    date.setDate(fromDate.getDate() + i);
    return { date, type: getDayType(startDate, date) };
  });
}

export function getDayNumber(startDate: string | Date, targetDate = new Date()): number {
  const start =
    typeof startDate === "string" ? parseISO(startDate) : startDate;
  return differenceInCalendarDays(targetDate, start) + 1;
}

export function getDayLabel(type: DayType): string {
  return type === "hydric" ? "Jour Hydrique" : "Jour Alimentaire";
}

export function getDayEmoji(type: DayType): string {
  return type === "hydric" ? "💧" : "🍽";
}
