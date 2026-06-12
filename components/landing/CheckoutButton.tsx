"use client";

import { useState } from "react";
import type { PlanTier } from "@/types";

type Variant = "outline" | "primary" | "ghost";

const CLASS: Record<Variant, string> = {
  outline: "price-btn price-btn-outline",
  primary: "price-btn price-btn-primary",
  ghost: "price-btn price-btn-ghost",
};

export function CheckoutButton({
  plan,
  label,
  variant = "outline",
  disabled = false,
}: {
  plan: PlanTier;
  label: string;
  variant?: Variant;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (disabled) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? "Paiement indisponible.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={`${CLASS[variant]} w-full disabled:opacity-50`}
      >
        {loading ? "Redirection…" : label}
      </button>
      {error && (
        <p className="mt-2 text-center font-mono text-[10px] text-clay-deep">
          {error}
        </p>
      )}
    </div>
  );
}
