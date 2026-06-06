-- =============================================================================
-- Update handle_new_user trigger to save roles and location from metadata
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, roles, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    ARRAY[COALESCE(NEW.raw_user_meta_data->>'role', 'PETANI')],
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  RETURN NEW;
END;
$$;
