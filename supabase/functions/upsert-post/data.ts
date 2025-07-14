import { PostData, PostRecord } from './types.ts';

export function preparePostRecord(postData: PostData, userId: string, slug?: string): PostRecord {
  const {
    id,
    title,
    subtitle,
    content,
    heroImageUrl,
    inlineImageUrl,
    socialImageUrl,
    tags,
    publishAsNewsletter,
    isDraft
  } = postData;

  // Create the post data object - only include fields that are provided
  const postRecord: PostRecord = {
    user_id: userId,
  };

  // Include id for updates (if provided)
  if (id !== undefined) postRecord.id = id;
  
  // Only include fields that are provided in the request
  if (title !== undefined) postRecord.title = title;
  if (subtitle !== undefined) postRecord.subtitle = subtitle;
  if (content !== undefined) postRecord.content = content;
  if (heroImageUrl !== undefined) postRecord.hero_image_url = heroImageUrl;
  if (inlineImageUrl !== undefined) postRecord.inline_image_url = inlineImageUrl;
  if (socialImageUrl !== undefined) postRecord.social_image_url = socialImageUrl;
  if (tags !== undefined) postRecord.tags = tags || [];
  if (publishAsNewsletter !== undefined) postRecord.publish_as_newsletter = publishAsNewsletter;
  if (isDraft !== undefined) postRecord.is_draft = isDraft;
  if (slug !== undefined) postRecord.slug = slug;
  
  // Set published_at for new posts or when changing draft status
  if (isDraft !== undefined) {
    postRecord.published_at = isDraft ? null : new Date().toISOString();
  }

  return postRecord;
}