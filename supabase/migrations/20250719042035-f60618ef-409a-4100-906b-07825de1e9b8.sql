-- Fix the hero banner URL to use the full URL path
UPDATE site_settings 
SET setting_value = 'https://cneljvuqzrsw.lovableproject.com/lovable-uploads/c71f7c8c-d731-4522-88a1-1fc33b22a085.png',
    updated_at = now()
WHERE setting_key = 'hero_banner_url';