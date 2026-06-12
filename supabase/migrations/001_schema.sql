-- HYDRIC schema — voir brief technique complet
CREATE TYPE day_type AS ENUM ('hydric', 'food');
CREATE TYPE plan_tier AS ENUM ('starter', 'essential', 'premium');
CREATE TYPE water_type AS ENUM ('water', 'tea', 'broth', 'juice', 'other');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT,
  email TEXT NOT NULL,
  plan plan_tier NOT NULL DEFAULT 'starter',
  stripe_customer_id TEXT UNIQUE,
  stripe_sub_id TEXT UNIQUE,
  stripe_status TEXT DEFAULT 'inactive',
  start_date DATE DEFAULT CURRENT_DATE,
  weight_goal_kg NUMERIC(4,1),
  water_goal_ml INTEGER DEFAULT 2000,
  notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount_ml INTEGER NOT NULL CHECK (amount_ml BETWEEN 50 AND 2000),
  type water_type NOT NULL DEFAULT 'water'
);
CREATE INDEX ON water_logs (user_id, logged_at);

CREATE TABLE day_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_date DATE NOT NULL,
  day_type day_type NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  note TEXT,
  UNIQUE (user_id, day_date)
);

CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(4,1) NOT NULL,
  UNIQUE (user_id, logged_at)
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  day_type day_type NOT NULL,
  duration_min INTEGER,
  tags TEXT[],
  ingredients JSONB,
  steps JSONB,
  image_url TEXT,
  plan_required plan_tier DEFAULT 'starter',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "water_logs_all" ON water_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "day_logs_all" ON day_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weight_logs_all" ON weight_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_all" ON favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "read_published" ON recipes FOR SELECT USING (published = TRUE);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
