/**
 * Génère supabase/migrations/011_seed_recipes_40.sql depuis data/hydric_recipes.json
 * Usage: node scripts/generate-recipes-migration.mjs
 */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const src =
  process.argv[2] ??
  path.join(root, "data", "hydric_recipes.json");

if (!fs.existsSync(src)) {
  console.error("Fichier introuvable:", src);
  process.exit(1);
}

const recipes = JSON.parse(fs.readFileSync(src, "utf8"));

function slugToUuid(slug) {
  const hash = createHash("sha1").update(`hydric-recipe:${slug}`).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    "8" + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function mapIngredients(list) {
  return (list ?? []).map((ing) => ({
    name: ing.name,
    qty: String(ing.qty),
    unit: ing.unit ?? "",
  }));
}

const values = recipes.map((r) => {
  const id = slugToUuid(r.id);
  const ingredients = JSON.stringify(mapIngredients(r.ingredients));
  const steps = JSON.stringify(r.steps ?? []);
  const tags = r.tags?.length
    ? `ARRAY[${r.tags.map(sqlStr).join(", ")}]`
    : "NULL";
  const mealType = r.meal_type ? sqlStr(r.meal_type) : "NULL";

  return `(
  ${sqlStr(id)}::uuid,
  ${sqlStr(r.title)},
  ${sqlStr(r.description ?? "")},
  ${sqlStr(r.day_type)}::day_type,
  ${mealType}::meal_type,
  ${r.duration_min ?? "NULL"},
  ${tags},
  ${sqlStr(ingredients)}::jsonb,
  ${sqlStr(steps)}::jsonb,
  ${sqlStr(r.plan_required)}::plan_tier,
  ${r.published !== false}
)`;
});

const sql = `-- Catalogue HYDRIC — 40 recettes (10 hydriques, 10 PDJ, 10 déj, 10 dîn)
-- Source: data/hydric_recipes.json

DELETE FROM public.recipes;

INSERT INTO public.recipes (
  id, title, description, day_type, meal_type, duration_min,
  tags, ingredients, steps, plan_required, published
)
VALUES
${values.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  day_type = EXCLUDED.day_type,
  meal_type = EXCLUDED.meal_type,
  duration_min = EXCLUDED.duration_min,
  tags = EXCLUDED.tags,
  ingredients = EXCLUDED.ingredients,
  steps = EXCLUDED.steps,
  plan_required = EXCLUDED.plan_required,
  published = EXCLUDED.published;
`;

const out = path.join(root, "supabase", "migrations", "011_seed_recipes_40.sql");
fs.writeFileSync(out, sql, "utf8");
console.log(`Écrit ${recipes.length} recettes → ${out}`);
