# Configuration Supabase — HYDRIC

Projet cloud : [https://qhfklukesyrsogrijmci.supabase.co](https://qhfklukesyrsogrijmci.supabase.co)

Sans clés API, l'app tourne en **mode démo** (Zustand + données locales). Avec Supabase, auth magic link + profils persistés.

---

## Option A — Script automatique (recommandé)

### 1. Récupérer les identifiants

| Source | Variable |
|--------|----------|
| [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) | `SUPABASE_ACCESS_TOKEN` |
| Settings → Database → Database password | `SUPABASE_DB_PASSWORD` |
| Settings → API → anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Settings → API → service_role | `SUPABASE_SERVICE_ROLE_KEY` |

### 2. Lancer le script

```powershell
cd c:\Users\ppmpc\hydric

$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
$env:SUPABASE_DB_PASSWORD = "votre-mot-de-passe-db"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJ..."
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."

.\scripts\setup-supabase.ps1
```

Le script : lie le projet, pousse les migrations, crée/met à jour `.env.local`, pousse les variables sur Vercel.

### 3. Vérifier

```bash
npm run dev
# http://localhost:3000/api/status → { "supabase": true, "recipes": 6 }
```

---

## Option B — SQL Editor (sans CLI)

Dans **SQL Editor** Supabase, exécuter **dans l'ordre** :

1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_auth_trigger.sql`
3. `supabase/migrations/003_seed_recipes.sql`
4. `supabase/migrations/004_grants.sql`

Puis configurer **Authentication → URL Configuration** :

- **Site URL** : `https://hydric.vercel.app`
- **Redirect URLs** :
  - `http://localhost:3000/auth/callback`
  - `https://hydric.vercel.app/auth/callback`

Créer `.env.local` depuis `.env.local.example` et renseigner les clés API.

---

## Option C — CLI manuelle

```bash
npx supabase login --token sbp_...
npx supabase link --project-ref qhfklukesyrsogrijmci
npx supabase db push
```

---

## Variables d'environnement

### Local (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://qhfklukesyrsogrijmci.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optionnel — appliquer SQL sans CLI
DATABASE_URL=postgresql://postgres.qhfklukesyrsogrijmci:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Vercel (production)

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qhfklukesyrsogrijmci.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service_role |
| `NEXT_PUBLIC_APP_URL` | `https://hydric.vercel.app` |

Après ajout des variables : **Redeploy** sur Vercel.

---

## Parcours de test

1. `/login` → saisir un email → magic link
2. Clic sur le lien → `/auth/callback` → onboarding si pas de prénom
3. Compléter onboarding → dashboard

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `LegacyPlatformAuthRequiredError` | Fournir `SUPABASE_ACCESS_TOKEN` ou `supabase login --token` |
| Magic link invalide | Vérifier redirect URLs dans le dashboard Auth |
| `/api/status` → `recipes: 0` | Exécuter `003_seed_recipes.sql` |
| Mode démo uniquement | `NEXT_PUBLIC_SUPABASE_ANON_KEY` vide ou absent sur Vercel |
