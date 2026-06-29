import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ProfileHydrator } from "@/components/providers/ProfileHydrator";
import { NotificationScheduler } from "@/components/providers/NotificationScheduler";
import { TrackingSync } from "@/components/providers/TrackingSync";
import { WaterHydrator } from "@/components/providers/WaterHydrator";
import { ServiceUnavailable } from "@/components/ui/ServiceUnavailable";
import { fulfillStripePending, hasActiveAccess } from "@/lib/access";
import { getProfile, isProfileOnboarded } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function AppShell({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  let user;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    return (
      <ServiceUnavailable message="Impossible de joindre Supabase. Vérifiez que le projet n'est pas en pause sur supabase.com." />
    );
  }

  if (!user) {
    redirect("/login");
  }

  await fulfillStripePending(supabase, user.id, user.email ?? "");

  const profile = await getProfile(supabase, user.id);

  if (!profile || !isProfileOnboarded({ prenom: profile.prenom })) {
    redirect("/onboarding");
  }

  if (!hasActiveAccess(profile.stripe_status)) {
    redirect("/acces?reason=subscription");
  }

  return (
    <ProfileHydrator profile={profile}>
      <WaterHydrator goalMl={profile.water_goal_ml}>
        <TrackingSync>
          <NotificationScheduler />
          <div className="min-h-screen bg-bone md:bg-rule md:py-6">
            <div className="relative mx-auto flex min-h-screen w-full max-w-phone flex-col bg-bone pb-20 md:min-h-[calc(100dvh-3rem)] md:border md:border-rule md:shadow-[0_8px_40px_rgba(26,31,27,0.08)]">
              <AppHeader />
              <main className="flex-1">{children}</main>
              <BottomNav />
              <InstallPrompt />
            </div>
          </div>
        </TrackingSync>
      </WaterHydrator>
    </ProfileHydrator>
  );
}
