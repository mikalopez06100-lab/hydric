# Configuration Supabase HYDRIC — exécuter depuis la racine du projet
# Prérequis : token CLI + mot de passe base (Settings → Database)
param(
  [string]$AccessToken = $env:SUPABASE_ACCESS_TOKEN,
  [string]$DbPassword = $env:SUPABASE_DB_PASSWORD,
  [string]$AnonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY,
  [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
)

$ErrorActionPreference = "Stop"
$ProjectRef = "qhfklukesyrsogrijmci"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "`n=== HYDRIC — configuration Supabase ===" -ForegroundColor Cyan
Write-Host "Projet : https://$ProjectRef.supabase.co`n"

if (-not $AccessToken) {
  Write-Host "Token CLI manquant." -ForegroundColor Yellow
  Write-Host "1. https://supabase.com/dashboard/account/tokens → Generate new token"
  Write-Host "2. Relancer : `$env:SUPABASE_ACCESS_TOKEN='sbp_...'; .\scripts\setup-supabase.ps1`n"
  exit 1
}

$env:SUPABASE_ACCESS_TOKEN = $AccessToken

Write-Host "→ Connexion CLI..." -ForegroundColor Gray
npx supabase login --token $AccessToken --yes | Out-Null

Write-Host "→ Liaison projet $ProjectRef..." -ForegroundColor Gray
if ($DbPassword) {
  npx supabase link --project-ref $ProjectRef --password $DbPassword
} else {
  Write-Host "Mot de passe DB non fourni — link interactif (SUPABASE_DB_PASSWORD)." -ForegroundColor Yellow
  npx supabase link --project-ref $ProjectRef
}

Write-Host "→ Application des migrations..." -ForegroundColor Gray
npx supabase db push

Write-Host "→ Auth (redirect URLs prod + local)..." -ForegroundColor Gray
npx supabase config push 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "  config push ignoré — configurez manuellement dans Authentication → URL Configuration :" -ForegroundColor Yellow
  Write-Host "  Site URL : https://hydric.vercel.app"
  Write-Host "  Redirect : http://localhost:3000/auth/callback, https://hydric.vercel.app/auth/callback"
}

$envPath = Join-Path $Root ".env.local"
if (-not (Test-Path $envPath)) {
  Copy-Item (Join-Path $Root ".env.local.example") $envPath
  Write-Host "→ .env.local créé depuis .env.local.example" -ForegroundColor Green
}

function Set-EnvLine($key, $value) {
  if (-not $value) { return }
  $content = Get-Content $envPath -Raw
  $pattern = "(?m)^$([regex]::Escape($key))=.*$"
  if ($content -match $pattern) {
    $content = $content -replace $pattern, "$key=$value"
  } else {
    $content += "`n$key=$value"
  }
  Set-Content -Path $envPath -Value $content.TrimEnd() -NoNewline
  Add-Content -Path $envPath -Value ""
}

Set-EnvLine "NEXT_PUBLIC_SUPABASE_URL" "https://$ProjectRef.supabase.co"
Set-EnvLine "NEXT_PUBLIC_SUPABASE_ANON_KEY" $AnonKey
Set-EnvLine "SUPABASE_SERVICE_ROLE_KEY" $ServiceRoleKey
Set-EnvLine "NEXT_PUBLIC_APP_URL" "http://localhost:3000"

if (-not $AnonKey -or -not $ServiceRoleKey) {
  Write-Host "`nClés API manquantes — complétez .env.local (Settings → API) :" -ForegroundColor Yellow
  Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
  Write-Host "  SUPABASE_SERVICE_ROLE_KEY"
} else {
  Write-Host "→ .env.local mis à jour" -ForegroundColor Green
}

Write-Host "`n→ Variables Vercel (production)..." -ForegroundColor Gray
$vercelVars = @(
  @{ Name = "NEXT_PUBLIC_SUPABASE_URL"; Value = "https://$ProjectRef.supabase.co" },
  @{ Name = "NEXT_PUBLIC_SUPABASE_ANON_KEY"; Value = $AnonKey },
  @{ Name = "SUPABASE_SERVICE_ROLE_KEY"; Value = $ServiceRoleKey },
  @{ Name = "NEXT_PUBLIC_APP_URL"; Value = "https://hydric.vercel.app" }
)

foreach ($v in $vercelVars) {
  if (-not $v.Value) { continue }
  $v.Value | npx vercel env add $v.Name production --force 2>$null
  $v.Value | npx vercel env add $v.Name preview --force 2>$null
}

Write-Host "`n✓ Terminé. Vérifiez : npm run dev puis GET /api/status" -ForegroundColor Green
Write-Host "  Prod : npx vercel --prod`n"
