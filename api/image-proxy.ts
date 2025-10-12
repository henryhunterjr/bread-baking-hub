import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).send('Missing image URL');
  }

  // Only allow Supabase storage URLs for security
  if (!url.includes('supabase.co/storage')) {
    return res.status(403).send('Invalid image source');
  }

  try {
    // Fetch the image from Supabase
    const imageResponse = await fetch(url);
    
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).send('Failed to fetch image');
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send the image
    return res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    return res.status(500).send('Failed to proxy image');
  }
}
