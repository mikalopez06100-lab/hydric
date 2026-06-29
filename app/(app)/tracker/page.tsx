"use client";

import { WaterTrackerPage } from "@/components/tracker/WaterTracker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function TrackerPage() {
  const today = format(new Date(), "EEEE dd.MM", { locale: fr });

  return (
    <>
      <p className="px-4 pb-1 pt-2 text-right font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        {today.charAt(0).toUpperCase() + today.slice(1)}
      </p>
      <WaterTrackerPage />
    </>
  );
}
