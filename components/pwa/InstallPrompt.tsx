"use client";

import { Download, Share, X } from "lucide-react";
import { HydricMark } from "@/components/ui/HydricMark";
import { usePwaInstall } from "@/hooks/usePwaInstall";

export function InstallPrompt() {
  const { visible, mode, installing, canNativeInstall, install, dismiss } =
    usePwaInstall();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-modal="true"
    >
      <div
        className="w-full max-w-phone border border-rule bg-paper p-5 safe-bottom"
        style={{ borderRadius: 2 }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <HydricMark size={40} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-deep">
                Application mobile
              </p>
              <h2
                id="pwa-install-title"
                className="font-serif text-lg font-light text-ink"
              >
                Installer HYDRIC
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-rule text-ink-mid"
            style={{ borderRadius: 2 }}
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {mode === "ios" ? (
          <div className="space-y-3 text-sm leading-relaxed text-ink-mid">
            <p>
              Ajoutez HYDRIC sur votre écran d&apos;accueil pour un accès
              rapide, en plein écran.
            </p>
            <ol className="space-y-2 border border-rule bg-bone p-3 font-mono text-[11px] text-ink">
              <li className="flex items-center gap-2">
                <Share className="h-4 w-4 shrink-0 text-sage-deep" />
                Appuyez sur <strong className="text-ink">Partager</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-sage-deep">
                  +
                </span>
                Puis <strong className="text-ink">Sur l&apos;écran d&apos;accueil</strong>
              </li>
              <li>
                Confirmez avec <strong className="text-ink">Ajouter</strong>
              </li>
            </ol>
          </div>
        ) : canNativeInstall ? (
          <p className="text-sm leading-relaxed text-ink-mid">
            Installez l&apos;application pour suivre votre méthode HYDRIC
            directement depuis votre écran d&apos;accueil — plus rapide, sans
            barre du navigateur.
          </p>
        ) : (
          <div className="space-y-3 text-sm leading-relaxed text-ink-mid">
            <p>
              Ajoutez HYDRIC à votre écran d&apos;accueil pour y accéder en un
              geste.
            </p>
            <p className="border border-rule bg-bone p-3 font-mono text-[11px] text-ink">
              Menu <strong>⋮</strong> →{" "}
              <strong>Installer l&apos;application</strong> ou{" "}
              <strong>Ajouter à l&apos;écran d&apos;accueil</strong>
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="flex-1 border border-rule py-3 font-mono text-[10px] uppercase tracking-wider text-ink-mid"
            style={{ borderRadius: 2 }}
          >
            Plus tard
          </button>
          {canNativeInstall ? (
            <button
              type="button"
              onClick={() => void install()}
              disabled={installing}
              className="btn-clay flex flex-1 items-center justify-center gap-2 py-3 disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {installing ? "Installation…" : "Installer"}
            </button>
          ) : mode === "ios" ? (
            <button
              type="button"
              onClick={dismiss}
              className="btn-clay flex-1 py-3"
            >
              Compris
            </button>
          ) : (
            <button
              type="button"
              onClick={dismiss}
              className="btn-clay flex-1 py-3"
            >
              Compris
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
