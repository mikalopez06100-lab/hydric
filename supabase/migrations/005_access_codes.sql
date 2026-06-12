-- Codes d'accès privés + abonnements Stripe en attente
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  plan plan_tier NOT NULL DEFAULT 'essential',
  max_uses INTEGER NOT NULL DEFAULT 1,
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  code_id UUID REFERENCES access_codes(id) ON DELETE SET NULL,
  plan plan_tier NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stripe_pending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  plan plan_tier NOT NULL,
  stripe_customer_id TEXT,
  stripe_sub_id TEXT,
  stripe_status TEXT DEFAULT 'active',
  fulfilled_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON stripe_pending (lower(email));
CREATE INDEX ON access_grants (token) WHERE used_at IS NULL;

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_pending ENABLE ROW LEVEL SECURITY;

-- Accès service_role uniquement (API routes)
CREATE POLICY "service_only" ON access_codes FOR ALL USING (false);
CREATE POLICY "service_only" ON access_grants FOR ALL USING (false);
CREATE POLICY "service_only" ON stripe_pending FOR ALL USING (false);

INSERT INTO access_codes (code, plan, max_uses)
VALUES ('HYDRIC-BETA', 'essential', 100)
ON CONFLICT (code) DO NOTHING;
