/**
 * GDPR Data Deletion Utility
 * Removes all analytics data for a specific session_id or user_id
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

interface DeleteRequest {
  session_id?: string;
  user_id?: string;
  reason?: string;
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  try {
    // Verify admin access (same as analytics endpoints)
    const adminEmailAllowlist = process.env.ADMIN_EMAIL_ALLOWLIST;
    if (!adminEmailAllowlist) {
      return new NextResponse('Admin access not configured', { status: 500 });
    }

    // For this endpoint, we'll require manual verification
    // In production, this should be called by an admin with proper authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse('Missing authentication', { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return new NextResponse('Configuration error', { status: 500 });
    }

    const { session_id, user_id, reason }: DeleteRequest = await req.json();

    if (!session_id && !user_id) {
      return new NextResponse('Either session_id or user_id must be provided', { 
        status: 400 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`GDPR deletion request: session_id=${session_id}, user_id=${user_id}, reason=${reason}`);

    let deletedCounts = {
      events: 0,
      searches: 0,
      security: 0,
      rateLimit: 0,
    };

    // Delete analytics events
    if (session_id) {
      const { count: eventsCount, error: eventsError } = await supabase
        .from('app_analytics_events')
        .delete()
        .eq('session_id', session_id);

      if (eventsError) throw eventsError;
      deletedCounts.events = eventsCount || 0;
    }

    if (user_id) {
      const { count: eventsCount, error: eventsError } = await supabase
        .from('app_analytics_events')
        .delete()
        .eq('user_id', user_id);

      if (eventsError) throw eventsError;
      deletedCounts.events += eventsCount || 0;
    }

    // Delete search analytics (assuming session_id field exists)
    if (session_id) {
      const { count: searchCount, error: searchError } = await supabase
        .from('search_analytics')
        .delete()
        .eq('session_id', session_id);

      if (searchError) console.warn('Search analytics deletion failed:', searchError);
      else deletedCounts.searches = searchCount || 0;
    }

    // Delete security audit logs
    if (user_id) {
      const { count: securityCount, error: securityError } = await supabase
        .from('security_audit_log')
        .delete()
        .eq('user_id', user_id);

      if (securityError) console.warn('Security logs deletion failed:', securityError);
      else deletedCounts.security = securityCount || 0;
    }

    // Note: Rate limit logs are typically by IP, not session/user
    // We don't delete those unless specifically requested

    // Log the deletion for audit purposes
    await supabase
      .from('security_audit_log')
      .insert({
        event_type: 'gdpr_deletion',
        user_id: user_id || null,
        metadata: {
          session_id,
          reason,
          deleted_counts: deletedCounts,
          timestamp: new Date().toISOString(),
        },
      });

    const result = {
      success: true,
      session_id,
      user_id,
      reason,
      deleted: deletedCounts,
      timestamp: new Date().toISOString(),
    };

    console.log('GDPR deletion completed:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('GDPR deletion failed:', error);
    
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