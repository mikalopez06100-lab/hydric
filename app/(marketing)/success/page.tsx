import Link from "next/link";
import { HydricLogo } from "@/components/landing/HydricLogo";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone px-6 py-12 text-center">
      <HydricLogo height={64} />
      <h1 className="mt-6 font-serif text-3xl font-light text-ink">
        Bienvenue dans HYDRIC
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-mid">
        Votre paiement a été confirmé. Connectez-vous avec la même adresse email
        pour activer votre accès à l&apos;application.
      </p>
      <Link href="/login" className="btn-clay mt-8 px-8 py-3.5">
        Accéder à l&apos;application
      </Link>
      <Link
        href="/acces"
        className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ink-soft underline"
      >
        Installer sur mobile →
      </Link>
    </div>
  );
}
