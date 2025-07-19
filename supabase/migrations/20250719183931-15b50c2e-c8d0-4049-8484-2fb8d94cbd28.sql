-- Update the hero banner URL to use your brand banner image
UPDATE site_settings 
SET setting_value = '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png',
    updated_at = now()
WHERE setting_key = 'hero_banner_url';