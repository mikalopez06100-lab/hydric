"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HydricMark } from "@/components/ui/HydricMark";
import { getDevAuthPassword, isMagicLinkEnabled } from "@/lib/auth";
import { createClient, getAppUrl } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  auth: "Connexion impossible. Réessayez.",
  profile: "Profil introuvable. Contactez le support.",
  config: "Application non configurée. Variables Supabase manquantes.",
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const magicLink = isMagicLinkEnabled();
  const defaultPassword = getDevAuthPassword();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(defaultPassword);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorCode ? (ERROR_MESSAGES[errorCode] ?? "Une erreur est survenue.") : null
  );

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();

    await fetch("/api/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
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
            — Connexion
          </span>
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-wider text-bone/55"
          >
            ← Accueil
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-7">
            <HydricMark size={88} variant="outline" />
          </div>
          <div className="font-sans text-[15px] font-semibold tracking-[0.32em]">
            HYDRIC
          </div>
          <p className="mb-8 mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50">
            — La méthode —
          </p>

          {magicLink && sent ? (
            <div className="max-w-[280px]">
              <h1 className="font-serif text-xl font-light leading-snug">
                Vérifiez votre boîte mail
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-bone/65">
                Un lien de connexion a été envoyé à{" "}
                <strong className="text-bone">{email}</strong>.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-[26px] font-light leading-snug">
                Le corps <em className="italic text-bone/85">juste</em>.
                <br />
                La vie <em className="italic text-bone/85">intacte</em>.
              </h1>
              <p className="mt-3.5 max-w-[280px] text-[13px] leading-relaxed text-bone/65">
                {magicLink
                  ? "Entrez votre email pour recevoir un lien de connexion sécurisé."
                  : "Connexion directe (phase dev) — email + mot de passe."}
              </p>

              <form
                onSubmit={magicLink ? handleMagicLink : handlePasswordLogin}
                className="mt-6 w-full max-w-[300px] text-left"
              >
                <label className="block font-mono text-[10px] uppercase tracking-wider text-bone/55">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="mt-1.5 w-full border border-bone/25 bg-bone/10 px-3 py-3 text-sm text-bone placeholder:text-bone/40 outline-none focus:border-bone/50"
                    style={{ borderRadius: 2 }}
                  />
                </label>

                {!magicLink && (
                  <label className="mt-4 block font-mono text-[10px] uppercase tracking-wider text-bone/55">
                    Mot de passe
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5 w-full border border-bone/25 bg-bone/10 px-3 py-3 text-sm text-bone placeholder:text-bone/40 outline-none focus:border-bone/50"
                      style={{ borderRadius: 2 }}
                    />
                  </label>
                )}

                {error && (
                  <p className="mt-2 text-xs text-clay-pale">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay mt-4 w-full py-3.5 disabled:opacity-60"
                >
                  {loading
                    ? "Connexion…"
                    : magicLink
                      ? "Recevoir mon lien"
                      : "Se connecter"}
                </button>
              </form>

              {!magicLink && (
                <p className="mt-4 max-w-[280px] font-mono text-[9px] leading-relaxed text-bone/45">
                  Mot de passe test par défaut :{" "}
                  <code className="text-bone/70">{defaultPassword}</code>
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <p className="relative px-6 pb-8 text-center font-mono text-[10px] text-bone/40">
        {magicLink
          ? "Connexion sécurisée via Supabase"
          : "Mode dev — magic link désactivé"}
      </p>
    </div>
  );
}
