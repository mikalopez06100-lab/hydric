import { getDayType } from "@/lib/day-calculator";
import type { Profile } from "@/types";

export const DEFAULT_NOTIFICATION_START_HOUR = 9;
export const DEFAULT_NOTIFICATION_END_HOUR = 21;
export const DEFAULT_NOTIFICATION_INTERVAL_HOURS = 3;

const SENT_KEY_PREFIX = "hydric-notif-sent";

export function getNotificationSettings(profile: Profile) {
  return {
    enabled: profile.notifications,
    startHour: profile.notification_start_hour,
    endHour: profile.notification_end_hour,
    intervalHours: profile.notification_interval_hours,
  };
}

/** Heures de rappel sur la plage [début, fin] par pas régulier. */
export function getReminderHours(
  startHour: number,
  endHour: number,
  intervalHours: number
): number[] {
  if (intervalHours < 1 || startHour > endHour) return [];
  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h += intervalHours) {
    hours.push(h);
  }
  return hours;
}

export function formatReminderSchedule(
  startHour: number,
  endHour: number,
  intervalHours: number
): string {
  const hours = getReminderHours(startHour, endHour, intervalHours);
  if (hours.length === 0) return "—";
  return hours.map((h) => `${h}h`).join(", ");
}

export function isHydricDay(profile: Profile, date = new Date()): boolean {
  return getDayType(profile.start_date, date) === "hydric";
}

export function shouldSendReminderNow(
  profile: Profile,
  date = new Date()
): { send: boolean; hour: number } | null {
  const { enabled, startHour, endHour, intervalHours } =
    getNotificationSettings(profile);

  if (!enabled) return null;
  if (!isHydricDay(profile, date)) return null;

  const hour = date.getHours();
  const minute = date.getMinutes();
  const slots = getReminderHours(startHour, endHour, intervalHours);

  if (!slots.includes(hour) || minute > 0) return null;

  const dayKey = date.toISOString().slice(0, 10);
  const sentKey = `${SENT_KEY_PREFIX}-${dayKey}-${hour}`;
  if (typeof localStorage !== "undefined" && localStorage.getItem(sentKey)) {
    return null;
  }

  return { send: true, hour };
}

export function markReminderSent(hour: number, date = new Date()) {
  const dayKey = date.toISOString().slice(0, 10);
  localStorage.setItem(`${SENT_KEY_PREFIX}-${dayKey}-${hour}`, "1");
}

export type NotificationPermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (getNotificationPermission() === "unsupported") return "unsupported";
  const result = await Notification.requestPermission();
  return result as NotificationPermissionState;
}

export async function showHydrationReminder(
  profile: Profile,
  hour: number
): Promise<void> {
  if (getNotificationPermission() !== "granted") return;

  const { startHour, endHour, intervalHours } = getNotificationSettings(profile);
  const slots = getReminderHours(startHour, endHour, intervalHours);
  const isFirst = hour === slots[0];

  const title = "HYDRIC — Hydratation";
  const body = isFirst
    ? `${profile.prenom}, c'est un jour hydrique. Hydratez-vous régulièrement !`
    : `${profile.prenom}, petit rappel hydratation 💧`;

  const options: NotificationOptions = {
    body,
    icon: "/brand/logo-hydric.png",
    badge: "/brand/logo-hydric.png",
    tag: `hydric-hydration-${new Date().toISOString().slice(0, 13)}`,
    data: { url: "/tracker" },
  };

  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, options);
    return;
  }

  new Notification(title, options);
}
