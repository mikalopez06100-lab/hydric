"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TopBar } from "@/components/layout/TopBar";
import { WaterTrackerPage } from "@/components/tracker/WaterTracker";

export default function TrackerPage() {
  const today = format(new Date(), "EEEE dd.MM", { locale: fr });

  return (
    <>
      <TopBar
        title="Hydratation"
        right={
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {today.charAt(0).toUpperCase() + today.slice(1)}
          </span>
        }
      />
      <WaterTrackerPage />
    </>
  );
}
