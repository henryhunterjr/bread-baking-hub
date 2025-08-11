-- Restrict modifications on site_settings to admins only; keep public read

-- 1) Drop broad policy allowing any authenticated user to modify settings
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;

-- 2) Add admin-only modification policies
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
ON public.site_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Note: Existing SELECT policy "Anyone can view site settings" remains to avoid breaking public reads.