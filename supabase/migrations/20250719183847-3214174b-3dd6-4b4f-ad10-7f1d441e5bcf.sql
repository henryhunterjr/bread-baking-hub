-- Update the hero banner URL to use the new brand banner
UPDATE site_settings 
SET setting_value = '/brand-banner.png',
    updated_at = now()
WHERE setting_key = 'hero_banner_url';