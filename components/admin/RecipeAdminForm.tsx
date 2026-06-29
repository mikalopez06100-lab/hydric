"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminField,
  AdminImageUpload,
  inputClass,
} from "@/components/admin/AdminImageUpload";
import type { PlanTier, Recipe } from "@/types";

type Ingredient = { name: string; qty: string; unit: string };
type Step = { step: number; text: string };

type RecipeRow = Recipe & {
  ingredients?: Ingredient[];
  steps?: Step[];
};

const emptyIngredient = (): Ingredient => ({ name: "", qty: "", unit: "" });
const emptyStep = (n: number): Step => ({ step: n, text: "" });

export function RecipeAdminForm({
  recipe,
  isNew,
}: {
  recipe?: RecipeRow;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [dayType, setDayType] = useState<"hydric" | "food">(
    recipe?.day_type ?? "food"
  );
  const [mealType, setMealType] = useState<string>(
    recipe?.meal_type ?? "lunch"
  );
  const [durationMin, setDurationMin] = useState(
    recipe?.duration_min != null ? String(recipe.duration_min) : ""
  );
  const [tags, setTags] = useState((recipe?.tags ?? []).join(", "));
  const [planRequired, setPlanRequired] = useState<PlanTier>(
    recipe?.plan_required ?? "starter"
  );
  const [published, setPublished] = useState(recipe?.published ?? true);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length ? recipe.ingredients : [emptyIngredient()]
  );
  const [steps, setSteps] = useState<Step[]>(
    recipe?.steps?.length ? recipe.steps : [emptyStep(1)]
  );
  const [imageUrl, setImageUrl] = useState(recipe?.image_url ?? "");
  const [recipeId, setRecipeId] = useState(recipe?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      day_type: dayType,
      meal_type: dayType === "food" ? mealType : null,
      duration_min: durationMin ? parseInt(durationMin, 10) : null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps
        .filter((s) => s.text.trim())
        .map((s, i) => ({ step: i + 1, text: s.text.trim() })),
      plan_required: planRequired,
      published,
    };

    const url = isNew ? "/api/admin/recipes" : `/api/admin/recipes/${recipeId}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? "Enregistrement impossible");
      return;
    }

    const data = (await res.json()) as { recipe: { id: string } };
    if (isNew) {
      setRecipeId(data.recipe.id);
      router.replace(`/admin/recipes/${data.recipe.id}`);
    }
    setMessage("Recette enregistrée.");
  }

  const uploadUrl =
    recipeId || recipe?.id
      ? `/api/admin/recipes/${recipeId || recipe?.id}/image`
      : null;

  return (
    <div className="space-y-4">
      {uploadUrl && (
        <AdminImageUpload
          imageUrl={imageUrl}
          uploadUrl={uploadUrl}
          label="Image de la recette"
          onUploaded={setImageUrl}
        />
      )}
      {!uploadUrl && isNew && (
        <p className="text-xs text-ink-soft">
          Enregistrez la recette une première fois pour ajouter une image.
        </p>
      )}

      <AdminField label="Titre">
        <input
          className={inputClass()}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </AdminField>

      <AdminField label="Description">
        <textarea
          className={inputClass()}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminField>

      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Type de jour">
          <select
            className={inputClass()}
            value={dayType}
            onChange={(e) => setDayType(e.target.value as "hydric" | "food")}
          >
            <option value="hydric">Hydrique</option>
            <option value="food">Alimentaire</option>
          </select>
        </AdminField>
        {dayType === "food" && (
          <AdminField label="Repas">
            <select
              className={inputClass()}
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="breakfast">Petit-déjeuner</option>
              <option value="lunch">Déjeuner</option>
              <option value="dinner">Dîner</option>
            </select>
          </AdminField>
        )}
        <AdminField label="Durée (min)">
          <input
            type="number"
            className={inputClass()}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
          />
        </AdminField>
        <AdminField label="Plan requis">
          <select
            className={inputClass()}
            value={planRequired}
            onChange={(e) => setPlanRequired(e.target.value as PlanTier)}
          >
            <option value="starter">Starter</option>
            <option value="essential">Essentiel</option>
            <option value="premium">Premium</option>
          </select>
        </AdminField>
      </div>

      <AdminField label="Tags (séparés par des virgules)">
        <input
          className={inputClass()}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </AdminField>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publiée (visible dans l&apos;app)
      </label>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Ingrédients
          </h3>
          <button
            type="button"
            className="text-xs text-sage-deep"
            onClick={() => setIngredients((list) => [...list, emptyIngredient()])}
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2">
              <input
                placeholder="Qté"
                className={inputClass()}
                value={ing.qty}
                onChange={(e) => {
                  const next = [...ingredients];
                  next[idx] = { ...ing, qty: e.target.value };
                  setIngredients(next);
                }}
              />
              <input
                placeholder="Unité"
                className={inputClass()}
                value={ing.unit}
                onChange={(e) => {
                  const next = [...ingredients];
                  next[idx] = { ...ing, unit: e.target.value };
                  setIngredients(next);
                }}
              />
              <input
                placeholder="Nom"
                className={`${inputClass()} col-span-2`}
                value={ing.name}
                onChange={(e) => {
                  const next = [...ingredients];
                  next[idx] = { ...ing, name: e.target.value };
                  setIngredients(next);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Étapes
          </h3>
          <button
            type="button"
            className="text-xs text-sage-deep"
            onClick={() =>
              setSteps((list) => [...list, emptyStep(list.length + 1)])
            }
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <textarea
              key={idx}
              rows={2}
              placeholder={`Étape ${idx + 1}`}
              className={inputClass()}
              value={step.text}
              onChange={(e) => {
                const next = [...steps];
                next[idx] = { step: idx + 1, text: e.target.value };
                setSteps(next);
              }}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => void save()}
        disabled={saving || !title.trim()}
        className="btn-sage w-full py-3 font-mono text-[11px] uppercase tracking-wider"
      >
        {saving ? "Enregistrement…" : "Enregistrer la recette"}
      </button>
      {message && (
        <p className="text-center text-xs text-ink-mid">{message}</p>
      )}
    </div>
  );
}
