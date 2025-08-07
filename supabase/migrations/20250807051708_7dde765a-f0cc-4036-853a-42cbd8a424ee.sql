-- Update recipe images following the established protocol
-- Database image_url takes priority over mapping file

UPDATE public.recipes 
SET image_url = '/lovable-uploads/df7254fe-d3a6-4305-b72c-becd57fc3aee.png'
WHERE slug = 'apple-cider-bread';

UPDATE public.recipes 
SET image_url = '/lovable-uploads/b39fa8be-b39e-444d-8187-0723c028b636.png'
WHERE slug = 'spiced-holiday-bread';

UPDATE public.recipes 
SET image_url = '/lovable-uploads/600d96a5-ed3c-4e4f-a75c-c24d0c6d1636.png'
WHERE slug = 'nutty-whole-grain-sourdough';

UPDATE public.recipes 
SET image_url = '/lovable-uploads/59e14538-d9b2-48c2-90c9-9d86dbc4b77e.png'
WHERE slug = 'spiced-chocolate-bread';

UPDATE public.recipes 
SET image_url = '/lovable-uploads/c3468603-a44e-4b68-8bf3-4e79f70b36f0.png'
WHERE slug = 'basic-sourdough-loaf';