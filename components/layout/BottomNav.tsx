"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarDays,
  Droplets,
  Home,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/tendances", icon: Activity, label: "Tendances" },
  { href: "/planning", icon: CalendarDays, label: "Plans" },
  { href: "/tracker", icon: Droplets, label: "Suivi" },
  { href: "/recettes", icon: UtensilsCrossed, label: "Recettes" },
  { href: "/profil", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-phone -translate-x-1/2 border-t border-rule bg-paper safe-bottom">
      <div className="flex items-start justify-around px-2 pb-3.5 pt-2.5">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 transition-opacity",
                active ? "opacity-100" : "opacity-60"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  active ? "text-sage-deep" : "text-ink-soft"
                )}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span
                className={cn(
                  "max-w-full truncate font-mono text-[8px] font-medium uppercase tracking-wider",
                  active ? "text-sage-deep" : "text-ink-soft"
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  active ? "bg-clay" : "bg-transparent"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
