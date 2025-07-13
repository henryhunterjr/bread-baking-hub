import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function validateImageAltText(
  supabaseClient: ReturnType<typeof createClient>,
  inlineImageUrl?: string,
  socialImageUrl?: string
): Promise<string | null> {
  if (!inlineImageUrl && !socialImageUrl) {
    return null;
  }

  const imagesToCheck = [];
  if (inlineImageUrl) imagesToCheck.push(inlineImageUrl);
  if (socialImageUrl) imagesToCheck.push(socialImageUrl);

  for (const imageUrl of imagesToCheck) {
    console.log('Checking alt-text for image:', imageUrl);
    
    const { data: imageMetadata, error: metadataError } = await supabaseClient
      .from('blog_images_metadata')
      .select('alt_text')
      .eq('public_url', imageUrl)
      .single();

    console.log('Image metadata result:', { imageMetadata, metadataError });

    if (metadataError || !imageMetadata) {
      return `Image not found in metadata table: ${imageUrl}. Please upload the image through the blog image uploader to add alt text.`;
    }

    if (!imageMetadata.alt_text) {
      return `Alt text is required for the image: ${imageUrl}. Please add alt text through the image manager.`;
    }
  }

  return null;
}