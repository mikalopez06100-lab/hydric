import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ProfileHydrator } from "@/components/providers/ProfileHydrator";
import { NotificationScheduler } from "@/components/providers/NotificationScheduler";
import { TrackingSync } from "@/components/providers/TrackingSync";
import { WaterHydrator } from "@/components/providers/WaterHydrator";
import { fulfillStripePending, hasActiveAccess } from "@/lib/access";
import { getProfile, isProfileOnboarded } from "@/lib/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function AppShell({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <div className="relative mx-auto min-h-screen max-w-phone bg-bone pb-20">
            {children}
            <BottomNav />
            <InstallPrompt />
          </div>
        </TrackingSync>
      </WaterHydrator>
    </ProfileHydrator>
  );
}
