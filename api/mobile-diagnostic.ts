import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const diagnostics = {
    userAgent: req.headers['user-agent'] || 'No user agent',
    isMobile: /mobile|iphone|ipad|android/i.test(req.headers['user-agent'] || ''),
    timestamp: new Date().toISOString(),
    allHeaders: req.headers,
    url: req.url,
    method: req.method
  };
  
  return res.status(200).json(diagnostics);
}
