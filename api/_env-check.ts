import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest) {
  // Self-check endpoint for environment variables (booleans only)
  const response = {
    hasSUPABASE_URL: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    hasSUPABASE_ANON_KEY: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    siteUrl: process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || null
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    }
  });
}

export const config = {
  runtime: 'nodejs',
};