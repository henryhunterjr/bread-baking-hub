/**
 * Data Retention Job
 * Purges analytics data older than 180 days for compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  // Verify cron secret
  const cronSecret = req.nextUrl.searchParams.get('secret');
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new NextResponse('Configuration error', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate 180 days ago
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - 180);
    const cutoffDate = retentionDate.toISOString();

    console.log(`Starting data retention cleanup for data older than ${cutoffDate}`);

    // Delete old analytics events
    const { count: eventsDeleted, error: eventsError } = await supabase
      .from('app_analytics_events')
      .delete()
      .lt('ts', cutoffDate);

    if (eventsError) {
      console.error('Failed to delete old analytics events:', eventsError);
      throw eventsError;
    }

    // Delete old search analytics
    const { count: searchDeleted, error: searchError } = await supabase
      .from('search_analytics')
      .delete()
      .lt('created_at', cutoffDate);

    if (searchError) {
      console.error('Failed to delete old search analytics:', searchError);
      throw searchError;
    }

    // Delete old security audit logs
    const { count: securityDeleted, error: securityError } = await supabase
      .from('security_audit_log')
      .delete()
      .lt('timestamp', cutoffDate);

    if (securityError) {
      console.error('Failed to delete old security logs:', securityError);
      throw securityError;
    }

    // Delete old rate limit logs
    const { count: rateLimitDeleted, error: rateLimitError } = await supabase
      .from('rate_limit_log')
      .delete()
      .lt('timestamp', cutoffDate);

    if (rateLimitError) {
      console.error('Failed to delete old rate limit logs:', rateLimitError);
      throw rateLimitError;
    }

    const result = {
      success: true,
      cutoffDate,
      deleted: {
        events: eventsDeleted || 0,
        searches: searchDeleted || 0,
        security: securityDeleted || 0,
        rateLimit: rateLimitDeleted || 0,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Data retention cleanup completed:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Data retention job failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}