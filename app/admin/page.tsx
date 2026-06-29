import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Administration</h1>
      <p className="mt-1 text-sm text-ink-mid">
        Gérez les recettes et exercices affichés dans l&apos;application.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/recipes"
          className="card-v2 block p-5 transition-colors hover:bg-bone-deep"
        >
          <p className="font-serif text-lg text-ink">Recettes</p>
          <p className="mt-1 text-xs text-ink-mid">
            Ajouter, modifier, publier et illustrer les recettes.
          </p>
        </Link>
        <Link
          href="/admin/exercises"
          className="card-v2 block p-5 transition-colors hover:bg-bone-deep"
        >
          <p className="font-serif text-lg text-ink">Exercices</p>
          <p className="mt-1 text-xs text-ink-mid">
            Gérer le catalogue d&apos;exercices physiques.
          </p>
        </Link>
      </div>
    </div>
  );
}
