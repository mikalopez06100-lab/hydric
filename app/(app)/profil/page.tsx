"use client";

import { useEffect, useState } from "react";
import { ProfilHeader, StatsGrid } from "@/components/profil/ProfilViews";
import { ProfilSettings } from "@/components/profil/ProfilSettings";
import { GatingBanner } from "@/components/ui/GatingBanner";
import { isDevOpenAccess } from "@/lib/dev";
import { canAccess } from "@/lib/plan-gates";
import { getDayNumber } from "@/lib/day-calculator";
import { formatLiters } from "@/lib/water";
import { useStatsStore } from "@/store/useStatsStore";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/components/providers/ProfileHydrator";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const profile = useProfile();
  const logout = useUserStore((s) => s.logout);
  const stats = useStatsStore((s) => s.stats);
  const [currentWeightKg, setCurrentWeightKg] = useState<number | null>(null);

  useEffect(() => {
    void fetch("/api/weight")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { logs?: { weight_kg: number }[] } | null) => {
        if (data?.logs?.[0]) setCurrentWeightKg(data.logs[0].weight_kg);
      });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    router.push("/login");
  }

  if (!profile) return null;

  const activeDays = getDayNumber(profile.start_date);
  const showChart =
    canAccess(profile.plan, "weight_chart") || isDevOpenAccess();

  return (
    <>
      <ProfilHeader
        prenom={profile.prenom}
        plan={profile.plan}
        activeDays={activeDays}
        weightLost={stats.weightLost}
        completionPct={stats.completionPct}
        avatarUrl={profile.avatar_url}
        currentWeightKg={currentWeightKg}
        targetWeightKg={profile.weight_goal_kg}
      />
      {showChart ? (
        <StatsGrid
          weightLost={stats.weightLost}
          avgWater={formatLiters(stats.avgWaterMl)}
          streak={stats.completedDays}
          completionPct={stats.completionPct}
        />
      ) : (
        <div className="px-4 py-4">
          <GatingBanner feature="l'historique de progression 30j" />
        </div>
      )}
      <ProfilSettings />
      <div className="px-4 pb-8 pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full border border-rule py-3 font-mono text-[11px] uppercase tracking-wider text-ink-mid"
          style={{ borderRadius: 2 }}
        >
          Se déconnecter
        </button>
      </div>
    </>
  );
}
