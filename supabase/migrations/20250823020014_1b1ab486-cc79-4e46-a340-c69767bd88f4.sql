-- Move pg_trgm extension to extensions schema (best practice)
-- First, drop the extension from public schema if it exists there
drop extension if exists pg_trgm;

-- Create the extension in the proper extensions schema
create extension if not exists pg_trgm with schema extensions;