"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Droplets,
  Home,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { HydricMark } from "@/components/ui/HydricMark";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Accueil", title: "Accueil", icon: Home },
  { href: "/tendances", label: "Tendances", title: "Tendances", icon: Activity },
  { href: "/planning", label: "Plans", title: "Mon planning", icon: CalendarDays },
  { href: "/tracker", label: "Suivi", title: "Hydratation", icon: Droplets },
  { href: "/recettes", label: "Recettes", title: "Recettes", icon: UtensilsCrossed },
  { href: "/profil", label: "Profil", title: "Profil", icon: User },
] as const;

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/recettes/")) return "Recette";
  const item = NAV_ITEMS.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`)
  );
  return item?.title ?? "HYDRIC";
}

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const title = getPageTitle(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bone/95 backdrop-blur-md">
      <div className="flex items-center gap-2 px-[18px] pb-3 pt-3.5">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2"
          aria-label="Accueil HYDRIC"
        >
          <HydricMark size={22} />
          <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-ink sm:inline">
            HYDRIC
          </span>
        </Link>

        <p className="min-w-0 flex-1 truncate text-center text-[13px] font-semibold tracking-wide text-ink">
          {title}
        </p>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Menu de navigation"
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "flex items-center gap-1 border border-rule bg-paper px-2.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-wider text-ink-mid transition-colors",
              open && "border-sage-deep text-sage-deep"
            )}
            style={{ borderRadius: 2 }}
          >
            Menu
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

          {open && (
            <nav
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 overflow-hidden border border-rule bg-paper shadow-[0_8px_24px_rgba(26,31,27,0.12)]"
              style={{ borderRadius: 2 }}
            >
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={cn(
                      "flex items-center gap-3 border-b border-rule px-3.5 py-3 text-[13px] transition-colors last:border-0",
                      active
                        ? "bg-sage-mist font-medium text-sage-deep"
                        : "text-ink hover:bg-bone-deep"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-sage-deep" : "text-ink-soft"
                      )}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    {label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-clay" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
