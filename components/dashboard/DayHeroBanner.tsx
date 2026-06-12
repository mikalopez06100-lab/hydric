"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DayType } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatLiters } from "@/lib/water";

interface DayHeroBannerProps {
  prenom: string;
  dayType: DayType;
  dayNumber: number;
  waterTotal: number;
  waterGoal: number;
}

export function DayHeroBanner({
  prenom,
  dayType,
  dayNumber,
  waterTotal,
  waterGoal,
}: DayHeroBannerProps) {
  const isHydric = dayType === "hydric";
  const dateLabel = format(new Date(), "EEEE dd.MM.yy", { locale: fr });
  const dayWord = isHydric ? "hydrique" : "alimentaire";

  return (
    <div className="relative overflow-hidden bg-ink px-5 pb-[22px] pt-6 text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,157,135,0.25) 0%, transparent 65%)",
        }}
      />

      <p className="eyebrow-line mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage">
        {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} · J{dayNumber}
      </p>

      <h1 className="font-serif text-[23px] font-light leading-[1.15] text-bone">
        Bonjour {prenom}.
        <br />
        Aujourd&apos;hui — <em className="italic text-sage">{dayWord}</em>.
      </h1>

      <p className="mt-1 text-xs leading-relaxed text-bone/55">
        {isHydric
          ? "Le corps se réinitialise. Eau, tisanes, bouillons clairs."
          : "Repas équilibrés et légers. Retrouve le plaisir de manger."}
      </p>

      {isHydric && (
        <div className="relative mt-3.5">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-bone/50">
            <span>Hydratation</span>
            <span>
              <strong className="font-medium text-bone">
                {formatLiters(waterTotal)}
              </strong>{" "}
              / {formatLiters(waterGoal)}
            </span>
          </div>
          <ProgressBar
            value={waterTotal}
            max={waterGoal}
            trackClassName="bg-bone/10"
            barClassName="bg-sage"
          />
        </div>
      )}
    </div>
  );
}
