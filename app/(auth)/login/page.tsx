"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HydricMark } from "@/components/ui/HydricMark";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const router = useRouter();
  const { loginDemo } = useUserStore();

  function handleDemo() {
    loginDemo();
    router.push("/");
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-sage text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(244,241,234,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(194,107,74,0.12) 0%, transparent 50%)",
        }}
      />

      <div className="relative flex flex-1 flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone/60">
            — 01 / 03
          </span>
          <button
            type="button"
            onClick={handleDemo}
            className="font-mono text-[10px] uppercase tracking-wider text-bone/55"
          >
            Passer →
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-7">
            <HydricMark size={88} variant="outline" />
          </div>
          <div className="font-sans text-[15px] font-semibold tracking-[0.32em]">
            HYDRIC
          </div>
          <p className="mb-11 mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
            — La méthode —
          </p>

          <h1 className="font-serif text-[26px] font-light leading-snug">
            Le corps <em className="italic text-bone/85">juste</em>.
            <br />
            La vie <em className="italic text-bone/85">intacte</em>.
          </h1>
          <p className="mt-3.5 max-w-[240px] text-[13px] leading-relaxed text-bone/65">
            Deux journées en alternance. Aucun comptage. Le premier jour commence
            demain.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="btn-clay w-full py-3.5"
          >
            Commencer demain matin
          </button>
          <button
            type="button"
            onClick={handleDemo}
            className="mt-2 w-full border border-bone/30 py-3.5 font-sans text-[12px] font-medium uppercase tracking-wider text-bone"
            style={{ borderRadius: 2 }}
          >
            J&apos;ai déjà un compte
          </button>
          <div className="mt-6 flex justify-center gap-1">
            <span className="h-0.5 w-[18px] bg-bone" />
            <span className="h-0.5 w-[18px] bg-bone/25" />
            <span className="h-0.5 w-[18px] bg-bone/25" />
          </div>
        </div>
      </div>

      <p className="relative px-6 pb-8 text-center font-mono text-[10px] text-bone/40">
        Magic link avec Supabase ·{" "}
        <Link href="/onboarding" className="underline">
          onboarding
        </Link>
      </p>
    </div>
  );
}
