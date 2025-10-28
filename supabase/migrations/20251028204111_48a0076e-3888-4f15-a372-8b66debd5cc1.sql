-- Add admin role for henrysbreadkitchen@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('94933882-582b-444f-8d88-5bbbe06436af', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;