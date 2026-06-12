"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dismissInstallPrompt,
  isIOS,
  isMobile,
  isStandalone,
  wasDismissedRecently,
} from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"native" | "ios">("native");

  useEffect(() => {
    if (!isMobile() || isStandalone() || wasDismissedRecently()) return;

    setMode(isIOS() ? "ios" : "native");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const install = useCallback(async () => {
    if (mode === "ios" || !deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      }
    } finally {
      setDeferredPrompt(null);
      setInstalling(false);
    }
  }, [deferredPrompt, mode]);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  const canNativeInstall = mode === "native" && !!deferredPrompt;

  return {
    visible,
    mode,
    installing,
    canNativeInstall,
    install,
    dismiss,
  };
}
