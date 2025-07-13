export interface PostData {
  id?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  heroImageUrl?: string;
  inlineImageUrl?: string;
  socialImageUrl?: string;
  tags?: string[];
  publishAsNewsletter?: boolean;
  isDraft?: boolean;
}

export interface PostRecord {
  user_id: string;
  title?: string;
  subtitle?: string;
  content?: string;
  hero_image_url?: string;
  inline_image_url?: string;
  social_image_url?: string;
  tags?: string[];
  publish_as_newsletter?: boolean;
  is_draft?: boolean;
  slug?: string;
  published_at?: string | null;
}