/**
 * Génère une migration SQL pour seed exercises depuis data/hydric_exercises.json
 * Usage: node scripts/generate-exercises-migration.mjs [out.sql]
 */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "data", "hydric_exercises.json");
const out =
  process.argv[2] ??
  path.join(root, "supabase", "migrations", "014_seed_exercises.sql");

const exercises = JSON.parse(fs.readFileSync(src, "utf8"));

function slugToUuid(slug) {
  const hash = createHash("sha1").update(`hydric-exercise:${slug}`).digest("hex");
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

const values = exercises.map((e) => {
  const id = slugToUuid(e.id);
  const steps = JSON.stringify(e.steps ?? []);
  const tags = e.tags?.length
    ? `ARRAY[${e.tags.map(sqlStr).join(", ")}]`
    : "NULL";

  return `(
  ${sqlStr(id)}::uuid,
  ${sqlStr(e.title)},
  ${sqlStr(e.description)},
  ${sqlStr(e.category)}::exercise_category,
  ${sqlStr(e.intensity)}::exercise_intensity,
  ${e.duration_min},
  ${tags},
  ${sqlStr(steps)}::jsonb,
  ${sqlStr(e.emoji ?? "")},
  ${e.published !== false}
)`;
});

const sql = `-- Catalogue exercices HYDRIC (source: data/hydric_exercises.json)

INSERT INTO public.exercises (
  id, title, description, category, intensity, duration_min,
  tags, steps, emoji, published
)
VALUES
${values.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  intensity = EXCLUDED.intensity,
  duration_min = EXCLUDED.duration_min,
  tags = EXCLUDED.tags,
  steps = EXCLUDED.steps,
  emoji = EXCLUDED.emoji,
  published = EXCLUDED.published,
  updated_at = NOW();
`;

fs.writeFileSync(out, sql);
console.log("Written", out, `(${exercises.length} exercises)`);
