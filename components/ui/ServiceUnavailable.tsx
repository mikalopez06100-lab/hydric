export function ServiceUnavailable({
  title = "Service temporairement indisponible",
  message = "La connexion à la base de données HYDRIC a échoué. Réessayez dans quelques instants.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bone px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        HYDRIC
      </p>
      <h1 className="mt-3 font-serif text-2xl font-light text-ink">{title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-mid">
        {message}
      </p>
      <p className="mt-6 font-mono text-[9px] uppercase tracking-wider text-ink-faint">
        Si le problème persiste, le projet Supabase peut être en pause — réactivez-le
        depuis le tableau de bord Supabase.
      </p>
    </div>
  );
}
