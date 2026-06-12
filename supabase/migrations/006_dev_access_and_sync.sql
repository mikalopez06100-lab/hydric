-- Phase dev : nouveaux comptes actifs + activation des profils existants
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, prenom, stripe_status, plan)
  VALUES (NEW.id, NEW.email, NULL, 'active', 'essential')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

UPDATE public.profiles
SET stripe_status = 'active',
    plan = COALESCE(plan, 'essential'::plan_tier)
WHERE stripe_status IS NULL OR stripe_status = 'inactive';

-- Marque un jour hydrique complété si objectif eau atteint
CREATE OR REPLACE FUNCTION public.refresh_day_completion(p_user_id UUID, p_day_date DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start DATE;
  v_goal INTEGER;
  v_day_type day_type;
  v_diff INTEGER;
  v_water INTEGER;
  v_completed BOOLEAN;
BEGIN
  SELECT start_date, water_goal_ml INTO v_start, v_goal
  FROM profiles WHERE id = p_user_id;

  IF v_start IS NULL THEN RETURN; END IF;

  v_diff := p_day_date - v_start;
  IF v_diff < 0 THEN RETURN; END IF;

  v_day_type := CASE WHEN v_diff % 2 = 0 THEN 'hydric'::day_type ELSE 'food'::day_type END;

  SELECT COALESCE(SUM(amount_ml), 0) INTO v_water
  FROM water_logs
  WHERE user_id = p_user_id
    AND logged_at >= p_day_date::timestamptz
    AND logged_at < (p_day_date + 1)::timestamptz;

  v_completed := CASE
    WHEN v_day_type = 'hydric' THEN v_water >= COALESCE(v_goal, 2000)
    ELSE FALSE
  END;

  INSERT INTO day_logs (user_id, day_date, day_type, completed)
  VALUES (p_user_id, p_day_date, v_day_type, v_completed)
  ON CONFLICT (user_id, day_date)
  DO UPDATE SET
    day_type = EXCLUDED.day_type,
    completed = EXCLUDED.completed;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_day_completion(UUID, DATE) TO authenticated, service_role;
