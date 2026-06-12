/**
 * Applique un ou plusieurs fichiers SQL sur Postgres (DATABASE_URL dans .env.local).
 * Usage :
 *   node scripts/apply-sql.mjs supabase/migrations/001_schema.sql
 *   node scripts/apply-sql.mjs supabase/migrations/*.sql
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) return {};
  const env = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const fileArgs = process.argv.slice(2);
if (fileArgs.length === 0) {
  console.error("Usage: node scripts/apply-sql.mjs <fichier.sql> [...]");
  process.exit(1);
}

const env = { ...process.env, ...loadEnvLocal() };
const connectionString = env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL manquant dans .env.local ou l'environnement.");
  process.exit(1);
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  for (const fileArg of fileArgs) {
    const sqlPath = path.isAbsolute(fileArg) ? fileArg : path.join(root, fileArg);
    const sql = fs.readFileSync(sqlPath, "utf8");
    await client.query(sql);
    console.log("OK:", path.relative(root, sqlPath));
  }
} finally {
  await client.end();
}
