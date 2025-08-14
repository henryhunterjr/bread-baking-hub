-- Add Facebook group membership field to newsletter_subscribers table
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN facebook_group_member boolean DEFAULT false;

-- Create index for better performance on Facebook group queries
CREATE INDEX idx_newsletter_subscribers_facebook_member 
ON public.newsletter_subscribers(facebook_group_member);

-- Update existing records to have a default Facebook group value
UPDATE public.newsletter_subscribers 
SET facebook_group_member = false 
WHERE facebook_group_member IS NULL;