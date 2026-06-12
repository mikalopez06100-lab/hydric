"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HydricLogo } from "@/components/landing/HydricLogo";

function AccesContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/redeem-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Code invalide.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-md">
      <Link href="/" className="mb-10 flex items-center gap-3 no-underline">
        <HydricLogo />
        <span className="font-sans text-sm font-semibold tracking-[0.22em] text-ink">
          HYDRIC
        </span>
      </Link>

      <h1 className="font-serif text-3xl font-light text-ink">
        Accéder à l&apos;application
      </h1>

      {reason === "subscription" && (
        <p className="mt-3 text-sm text-clay-deep">
          Un abonnement actif ou un code d&apos;accès est requis pour utiliser
          l&apos;application.
        </p>
      )}

      <p className="mt-4 text-sm leading-relaxed text-ink-mid">
        Souscrivez un plan sur la{" "}
        <Link href="/#tarifs" className="text-sage-deep underline">
          page tarifs
        </Link>
        , ou saisissez votre code privé ci-dessous.
      </p>

      {success ? (
        <div className="card-v2 mt-8 p-6">
          <p className="font-serif text-lg text-ink">Code accepté.</p>
          <p className="mt-2 text-sm text-ink-mid">
            Connectez-vous pour activer votre accès et installer l&apos;app sur
            votre téléphone.
          </p>
          <Link href="/login" className="btn-clay mt-6 block py-3 text-center">
            Se connecter
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRedeem} className="card-v2 mt-8 p-6">
          <label className="block text-xs font-medium text-ink">
            Code d&apos;accès privé
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="HYDRIC-XXXX"
              className="mt-2 w-full border border-rule bg-paper px-4 py-3 font-mono text-sm uppercase text-ink outline-none focus:border-sage-deep"
              style={{ borderRadius: 2 }}
              required
            />
          </label>
          {error && <p className="mt-3 text-sm text-clay-deep">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-clay mt-6 w-full py-3 disabled:opacity-50"
          >
            {loading ? "Vérification…" : "Valider mon code"}
          </button>
        </form>
      )}

      <div className="mt-8 border-t border-rule pt-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Déjà abonnée ?
        </p>
        <Link
          href="/login"
          className="mt-2 inline-block text-sm text-sage-deep underline"
        >
          Connexion à l&apos;app →
        </Link>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Installer sur mobile
        </p>
        <p className="mt-2 text-sm text-ink-mid">
          Une fois connectée, l&apos;app vous proposera l&apos;installation sur
          l&apos;écran d&apos;accueil (Android) ou via Partager → Sur
          l&apos;écran d&apos;accueil (iPhone).
        </p>
      </div>
    </div>
  );
}

export default function AccesPage() {
  return (
    <div className="min-h-screen bg-bone px-6 py-12">
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage border-t-transparent" />
          </div>
        }
      >
        <AccesContent />
      </Suspense>
    </div>
  );
}
