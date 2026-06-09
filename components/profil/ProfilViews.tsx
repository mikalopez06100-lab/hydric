"use client";

import Link from "next/link";
import { getPlanLabel, getPlanPrice } from "@/lib/plan-gates";
import type { PlanTier } from "@/types";

interface StatsGridProps {
  weightLost: number;
  avgWater: string;
  streak: number;
  completionPct: number;
}

export function StatsGrid({
  weightLost,
  avgWater,
  streak,
  completionPct,
}: StatsGridProps) {
  const stats = [
    {
      tag: "Perte",
      value: `−${weightLost}`,
      unit: " kg",
      label: "Perte totale",
      delta: "↓ depuis J1",
      deltaClay: false,
    },
    {
      tag: "Eau",
      value: avgWater.replace(" L", ""),
      unit: " L",
      label: "Moyenne / jour",
      delta: "+0,2 L ce mois",
      deltaClay: false,
    },
    {
      tag: "Série",
      value: String(streak),
      unit: " j",
      label: "Série en cours",
      delta: "Record : 12 j",
      deltaClay: false,
    },
    {
      tag: "Régul.",
      value: String(completionPct),
      unit: " %",
      label: "Taux complétion",
      delta: "+5% vs M-1",
      deltaClay: true,
    },
  ];

  return (
    <div
      className="mx-4 mb-2.5 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule"
      style={{ borderRadius: 2 }}
    >
      {stats.map((stat) => (
        <div key={stat.tag} className="bg-paper p-3.5">
          <div className="eyebrow-line mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-medium uppercase tracking-wider text-ink-soft">
            {stat.tag}
          </div>
          <div className="font-serif text-[26px] font-light leading-none text-ink">
            {stat.value}
            <span className="text-sm opacity-55">{stat.unit}</span>
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">{stat.label}</div>
          <div
            className={`mt-1.5 font-mono text-[9px] uppercase tracking-wide ${
              stat.deltaClay ? "text-clay-deep" : "text-sage-deep"
            }`}
          >
            {stat.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProfilHeaderProps {
  prenom: string;
  plan: PlanTier;
  activeDays: number;
  weightLost: number;
  completionPct: number;
}

export function ProfilHeader({
  prenom,
  plan,
  activeDays,
  weightLost,
  completionPct,
}: ProfilHeaderProps) {
  const initial = prenom.charAt(0).toUpperCase();

  return (
    <div className="relative overflow-hidden bg-sage px-5 pb-[22px] pt-6 text-center text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(244,241,234,0.12) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-bone/30 bg-bone/15 font-serif text-[26px] font-medium">
        {initial}
      </div>
      <h1 className="relative font-serif text-xl font-normal">{prenom} M.</h1>
      <span
        className="relative mt-2 inline-flex items-center gap-1.5 border border-bone/20 bg-bone/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider"
        style={{ borderRadius: 2 }}
      >
        <span className="h-[5px] w-[5px] rounded-full bg-clay" />
        Plan {getPlanLabel(plan)}
      </span>
      <div className="relative mt-4 flex items-center justify-center gap-4">
        {[
          { value: String(activeDays), label: "Jours" },
          { value: `−${weightLost}`, label: "Kg perdus" },
          { value: `${completionPct}%`, label: "Complét." },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-4">
            {i > 0 && <div className="h-8 w-px bg-bone/15" />}
            <div className="text-center">
              <div className="font-serif text-[22px] font-light leading-none">
                {item.value}
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-bone/55">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilMenu({ plan }: { plan: PlanTier }) {
  const items = [
    {
      icon: "⚙",
      title: "Mon abonnement",
      subtitle: `${getPlanLabel(plan)} · ${getPlanPrice(plan)}`,
      href: "/profil",
    },
    {
      icon: "◎",
      title: "Mes objectifs",
      subtitle: "Poids cible · rythme",
      href: "/profil",
    },
    {
      icon: "🔔",
      title: "Notifications",
      subtitle: "Rappels hydratation",
      href: "/profil",
    },
  ];

  return (
    <div className="px-4 py-2">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="flex items-center gap-3 border-b border-rule py-3 last:border-0"
        >
          <div
            className="flex h-8 w-8 items-center justify-center border border-rule bg-bone-deep text-[13px] text-ink-mid"
            style={{ borderRadius: 4 }}
          >
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-[13px] font-medium text-ink">{item.title}</h5>
            <p className="font-mono text-[10px] tracking-wide text-ink-soft">
              {item.subtitle}
            </p>
          </div>
          <span className="font-mono text-[13px] text-sage-deep">→</span>
        </Link>
      ))}
    </div>
  );
}
