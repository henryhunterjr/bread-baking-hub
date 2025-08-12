-- Follow-up security fixes: move citext to 'extensions' schema and set search_path for remaining function
begin;

-- Move citext extension out of public to recommended 'extensions' schema
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER EXTENSION citext SET SCHEMA extensions';
  EXCEPTION WHEN OTHERS THEN NULL; -- ignore if not permitted
  END;
END $$;

-- Ensure function search_path is set for all functions
ALTER FUNCTION public.create_recipe_version() SET search_path = public;

commit;