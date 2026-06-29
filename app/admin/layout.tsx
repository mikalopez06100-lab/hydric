import Link from "next/link";
import { redirect } from "next/navigation";
import { HydricMark } from "@/components/ui/HydricMark";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();
  if (!user) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center">
            <HydricMark size={20} />
          </Link>
          <nav className="flex gap-3 font-mono text-[10px] uppercase tracking-wider">
            <Link href="/admin/recipes" className="text-ink-mid hover:text-sage-deep">
              Recettes
            </Link>
            <Link href="/admin/exercises" className="text-ink-mid hover:text-sage-deep">
              Exercices
            </Link>
            <Link href="/dashboard" className="text-ink-soft hover:text-ink">
              App
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
