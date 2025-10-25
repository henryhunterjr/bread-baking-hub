import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const userAgent = req.headers['user-agent'] || 'No user agent';
  
  return res.status(200).json({
    userAgent: userAgent,
    allHeaders: req.headers
  });
}
