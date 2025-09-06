/**
 * System Health Endpoint
 * Returns environment status, Supabase connectivity, and system metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  env: {
    supabaseConfigured: boolean;
    analyticsKeyConfigured: boolean;
    cronSecretConfigured: boolean;
    alertEmailConfigured: boolean;
  };
  supabase: {
    reachable: boolean;
    responseTime?: number;
    error?: string;
  };
  analytics: {
    backlogSize: number;
    lastMvRefresh?: string;
    sampleRate: number;
  };
  version: string;
}

export default async function handler(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new NextResponse('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const startTime = Date.now();
    
    // Check environment configuration
    const env = {
      supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      analyticsKeyConfigured: !!process.env.ANALYTICS_INGEST_KEY,
      cronSecretConfigured: !!process.env.CRON_SECRET,
      alertEmailConfigured: !!process.env.ALERT_EMAIL,
    };

    // Test Supabase connectivity
    let supabaseHealth = {
      reachable: false,
      responseTime: 0,
      error: undefined as string | undefined,
    };

    if (env.supabaseConfigured) {
      try {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const testStart = Date.now();
        const { error } = await supabase
          .from('app_analytics_events')
          .select('id')
          .limit(1);

        supabaseHealth = {
          reachable: !error,
          responseTime: Date.now() - testStart,
          error: error?.message,
        };
      } catch (error) {
        supabaseHealth = {
          reachable: false,
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    // Get analytics metrics
    let analyticsMetrics = {
      backlogSize: 0,
      lastMvRefresh: undefined as string | undefined,
      sampleRate: 1.0,
    };

    if (supabaseHealth.reachable) {
      try {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check for any processing backlog (events from last hour not processed)
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
        const { count: backlogCount } = await supabase
          .from('app_analytics_events')
          .select('*', { count: 'exact', head: true })
          .gte('ts', oneHourAgo)
          .is('processed_at', null);

        analyticsMetrics.backlogSize = backlogCount || 0;

        // Get last MV refresh time (check a metadata table or use a simple query)
        const { data: lastRefresh } = await supabase
          .from('app_analytics_events')
          .select('ts')
          .order('ts', { ascending: false })
          .limit(1)
          .single();

        analyticsMetrics.lastMvRefresh = lastRefresh?.ts;
        
        // Calculate current sample rate based on recent volume
        const { count: recentEvents } = await supabase
          .from('app_analytics_events')
          .select('*', { count: 'exact', head: true })
          .gte('ts', new Date(Date.now() - 300000).toISOString()); // Last 5 minutes

        // Adaptive sampling: reduce rate if over 1000 events per 5 minutes
        analyticsMetrics.sampleRate = recentEvents && recentEvents > 1000 
          ? Math.max(0.1, 1000 / recentEvents) 
          : 1.0;

      } catch (error) {
        console.error('Failed to get analytics metrics:', error);
      }
    }

    // Determine overall health status
    let status: HealthStatus['status'] = 'healthy';
    
    if (!env.supabaseConfigured || !supabaseHealth.reachable) {
      status = 'unhealthy';
    } else if (
      analyticsMetrics.backlogSize > 1000 || 
      (supabaseHealth.responseTime && supabaseHealth.responseTime > 5000)
    ) {
      status = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      env,
      supabase: supabaseHealth,
      analytics: analyticsMetrics,
      version: process.env.npm_package_version || '1.0.0',
    };

    return NextResponse.json(healthStatus, {
      status: status === 'unhealthy' ? 503 : 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorStatus: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      env: {
        supabaseConfigured: false,
        analyticsKeyConfigured: false,
        cronSecretConfigured: false,
        alertEmailConfigured: false,
      },
      supabase: {
        reachable: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      analytics: {
        backlogSize: -1,
        sampleRate: 0,
      },
      version: 'unknown',
    };

    return NextResponse.json(errorStatus, {
      status: 503,
      headers: corsHeaders,
    });
  }
}