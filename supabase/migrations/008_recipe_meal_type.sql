-- Type de repas pour les recettes alimentaires
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner');

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS meal_type meal_type;

-- Recettes alimentaires existantes
UPDATE public.recipes
SET meal_type = 'lunch'::meal_type
WHERE id = '10000001-0000-4000-8000-000000000002';

UPDATE public.recipes
SET meal_type = 'dinner'::meal_type
WHERE id = '10000001-0000-4000-8000-000000000006';

-- Nouvelles recettes par repas
INSERT INTO recipes (
  id, title, description, day_type, meal_type, duration_min, tags,
  ingredients, steps, plan_required, published
)
VALUES
(
  '10000001-0000-4000-8000-000000000007',
  'Overnight oats HYDRIC',
  'Petit-déjeuner préparé la veille, léger et rassasiant',
  'food',
  'breakfast',
  10,
  ARRAY['sans cuisson', 'fibres'],
  '[{"name":"Flocons d''avoine","qty":"50","unit":"g"},{"name":"Lait d''amande","qty":"120","unit":"ml"},{"name":"Graines de chia","qty":"1","unit":"c. à s."}]'::jsonb,
  '[{"step":1,"text":"Mélanger tous les ingrédients dans un bocal."},{"step":2,"text":"Réfrigérer toute la nuit. Ajouter fruits rouges au matin."}]'::jsonb,
  'starter',
  true
),
(
  '10000001-0000-4000-8000-000000000008',
  'Smoothie bowl énergie',
  'Bol vitaminé pour démarrer un jour alimentaire',
  'food',
  'breakfast',
  8,
  ARRAY['fruits', 'rapide'],
  '[{"name":"Banane","qty":"1","unit":""},{"name":"Myrtilles","qty":"80","unit":"g"},{"name":"Yaourt grec","qty":"100","unit":"g"}]'::jsonb,
  '[{"step":1,"text":"Mixer banane et yaourt."},{"step":2,"text":"Verser dans un bol, garnir de myrtilles."}]'::jsonb,
  'essential',
  true
),
(
  '10000001-0000-4000-8000-000000000009',
  'Wrap poulet & crudités',
  'Déjeuner portable, équilibré et savoureux',
  'food',
  'lunch',
  12,
  ARRAY['protéine', 'rapide'],
  '[{"name":"Tortilla complète","qty":"1","unit":""},{"name":"Poulet rôti","qty":"80","unit":"g"},{"name":"Crudités","qty":"100","unit":"g"}]'::jsonb,
  '[{"step":1,"text":"Garnir la tortilla."},{"step":2,"text":"Rouler et couper en deux."}]'::jsonb,
  'essential',
  true
),
(
  '10000001-0000-4000-8000-000000000010',
  'Poisson vapeur & légumes verts',
  'Dîner léger, idéal en fin de journée alimentaire',
  'food',
  'dinner',
  25,
  ARRAY['poisson', 'léger'],
  '[{"name":"Filet de cabillaud","qty":"150","unit":"g"},{"name":"Haricots verts","qty":"150","unit":"g"},{"name":"Citron","qty":"1/2","unit":""}]'::jsonb,
  '[{"step":1,"text":"Cuire le poisson à la vapeur 12 min."},{"step":2,"text":"Servir avec légumes et citron."}]'::jsonb,
  'essential',
  true
)
ON CONFLICT (id) DO UPDATE SET
  meal_type = EXCLUDED.meal_type,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  ingredients = EXCLUDED.ingredients,
  steps = EXCLUDED.steps;
