/** Accès app ouvert (phase dev / utilisateurs test). Passer à false en prod. */
export function isDevOpenAccess(): boolean {
  return process.env.NEXT_PUBLIC_DEV_OPEN_ACCESS !== "false";
}
