-- Rappels hydratation configurables (jours hydriques)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_start_hour INTEGER NOT NULL DEFAULT 9
    CHECK (notification_start_hour BETWEEN 6 AND 12),
  ADD COLUMN IF NOT EXISTS notification_end_hour INTEGER NOT NULL DEFAULT 21
    CHECK (notification_end_hour BETWEEN 12 AND 23),
  ADD COLUMN IF NOT EXISTS notification_interval_hours INTEGER NOT NULL DEFAULT 3
    CHECK (notification_interval_hours BETWEEN 1 AND 6);

UPDATE public.profiles
SET
  notification_start_hour = COALESCE(notification_start_hour, 9),
  notification_end_hour = COALESCE(notification_end_hour, 21),
  notification_interval_hours = COALESCE(notification_interval_hours, 3)
WHERE notification_start_hour IS NULL
   OR notification_end_hour IS NULL
   OR notification_interval_hours IS NULL;
