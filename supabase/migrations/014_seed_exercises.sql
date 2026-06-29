-- Catalogue exercices HYDRIC (source: data/hydric_exercises.json)

INSERT INTO public.exercises (
  id, title, description, category, intensity, duration_min,
  tags, steps, emoji, published
)
VALUES
(
  '02f9af90-7182-410b-867d-ade82de40a7e'::uuid,
  'Marche active',
  'Marche à allure soutenue mais confortable, idéale les jours hydriques pour activer la circulation sans fatiguer le corps.',
  'cardio'::exercise_category,
  'douce'::exercise_intensity,
  30,
  ARRAY['extérieur', 'débutant'],
  '[{"step":1,"text":"Échauffez-vous 5 minutes à allure lente."},{"step":2,"text":"Marchez 20 minutes à allure active (vous devez pouvoir parler)."},{"step":3,"text":"Terminez par 5 minutes de marche lente et étirements légers."}]'::jsonb,
  '🚶',
  true
),
(
  '7b167938-c19c-4e38-8d02-5a0cd6cd2bf2'::uuid,
  'Yoga doux',
  'Séquence de postures douces pour relâcher les tensions, améliorer la respiration et accompagner les journées d''hydratation.',
  'souplesse'::exercise_category,
  'douce'::exercise_intensity,
  25,
  ARRAY['intérieur', 'respiration'],
  '[{"step":1,"text":"Installez-vous sur un tapis, 2 minutes de respiration abdominale."},{"step":2,"text":"Enchaînez chat-vache, posture de l''enfant et torsion assise (3 cycles)."},{"step":3,"text":"Terminez en posture jambes au mur 5 minutes, yeux fermés."}]'::jsonb,
  '🧘',
  true
),
(
  'bd3bb335-f0fe-4887-83d6-c7b9a2c2570b'::uuid,
  'Étirements complets',
  'Routine d''étirements pour délier le dos, les hanches et les jambes après une journée sédentaire ou un jour hydrique.',
  'souplesse'::exercise_category,
  'douce'::exercise_intensity,
  15,
  ARRAY['rapide', 'récupération'],
  '[{"step":1,"text":"Étirez le cou et les épaules : 30 secondes par côté."},{"step":2,"text":"Étirement des fléchisseurs de hanche et des ischio-jambiers (2 min chaque)."},{"step":3,"text":"Finissez par une torsion douce du dos debout, 1 minute par côté."}]'::jsonb,
  '🤸',
  true
),
(
  '776b7203-d38b-4802-8cc0-87dc0c660393'::uuid,
  'Pilates au sol',
  'Renforcement en douceur du centre du corps (abdominaux profonds) sans impact, compatible avec une alimentation légère.',
  'renforcement'::exercise_category,
  'moderee'::exercise_intensity,
  20,
  ARRAY['gainage', 'posture'],
  '[{"step":1,"text":"Position neutre allongée, engagez le transverse (respiration en 4 temps)."},{"step":2,"text":"Enchaînez le hundred, le single leg stretch et le bridge (10 répétitions chacun)."},{"step":3,"text":"Étirez le dos en posture de l''enfant 2 minutes."}]'::jsonb,
  '💪',
  true
),
(
  '19b14289-c878-4d9f-821b-6d17f9ec3025'::uuid,
  'Vélo doux',
  'Séance à intensité modérée sur vélo d''appartement ou en extérieur, pour brûler des calories sans solliciter les articulations.',
  'cardio'::exercise_category,
  'moderee'::exercise_intensity,
  30,
  ARRAY['cardio', 'faible impact'],
  '[{"step":1,"text":"5 minutes à résistance légère, pédalez en douceur."},{"step":2,"text":"20 minutes à rythme régulier (fréquence cardiaque modérée)."},{"step":3,"text":"5 minutes de retour au calme, étirez quadriceps et mollets."}]'::jsonb,
  '🚴',
  true
),
(
  '2ec0e981-0430-479a-8a8b-bef29c601295'::uuid,
  'Natation légère',
  'Nage en continu à allure confortable. L''eau masse le corps et favorise la détente musculaire.',
  'cardio'::exercise_category,
  'moderee'::exercise_intensity,
  25,
  ARRAY['piscine', 'articulations'],
  '[{"step":1,"text":"Échauffement : 4 longueurs au crawl lent ou brasse."},{"step":2,"text":"Nagez 15 minutes en alternant crawl et dos crawlé."},{"step":3,"text":"Terminez par 2 longueurs très lentes et étirements au bord."}]'::jsonb,
  '🏊',
  true
),
(
  'b728d975-e0a0-4f34-8e5e-ab082e6a9ea2'::uuid,
  'Marche nordique',
  'Marche avec bâtons pour solliciter 90 % des muscles. Excellent complément à la méthode HYDRIC.',
  'cardio'::exercise_category,
  'moderee'::exercise_intensity,
  40,
  ARRAY['extérieur', 'bâtons'],
  '[{"step":1,"text":"Réglez les bâtons à hauteur de poignet, échauffement 5 min sans bâtons."},{"step":2,"text":"Marche nordique 30 minutes, bras et jambes synchronisés."},{"step":3,"text":"Retour au calme 5 minutes, étirez avant-bras et épaules."}]'::jsonb,
  '🥾',
  true
),
(
  '8f2fe0ee-1849-41ed-8f43-253a683a567e'::uuid,
  'Renforcement léger',
  'Circuit au poids du corps : squats, fentes et pompes sur les genoux. Adapté aux jours alimentaires.',
  'renforcement'::exercise_category,
  'moderee'::exercise_intensity,
  20,
  ARRAY['maison', 'circuit'],
  '[{"step":1,"text":"Échauffement articulaire : 3 minutes de mobilité hanches et épaules."},{"step":2,"text":"3 tours : 10 squats, 8 fentes par jambe, 8 pompes inclinées."},{"step":3,"text":"1 minute de planche et étirements des jambes."}]'::jsonb,
  '🏋️',
  true
),
(
  'db6e12c7-b007-42c1-808f-511826a2205a'::uuid,
  'Respiration & mobilité',
  'Séance courte de cohérence cardiaque et mouvements articulaires, parfaite en journée hydrique ou le matin.',
  'mobilite'::exercise_category,
  'douce'::exercise_intensity,
  10,
  ARRAY['stress', 'matin'],
  '[{"step":1,"text":"Assis confortablement, 5 minutes de respiration 4-4-4 (inspire, pause, expire)."},{"step":2,"text":"Mobilisez cou, épaules, poignets et chevilles (1 min chaque)."},{"step":3,"text":"Terminez debout, roulez les épaules et étirez les bras vers le ciel."}]'::jsonb,
  '🌬️',
  true
),
(
  '06eb84d8-b758-4f0a-8f76-255ba364a4ef'::uuid,
  'Squats & fentes',
  'Exercices fondamentaux pour tonifier jambes et fessiers. À réaliser avec une alimentation normale pour plus d''énergie.',
  'renforcement'::exercise_category,
  'moderee'::exercise_intensity,
  15,
  ARRAY['jambes', 'maison'],
  '[{"step":1,"text":"Échauffement : 20 jumping jacks légers ou montées de genoux sur place."},{"step":2,"text":"4 séries de 12 squats, 10 fentes par jambe, 30 s de repos entre séries."},{"step":3,"text":"Étirez quadriceps, fessiers et mollets 3 minutes."}]'::jsonb,
  '🦵',
  true
)
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
