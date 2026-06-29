-- Admin CMS : rôle admin, table exercices, images contenu

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

CREATE TYPE exercise_category AS ENUM (
  'cardio',
  'souplesse',
  'renforcement',
  'mobilite'
);

CREATE TYPE exercise_intensity AS ENUM ('douce', 'moderee');

CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category exercise_category NOT NULL,
  intensity exercise_intensity NOT NULL DEFAULT 'douce',
  duration_min INTEGER NOT NULL DEFAULT 15,
  tags TEXT[],
  steps JSONB NOT NULL DEFAULT '[]',
  emoji TEXT,
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exercises_published_idx ON public.exercises (published);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises_read_published"
  ON public.exercises FOR SELECT
  USING (published = true);

GRANT SELECT ON public.exercises TO anon, authenticated;

-- Bucket images recettes / exercices (lecture publique, écriture via service role)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'content-images',
  'content-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "content_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');
