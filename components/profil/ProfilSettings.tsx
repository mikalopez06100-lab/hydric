"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPlanLabel, getPlanPrice } from "@/lib/plan-gates";
import { hasActiveAccess } from "@/lib/access";
import { isDevOpenAccess } from "@/lib/dev";
import {
  DEFAULT_NOTIFICATION_END_HOUR,
  DEFAULT_NOTIFICATION_INTERVAL_HOURS,
  DEFAULT_NOTIFICATION_START_HOUR,
  formatReminderSchedule,
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notifications";
import { ScaleConnections } from "@/components/profil/ScaleConnections";
import { WeightHistory } from "@/components/profil/WeightHistory";
import { useUserStore } from "@/store/useUserStore";
import type { PlanTier, Profile } from "@/types";

function inputClass() {
  return "mt-1 w-full border border-rule bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-sage-deep";
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-v2 mx-4 mb-3 p-4">
      <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 font-mono text-[10px] tracking-wide text-ink-soft">
          {subtitle}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ProfilSettings() {
  const { profile, setProfile } = useUserStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [notifications, setNotifications] = useState(true);
  const [startHour, setStartHour] = useState(DEFAULT_NOTIFICATION_START_HOUR);
  const [endHour, setEndHour] = useState(DEFAULT_NOTIFICATION_END_HOUR);
  const [intervalHours, setIntervalHours] = useState(
    DEFAULT_NOTIFICATION_INTERVAL_HOURS
  );
  const [permState, setPermState] = useState(getNotificationPermission);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<PlanTier | null>(null);

  const loadData = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = (await res.json()) as {
      profile: Profile;
      current_weight_kg: number | null;
    };
    setProfile(data.profile);
    setNotifications(data.profile.notifications);
    setStartHour(data.profile.notification_start_hour);
    setEndHour(data.profile.notification_end_hour);
    setIntervalHours(data.profile.notification_interval_hours);
    setPermState(getNotificationPermission());
    setTargetWeight(
      data.profile.weight_goal_kg != null
        ? String(data.profile.weight_goal_kg)
        : ""
    );
    setCurrentWeight(
      data.current_weight_kg != null ? String(data.current_weight_kg) : ""
    );
  }, [setProfile]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (!profile) return null;

  async function uploadAvatar(file: File) {
    setSaving("avatar");
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    setSaving(null);
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? "Impossible d'envoyer la photo.");
      return;
    }
    const data = (await res.json()) as { profile: Profile };
    setProfile(data.profile);
    setMessage("Photo mise à jour.");
  }

  async function saveProfile(patch: {
    weight_goal_kg?: number | null;
    notifications?: boolean;
    notification_start_hour?: number;
    notification_end_hour?: number;
    notification_interval_hours?: number;
  }) {
    setSaving("profile");
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(null);
    if (!res.ok) {
      setMessage("Enregistrement impossible.");
      return;
    }
    const data = (await res.json()) as { profile: Profile };
    setProfile(data.profile);
    setMessage("Profil enregistré.");
  }

  async function saveCurrentWeight() {
    const kg = parseFloat(currentWeight.replace(",", "."));
    if (Number.isNaN(kg) || kg < 30 || kg > 300) {
      setMessage("Poids actuel invalide (30–300 kg).");
      return;
    }
    setSaving("weight");
    setMessage(null);
    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight_kg: kg }),
    });
    setSaving(null);
    if (!res.ok) {
      setMessage("Impossible d'enregistrer le poids.");
      return;
    }
    setMessage("Poids actuel enregistré.");
  }

  async function saveGoals() {
    const goal = targetWeight.trim()
      ? parseFloat(targetWeight.replace(",", "."))
      : null;
    if (goal != null && (Number.isNaN(goal) || goal < 30 || goal > 300)) {
      setMessage("Poids cible invalide.");
      return;
    }
    await saveProfile({ weight_goal_kg: goal ?? null });
  }

  async function saveNotifications() {
    if (startHour >= endHour) {
      setMessage("L'heure de fin doit être après le début.");
      return;
    }
    if (notifications && permState !== "granted") {
      const next = await requestNotificationPermission();
      setPermState(next);
      if (next !== "granted") {
        setMessage("Autorisez les notifications dans votre navigateur.");
        return;
      }
    }
    await saveProfile({
      notifications,
      notification_start_hour: startHour,
      notification_end_hour: endHour,
      notification_interval_hours: intervalHours,
    });
  }

  async function enableBrowserNotifications() {
    const next = await requestNotificationPermission();
    setPermState(next);
    if (next === "granted") {
      setMessage("Notifications navigateur activées.");
    } else if (next === "denied") {
      setMessage("Notifications bloquées — modifiez les paramètres du navigateur.");
    }
  }

  const schedulePreview = formatReminderSchedule(
    startHour,
    endHour,
    intervalHours
  );

  async function startCheckout(plan: PlanTier) {
    setCheckoutLoading(plan);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.error ?? "Paiement indisponible.");
    } catch {
      setMessage("Paiement indisponible.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  const active = hasActiveAccess(profile.stripe_status);
  const initial = profile.prenom.charAt(0).toUpperCase();

  return (
    <>
      <Section title="Photo de profil" subtitle="JPEG, PNG ou WebP · max 5 Mo">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={saving === "avatar"}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rule bg-sage-mist font-serif text-2xl text-sage-deep"
          >
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </button>
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={saving === "avatar"}
              className="btn-clay px-4 py-2 text-[11px] disabled:opacity-50"
            >
              {saving === "avatar" ? "Envoi…" : "Choisir une photo"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAvatar(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Ma balance"
        subtitle="Multi-marques — connectez la vôtre ou saisissez à la main"
      >
        <Suspense
          fallback={
            <p className="font-mono text-[10px] text-ink-soft">Chargement…</p>
          }
        >
          <ScaleConnections />
        </Suspense>
      </Section>

      <Section title="Poids" subtitle="Historique, saisie manuelle et objectif">
        <WeightHistory goalKg={profile.weight_goal_kg} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium text-ink">
            Poids actuel (kg)
            <input
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="Ex. 68.5"
              className={inputClass()}
              style={{ borderRadius: 2 }}
            />
          </label>
          <label className="block text-xs font-medium text-ink">
            Poids cible (kg)
            <input
              type="number"
              step="0.1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="Ex. 62"
              className={inputClass()}
              style={{ borderRadius: 2 }}
            />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={saving === "weight"}
            onClick={() => void saveCurrentWeight()}
            className="flex-1 border border-rule py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-mid disabled:opacity-50"
            style={{ borderRadius: 2 }}
          >
            Enregistrer poids actuel
          </button>
          <button
            type="button"
            disabled={saving === "profile"}
            onClick={() => void saveGoals()}
            className="btn-clay flex-1 py-2.5 text-[11px] disabled:opacity-50"
          >
            Enregistrer objectifs
          </button>
        </div>
      </Section>

      <Section
        title="Notifications"
        subtitle="Jours hydriques uniquement · rappel toutes les 3 h par défaut"
      >
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm text-ink-mid">
            Rappels d&apos;hydratation
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((v) => !v)}
            className={`relative h-7 w-12 shrink-0 border transition-colors ${
              notifications
                ? "border-sage-deep bg-sage"
                : "border-rule bg-bone-deep"
            }`}
            style={{ borderRadius: 14 }}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 bg-paper shadow transition-all ${
                notifications ? "left-[22px]" : "left-0.5"
              }`}
              style={{ borderRadius: "50%" }}
            />
          </button>
        </label>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <label className="block text-[10px] font-medium uppercase tracking-wider text-ink-soft">
            Début
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className={`${inputClass()} font-mono text-xs`}
              style={{ borderRadius: 2 }}
            >
              {Array.from({ length: 7 }, (_, i) => i + 6).map((h) => (
                <option key={h} value={h}>
                  {h}h
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-ink-soft">
            Fin
            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className={`${inputClass()} font-mono text-xs`}
              style={{ borderRadius: 2 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                <option key={h} value={h}>
                  {h}h
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-ink-soft">
            Intervalle
            <select
              value={intervalHours}
              onChange={(e) => setIntervalHours(Number(e.target.value))}
              className={`${inputClass()} font-mono text-xs`}
              style={{ borderRadius: 2 }}
            >
              {[1, 2, 3, 4, 6].map((h) => (
                <option key={h} value={h}>
                  {h} h
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 border border-rule bg-bone-deep px-3 py-2 font-mono text-[10px] leading-relaxed text-ink-mid" style={{ borderRadius: 2 }}>
          Jours hydriques : {schedulePreview || "plage invalide"}
        </p>

        {permState !== "granted" && (
          <button
            type="button"
            onClick={() => void enableBrowserNotifications()}
            className="mt-3 w-full border border-sage-deep py-2.5 font-mono text-[10px] uppercase tracking-wider text-sage-deep"
            style={{ borderRadius: 2 }}
          >
            Autoriser les notifications navigateur
          </button>
        )}
        {permState === "granted" && (
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-sage-deep">
            ✓ Notifications navigateur activées
          </p>
        )}
        {permState === "denied" && (
          <p className="mt-2 text-center text-[10px] text-clay-deep">
            Notifications bloquées par le navigateur
          </p>
        )}

        <button
          type="button"
          disabled={saving === "profile"}
          onClick={() => void saveNotifications()}
          className="btn-clay mt-3 w-full py-2.5 text-[11px] disabled:opacity-50"
        >
          Enregistrer les rappels
        </button>
      </Section>

      <Section
        title="Abonnement"
        subtitle={`${getPlanLabel(profile.plan)} · ${getPlanPrice(profile.plan)}`}
      >
        <div className="flex items-center justify-between border border-rule bg-bone-deep px-3 py-2.5" style={{ borderRadius: 2 }}>
          <div>
            <p className="text-sm font-medium text-ink">
              Plan {getPlanLabel(profile.plan)}
            </p>
            <p className="font-mono text-[10px] text-ink-soft">
              Statut :{" "}
              {active
                ? isDevOpenAccess()
                  ? "Actif (dev)"
                  : profile.stripe_status === "complimentary"
                    ? "Accès code privé"
                    : "Actif"
                : "Inactif"}
            </p>
          </div>
          <span
            className={`h-2 w-2 rounded-full ${
              active ? "bg-sage-deep" : "bg-clay"
            }`}
          />
        </div>

        {!active && (
          <p className="mt-2 text-xs text-ink-mid">
            Souscrivez ou utilisez un code d&apos;accès pour débloquer l&apos;app.
          </p>
        )}

        <div className="mt-3 space-y-2">
          {(["essential", "premium"] as PlanTier[]).map((plan) => (
            <button
              key={plan}
              type="button"
              disabled={profile.plan === plan || checkoutLoading !== null}
              onClick={() => void startCheckout(plan)}
              className="flex w-full items-center justify-between border border-rule bg-paper px-3 py-2.5 text-left disabled:opacity-40"
              style={{ borderRadius: 2 }}
            >
              <span className="text-sm text-ink">
                {profile.plan === plan ? "✓ " : ""}
                Passer au {getPlanLabel(plan)}
              </span>
              <span className="font-mono text-[10px] text-sage-deep">
                {checkoutLoading === plan ? "…" : getPlanPrice(plan)}
              </span>
            </button>
          ))}
          <Link
            href="/acces"
            className="flex w-full items-center justify-between border border-rule bg-paper px-3 py-2.5 text-sm text-ink"
            style={{ borderRadius: 2 }}
          >
            Code d&apos;accès privé
            <span className="font-mono text-[10px] text-sage-deep">→</span>
          </Link>
        </div>
      </Section>

      {message && (
        <p className="mx-4 mb-2 text-center text-xs text-sage-deep">{message}</p>
      )}
    </>
  );
}
