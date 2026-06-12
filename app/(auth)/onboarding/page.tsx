"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { updateProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import type { PlanTier } from "@/types";

const PLANS: Array<{
  id: PlanTier;
  name: string;
  price: string;
  features: string[];
}> = [
  {
    id: "starter",
    name: "Starter",
    price: "29 €/mois",
    features: ["Dashboard", "Tracker eau", "5 recettes", "Planning 7j"],
  },
  {
    id: "essential",
    name: "Essentiel",
    price: "49 €/mois",
    features: [
      "Toutes les recettes",
      "Planning personnalisé",
      "Stats 30 jours",
      "Favoris",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "79 €/mois",
    features: ["Export PDF", "Stats 90j", "Session 1:1 mensuelle"],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [prenom, setPrenom] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("essential");
  const [disclaimer, setDisclaimer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish() {
    if (!prenom.trim()) {
      setError("Veuillez saisir votre prénom.");
      return;
    }

    const startDate = new Date().toISOString().split("T")[0];
    const payload = {
      prenom: prenom.trim(),
      plan: selectedPlan,
      weight_goal_kg: weightGoal ? parseFloat(weightGoal) : undefined,
      start_date: startDate,
    };

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const profile = await updateProfile(supabase, user.id, payload);
    setSaving(false);

    if (!profile) {
      setError("Impossible d'enregistrer votre profil. Réessayez.");
      return;
    }

    setProfile(profile);
    router.push("/dashboard");
  }

  const inputClass =
    "mt-1.5 w-full border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-sage-deep";

  return (
    <div className="flex min-h-screen flex-col bg-bone">
      {step === 1 && (
        <div className="flex flex-1 flex-col px-6 py-10">
          <p className="eyebrow-line font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-sage-deep">
            Étape 1/3
          </p>
          <h1 className="mt-3 font-serif text-[28px] font-light text-ink">
            Bienvenue dans HYDRIC
          </h1>
          <p className="mt-2 text-sm text-ink-mid">
            Quelques infos pour personnaliser votre parcours.
          </p>

          <label className="mt-8 block text-xs font-medium text-ink">
            Votre prénom
            <input
              type="text"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Votre prénom"
              className={inputClass}
              style={{ borderRadius: 2 }}
            />
          </label>

          <label className="mt-4 block text-xs font-medium text-ink">
            Objectif poids (kg) — optionnel
            <input
              type="number"
              step="0.1"
              value={weightGoal}
              onChange={(e) => setWeightGoal(e.target.value)}
              placeholder="Ex. 62"
              className={inputClass}
              style={{ borderRadius: 2 }}
            />
          </label>

          <button
            type="button"
            onClick={() => prenom.trim() && setStep(2)}
            disabled={!prenom.trim()}
            className="btn-clay mt-auto py-3.5 disabled:opacity-40"
          >
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col px-6 py-10">
          <p className="eyebrow-line font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-sage-deep">
            Étape 2/3
          </p>
          <h1 className="mt-3 font-serif text-[28px] font-light text-ink">
            Choisissez votre plan
          </h1>

          <div className="mt-6 space-y-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full border p-4 text-left transition-colors ${
                  selectedPlan === plan.id
                    ? "border-sage-deep bg-sage-mist"
                    : "border-rule bg-paper"
                }`}
                style={{ borderRadius: 2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{plan.name}</span>
                  <span className="font-mono text-xs text-sage-deep">
                    {plan.price}
                  </span>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-ink-mid">
                      — {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-rule py-3 text-sm text-ink-mid"
              style={{ borderRadius: 2 }}
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-clay flex-1 py-3"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-1 flex-col px-6 py-10">
          <p className="eyebrow-line font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-sage-deep">
            Étape 3/3
          </p>
          <h1 className="mt-3 font-serif text-[28px] font-light text-ink">
            Avant de commencer
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-mid">
            HYDRIC est une méthode wellness. Elle ne remplace pas un avis
            médical. Consultez un professionnel de santé avant tout changement
            alimentaire significatif.
          </p>

          <label className="card-v2 mt-6 flex items-start gap-3 p-4">
            <input
              type="checkbox"
              checked={disclaimer}
              onChange={(e) => setDisclaimer(e.target.checked)}
              className="mt-0.5 accent-sage-deep"
            />
            <span className="text-sm text-ink">
              J&apos;ai lu et j&apos;accepte les conditions d&apos;utilisation
              et le disclaimer santé.
            </span>
          </label>

          {error && <p className="mt-4 text-sm text-clay-deep">{error}</p>}

          <button
            type="button"
            disabled={!disclaimer || saving}
            onClick={finish}
            className="btn-clay mt-auto w-full py-3.5 disabled:opacity-40"
          >
            {saving ? "Enregistrement…" : "Lancer ma méthode"}
          </button>
        </div>
      )}
    </div>
  );
}
