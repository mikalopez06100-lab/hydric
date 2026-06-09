"use client";

import { ProfilHeader, ProfilMenu, StatsGrid } from "@/components/profil/ProfilViews";
import { GatingBanner } from "@/components/ui/GatingBanner";
import { canAccess } from "@/lib/plan-gates";
import { getDayNumber } from "@/lib/day-calculator";
import { useUserStore } from "@/store/useUserStore";

export default function ProfilPage() {
  const { profile, logout } = useUserStore();
  if (!profile) return null;

  const activeDays = getDayNumber(profile.start_date);
  const showChart = canAccess(profile.plan, "weight_chart");

  return (
    <>
      <ProfilHeader
        prenom={profile.prenom}
        plan={profile.plan}
        activeDays={activeDays}
        weightLost={1.8}
        completionPct={85}
      />
      {showChart ? (
        <StatsGrid
          weightLost={1.8}
          avgWater="1,6 L"
          streak={10}
          completionPct={85}
        />
      ) : (
        <div className="px-4 py-4">
          <GatingBanner feature="l'historique de progression 30j" />
        </div>
      )}
      <ProfilMenu plan={profile.plan} />
      <div className="px-4 pb-8">
        <button
          type="button"
          onClick={logout}
          className="w-full border border-rule py-3 font-mono text-[11px] uppercase tracking-wider text-ink-mid"
          style={{ borderRadius: 2 }}
        >
          Se déconnecter
        </button>
      </div>
    </>
  );
}
