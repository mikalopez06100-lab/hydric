-- Recettes de démonstration HYDRIC (idempotent)
INSERT INTO recipes (id, title, description, day_type, duration_min, tags, ingredients, steps, plan_required, published)
VALUES
(
  '10000001-0000-4000-8000-000000000001',
  'Bouillon détox aux légumes',
  'Léger et réconfortant pour vos jours hydriques',
  'hydric',
  40,
  ARRAY['cure détox', 'léger'],
  '[{"name":"Carottes","qty":"2","unit":""},{"name":"Poireaux","qty":"1","unit":""},{"name":"Eau","qty":"1,5","unit":"L"}]'::jsonb,
  '[{"step":1,"text":"Laver et couper les légumes."},{"step":2,"text":"Mijoter 30 min à feu doux."}]'::jsonb,
  'starter',
  true
),
(
  '10000001-0000-4000-8000-000000000002',
  'Salade protéinée légère',
  'Salade complète pour un déjeuner équilibré',
  'food',
  15,
  ARRAY['protéine', 'équilibre'],
  '[{"name":"Poulet grillé","qty":"100","unit":"g"},{"name":"Mesclun","qty":"150","unit":"g"}]'::jsonb,
  '[{"step":1,"text":"Disposer le mesclun."},{"step":2,"text":"Ajouter le poulet et assaisonner."}]'::jsonb,
  'starter',
  true
),
(
  '10000001-0000-4000-8000-000000000003',
  'Tisane gingembre-citron',
  'Boisson réchauffante pour les matins hydriques',
  'hydric',
  5,
  ARRAY['tisane', 'matin'],
  '[{"name":"Gingembre","qty":"1","unit":"cm"},{"name":"Citron","qty":"1/2","unit":""}]'::jsonb,
  '[{"step":1,"text":"Infuser le gingembre 3 min."}]'::jsonb,
  'starter',
  true
),
(
  '10000001-0000-4000-8000-000000000004',
  'Bouillon détox du matin',
  'Start léger pour commencer la journée',
  'hydric',
  10,
  ARRAY['matin', 'léger'],
  NULL,
  NULL,
  'essential',
  true
),
(
  '10000001-0000-4000-8000-000000000005',
  'Velouté de courgettes',
  'Onctueux et léger en calories',
  'hydric',
  25,
  ARRAY['velouté', 'légumes'],
  NULL,
  NULL,
  'essential',
  true
),
(
  '10000001-0000-4000-8000-000000000006',
  'Bowl quinoa & légumes',
  'Repas complet pour jour alimentaire',
  'food',
  30,
  ARRAY['quinoa', 'végétarien'],
  NULL,
  NULL,
  'premium',
  true
)
ON CONFLICT (id) DO NOTHING;
