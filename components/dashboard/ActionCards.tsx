import Link from "next/link";
import { CalendarDays, Droplets } from "lucide-react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatLiters } from "@/lib/mock-data";

interface ActionCardsProps {
  waterTotal: number;
  waterGoal: number;
}

function ActionCard({
  href,
  icon,
  iconClass,
  title,
  subtitle,
  progress,
}: {
  href: string;
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  subtitle: string;
  progress?: { value: number; max: number };
}) {
  return (
    <Link href={href} className="card-v2 mx-4 mb-2 block px-4 py-3.5">
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center ${iconClass}`}
          style={{ borderRadius: 4 }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-semibold text-ink">{title}</h4>
          <p className="text-[11px] tracking-wide text-ink-soft">{subtitle}</p>
          {progress && (
            <ProgressBar
              value={progress.value}
              max={progress.max}
              className="mt-2.5"
            />
          )}
        </div>
        <span className="font-mono text-sm font-medium text-sage-deep">→</span>
      </div>
    </Link>
  );
}

export function ActionCards({ waterTotal, waterGoal }: ActionCardsProps) {
  return (
    <>
      <SectionEyebrow>Actions du jour</SectionEyebrow>
      <ActionCard
        href="/tracker"
        icon={<Droplets className="h-4 w-4 text-sage-deep" />}
        iconClass="bg-sage-mist"
        title="Tracker l'hydratation"
        subtitle={`${formatLiters(waterTotal)} · objectif ${formatLiters(waterGoal)}`}
        progress={{ value: waterTotal, max: waterGoal }}
      />
      <ActionCard
        href="/planning"
        icon={<CalendarDays className="h-4 w-4 text-ink-mid" />}
        iconClass="bg-bone-deep border border-rule"
        title="Planning semaine"
        subtitle="7 prochains jours"
      />
    </>
  );
}
