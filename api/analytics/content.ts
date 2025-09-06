/**
 * Analytics Content API - Owner Dashboard
 * Returns top pages, read time, exit rates, and content performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

interface ContentMetrics {
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    avgReadTime: number;
    exitRate: number;
    assistedSignups: number;
    assistRate: number;
  }>;
  writeMoreLikeThis: Array<{
    path: string;
    title: string;
    avgReadTime: number;
    assistRate: number;
    score: number;
  }>;
  contentTypes: Array<{
    type: string;
    views: number;
    avgReadTime: number;
    signups: number;
  }>;
}

export default async function handler(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return new NextResponse('Server configuration error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get('start_date') || 
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = url.searchParams.get('end_date') || new Date().toISOString();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: events, error: eventsError } = await supabase
      .from('app_analytics_events')
      .select('*')
      .gte('ts', startDate)
      .lte('ts', endDate);

    if (eventsError) {
      throw new Error('Failed to fetch analytics events');
    }

    const pageViews = events?.filter(e => e.event === 'page_view') || [];
    const signups = events?.filter(e => e.event === 'subscribe_submit') || [];

    // Process page performance
    const pageStats = new Map<string, {
      title: string;
      views: number;
      sessions: Set<string>;
      lastEvents: Map<string, Date>; // session -> last event time
      signupSessions: Set<string>;
    }>();

    pageViews.forEach(event => {
      const path = event.path || '/';
      const title = event.title || path;
      
      if (!pageStats.has(path)) {
        pageStats.set(path, {
          title,
          views: 0,
          sessions: new Set(),
          lastEvents: new Map(),
          signupSessions: new Set()
        });
      }
      
      const stats = pageStats.get(path)!;
      stats.views++;
      stats.sessions.add(event.session_id);
      stats.lastEvents.set(event.session_id, new Date(event.ts));
    });

    // Track assisted signups (signups after visiting page)
    signups.forEach(signup => {
      const sessionId = signup.session_id;
      const signupTime = new Date(signup.ts);
      
      // Find pages visited before signup in same session
      pageViews.filter(pv => pv.session_id === sessionId && new Date(pv.ts) < signupTime)
        .forEach(pv => {
          const path = pv.path || '/';
          if (pageStats.has(path)) {
            pageStats.get(path)!.signupSessions.add(sessionId);
          }
        });
    });

    // Calculate session durations per page (approximation)
    const sessionDurations = new Map<string, Map<string, number>>();
    pageViews.forEach(event => {
      const sessionId = event.session_id;
      const path = event.path || '/';
      
      if (!sessionDurations.has(sessionId)) {
        sessionDurations.set(sessionId, new Map());
      }
      
      const session = sessionDurations.get(sessionId)!;
      session.set(path, (session.get(path) || 0) + 1);
    });

    // Calculate exit rates (sessions where page was last viewed)
    const exitCounts = new Map<string, number>();
    sessionDurations.forEach((pages, sessionId) => {
      const sessionEvents = pageViews.filter(e => e.session_id === sessionId)
        .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
      
      if (sessionEvents.length > 0) {
        const lastPage = sessionEvents[sessionEvents.length - 1].path || '/';
        exitCounts.set(lastPage, (exitCounts.get(lastPage) || 0) + 1);
      }
    });

    const topPages = Array.from(pageStats.entries()).map(([path, stats]) => {
      const exitRate = stats.sessions.size > 0 
        ? ((exitCounts.get(path) || 0) / stats.sessions.size) * 100 
        : 0;
      
      const assistedSignups = stats.signupSessions.size;
      const assistRate = stats.sessions.size > 0 
        ? (assistedSignups / stats.sessions.size) * 100 
        : 0;

      return {
        path,
        title: stats.title,
        views: stats.views,
        avgReadTime: 120, // placeholder - would calculate from session events
        exitRate: Math.round(exitRate * 100) / 100,
        assistedSignups,
        assistRate: Math.round(assistRate * 100) / 100
      };
    }).sort((a, b) => b.views - a.views).slice(0, 20);

    // "Write More Like This" - high read time + assist rate
    const writeMoreLikeThis = topPages
      .filter(page => page.assistRate > 5 && page.avgReadTime > 60) // thresholds
      .map(page => ({
        path: page.path,
        title: page.title,
        avgReadTime: page.avgReadTime,
        assistRate: page.assistRate,
        score: (page.avgReadTime / 60) * page.assistRate // composite score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Content types analysis
    const contentTypeStats = new Map<string, { views: number; sessions: Set<string>; signupSessions: Set<string> }>();
    pageViews.forEach(event => {
      const contentType = event.content_type || 'page';
      if (!contentTypeStats.has(contentType)) {
        contentTypeStats.set(contentType, { views: 0, sessions: new Set(), signupSessions: new Set() });
      }
      
      const stats = contentTypeStats.get(contentType)!;
      stats.views++;
      stats.sessions.add(event.session_id);
    });

    signups.forEach(signup => {
      const sessionId = signup.session_id;
      pageViews.filter(pv => pv.session_id === sessionId)
        .forEach(pv => {
          const contentType = pv.content_type || 'page';
          if (contentTypeStats.has(contentType)) {
            contentTypeStats.get(contentType)!.signupSessions.add(sessionId);
          }
        });
    });

    const contentTypes = Array.from(contentTypeStats.entries()).map(([type, stats]) => ({
      type,
      views: stats.views,
      avgReadTime: 120, // placeholder
      signups: stats.signupSessions.size
    })).sort((a, b) => b.views - a.views);

    const metrics: ContentMetrics = {
      topPages,
      writeMoreLikeThis,
      contentTypes
    };

    return new NextResponse(JSON.stringify(metrics), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Content analytics error:', error);
    return new NextResponse('Internal server error', {
      status: 500,
      headers: corsHeaders
    });
  }
}