"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  availabilityLabel,
  type ProviderAvailability,
} from "@/lib/scales/catalog";
import type { ScaleBrand } from "@/lib/scales/catalog";
import type { ScaleConnectionPublic, ScaleProvider } from "@/lib/scales/types";

type ProviderInfo = {
  id: ScaleProvider;
  name: string;
  description: string;
  logo: string;
  configured: boolean;
  connected: boolean;
  availability: ProviderAvailability;
  models?: string;
};

const PROVIDER_LABELS: Record<ScaleProvider, string> = {
  withings: "Withings",
  fitbit: "Fitbit",
  garmin: "Garmin",
};

function AvailabilityBadge({ status }: { status: ProviderAvailability }) {
  const styles: Record<ProviderAvailability, string> = {
    live: "bg-sage-mist text-sage-deep",
    ready: "bg-water-pale text-water",
    planned: "bg-bone-deep text-ink-soft",
    manual_only: "bg-clay-pale text-clay-deep",
  };
  return (
    <span
      className={`shrink-0 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider ${styles[status]}`}
      style={{ borderRadius: 2 }}
    >
      {availabilityLabel(status)}
    </span>
  );
}

export function ScaleConnections() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [catalog, setCatalog] = useState<ScaleBrand[]>([]);
  const [connections, setConnections] = useState<ScaleConnectionPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/scales");
    if (!res.ok) return;
    const data = (await res.json()) as {
      providers: ProviderInfo[];
      connections: ScaleConnectionPublic[];
      catalog: ScaleBrand[];
    };
    setProviders(data.providers);
    setConnections(data.connections);
    setCatalog(data.catalog ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const connected = searchParams.get("scale_connected");
    const error = searchParams.get("scale_error");
    if (connected) {
      setMessage(
        `${PROVIDER_LABELS[connected as ScaleProvider] ?? connected} connectée.`
      );
      void load();
    }
    if (error) {
      setMessage(
        error === "cancelled"
          ? "Connexion annulée."
          : `Connexion impossible : ${error}`
      );
    }
  }, [searchParams, load]);

  async function connect(provider: ScaleProvider) {
    setBusy(provider);
    setMessage(null);
    const res = await fetch(`/api/scales/${provider}/connect`, {
      method: "POST",
    });
    const data = (await res.json()) as {
      url?: string;
      error?: string;
      code?: string;
    };
    setBusy(null);

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage(
      data.code === "not_configured"
        ? `${PROVIDER_LABELS[provider]} : activation en cours côté HYDRIC. Utilisez la saisie manuelle en attendant.`
        : (data.error ?? "Connexion impossible.")
    );
  }

  async function sync(provider?: ScaleProvider) {
    setBusy(provider ?? "all");
    setMessage(null);
    const res = await fetch("/api/scales/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provider ? { provider } : {}),
    });
    setBusy(null);
    if (!res.ok) {
      setMessage("Synchronisation échouée.");
      return;
    }
    const data = (await res.json()) as {
      result?: { imported: number };
      results?: Record<string, { imported: number } | null>;
    };
    const imported =
      data.result?.imported ??
      Object.values(data.results ?? {}).reduce(
        (sum, r) => sum + (r?.imported ?? 0),
        0
      );
    setMessage(
      imported > 0
        ? `${imported} pesée${imported > 1 ? "s" : ""} importée${imported > 1 ? "s" : ""}.`
        : "Aucune nouvelle pesée à importer."
    );
    void load();
  }

  async function disconnect(provider: ScaleProvider) {
    setBusy(`disconnect-${provider}`);
    await fetch(`/api/scales/${provider}`, { method: "DELETE" });
    setBusy(null);
    setMessage(`${PROVIDER_LABELS[provider]} déconnectée.`);
    void load();
  }

  if (loading) {
    return (
      <p className="font-mono text-[10px] text-ink-soft">Chargement…</p>
    );
  }

  const otherBrands = catalog.filter((b) => b.id === "other");

  return (
    <div className="space-y-3">
      <p className="text-[11px] leading-relaxed text-ink-mid">
        <strong className="font-medium text-ink">Pas besoin d&apos;une balance
        HYDRIC.</strong> Si vous avez déjà une balance connectée (Withings,
        Fitbit, Garmin…), reliez-la ici. Sinon, la saisie manuelle suffit.
      </p>

      {providers.map((provider) => {
        const connection = connections.find((c) => c.provider === provider.id);
        const isConnected = !!connection;
        const canConnect =
          provider.availability === "ready" || provider.configured;

        return (
          <div
            key={provider.id}
            className="border border-rule bg-paper p-3"
            style={{ borderRadius: 2 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{provider.logo}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{provider.name}</p>
                  <AvailabilityBadge
                    status={
                      isConnected ? "live" : provider.availability
                    }
                  />
                </div>
                {provider.models && (
                  <p className="mt-0.5 font-mono text-[9px] text-ink-soft">
                    {provider.models}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-ink-mid">
                  {provider.description}
                </p>
                {connection?.last_sync_at && (
                  <p className="mt-1 font-mono text-[9px] text-ink-soft">
                    Sync :{" "}
                    {new Date(connection.last_sync_at).toLocaleString("fr-FR")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {!isConnected ? (
                <button
                  type="button"
                  disabled={busy !== null || provider.availability === "planned"}
                  onClick={() => void connect(provider.id)}
                  className="btn-clay px-3 py-2 text-[10px] disabled:opacity-40"
                >
                  {busy === provider.id
                    ? "…"
                    : canConnect
                      ? "Connecter"
                      : "Bientôt"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void sync(provider.id)}
                    className="border border-rule bg-bone-deep px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-mid disabled:opacity-50"
                    style={{ borderRadius: 2 }}
                  >
                    {busy === provider.id ? "…" : "Synchroniser"}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void disconnect(provider.id)}
                    className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft"
                  >
                    Déconnecter
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {otherBrands.map((brand) => (
        <div
          key={brand.id}
          className="border border-dashed border-rule bg-bone-deep px-3 py-2.5"
          style={{ borderRadius: 2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-ink-mid">
              {brand.logo} {brand.name}
            </p>
            <AvailabilityBadge status={brand.availability} />
          </div>
          <p className="mt-1 text-[10px] text-ink-soft">{brand.note}</p>
        </div>
      ))}

      {connections.length > 0 && (
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void sync()}
          className="w-full border border-sage-deep py-2 font-mono text-[10px] uppercase tracking-wider text-sage-deep disabled:opacity-50"
          style={{ borderRadius: 2 }}
        >
          {busy === "all" ? "Synchronisation…" : "Tout synchroniser"}
        </button>
      )}

      {message && (
        <p className="text-center text-xs text-sage-deep">{message}</p>
      )}
    </div>
  );
}
