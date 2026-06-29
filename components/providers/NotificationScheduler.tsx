"use client";

import { useEffect } from "react";
import { useProfile } from "@/components/providers/ProfileHydrator";
import {
  getNotificationPermission,
  markReminderSent,
  shouldSendReminderNow,
  showHydrationReminder,
} from "@/lib/notifications";

const CHECK_MS = 30_000;

export function NotificationScheduler() {
  const profile = useProfile();

  useEffect(() => {
    if (!profile?.notifications) return;
    if (getNotificationPermission() !== "granted") return;

    function tick() {
      if (!profile) return;
      const slot = shouldSendReminderNow(profile);
      if (!slot?.send) return;

      void showHydrationReminder(profile, slot.hour).then(() => {
        markReminderSent(slot.hour);
      });
    }

    tick();
    const id = window.setInterval(tick, CHECK_MS);
    return () => window.clearInterval(id);
  }, [profile]);

  return null;
}
