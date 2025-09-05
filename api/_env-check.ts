export default async function handler(req: NextRequest) {
  try {
    // Self-check endpoint for environment variables (booleans only)
    const response = {
      hasSUPABASE_URL: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      hasSUPABASE_ANON_KEY: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      siteUrl: process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || null
    };

    // Log warnings for missing environment variables (without exposing values)
    if (!response.hasSUPABASE_URL) {
      console.warn('Environment check: SUPABASE_URL and VITE_SUPABASE_URL are both missing');
    }
    if (!response.hasSUPABASE_ANON_KEY) {
      console.warn('Environment check: SUPABASE_ANON_KEY and VITE_SUPABASE_ANON_KEY are both missing');
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      { error: 'Environment check failed' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};