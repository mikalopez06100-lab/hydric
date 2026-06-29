import { RecipeAdminForm } from "@/components/admin/RecipeAdminForm";

export default function AdminNewRecipePage() {
  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl text-ink">Nouvelle recette</h1>
      <RecipeAdminForm isNew />
    </div>
  );
}
