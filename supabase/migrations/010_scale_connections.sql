-- Sources de pesée + connexions balances connectées
CREATE TYPE weight_source AS ENUM (
  'manual',
  'withings',
  'fitbit',
  'garmin',
  'bluetooth'
);

CREATE TYPE scale_provider AS ENUM ('withings', 'fitbit', 'garmin');

ALTER TABLE public.weight_logs
  ADD COLUMN IF NOT EXISTS source weight_source NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS measured_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.weight_logs
  DROP CONSTRAINT IF EXISTS weight_logs_user_id_logged_at_key;

CREATE UNIQUE INDEX IF NOT EXISTS weight_logs_manual_day
  ON public.weight_logs (user_id, logged_at)
  WHERE source = 'manual';

CREATE UNIQUE INDEX IF NOT EXISTS weight_logs_external
  ON public.weight_logs (user_id, source, external_id)
  WHERE external_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.scale_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider scale_provider NOT NULL,
  external_user_id TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  metadata JSONB NOT NULL DEFAULT '{}',
  sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS scale_connections_user_idx
  ON public.scale_connections (user_id);

ALTER TABLE public.scale_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scale_connections_select_own"
  ON public.scale_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "scale_connections_delete_own"
  ON public.scale_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Insert/update via service role (API OAuth)
