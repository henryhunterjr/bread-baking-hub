/**
 * Analytics Acquisition API - Owner Dashboard
 * Returns traffic sources, mediums, campaigns, geo, and device data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

interface AcquisitionMetrics {
  sources: Array<{
    source: string;
    sessions: number;
    users: number;
    pageviews: number;
    avgSessionDuration: number;
    bounceRate: number;
  }>;
  mediums: Array<{
    medium: string;
    sessions: number;
    users: number;
    conversionRate: number;
  }>;
  campaigns: Array<{
    campaign: string;
    source: string;
    sessions: number;
    signups: number;
    conversionRate: number;
  }>;
  geo: Array<{
    country: string;
    sessions: number;
    users: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    sessions: number;
    users: number;
    percentage: number;
    avgLcp: number;
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

    // Parse query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start_date') || 
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = url.searchParams.get('end_date') || new Date().toISOString();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch analytics events
    const { data: events, error: eventsError } = await supabase
      .from('app_analytics_events')
      .select('*')
      .gte('ts', startDate)
      .lte('ts', endDate);

    if (eventsError) {
      console.error('Events query error:', eventsError);
      throw new Error('Failed to fetch analytics events');
    }

    const pageViews = events?.filter(e => e.event === 'page_view') || [];
    const signups = events?.filter(e => e.event === 'subscribe_submit') || [];
    const totalSessions = new Set(events?.map(e => e.session_id) || []).size;

    // Process sources
    const sourceStats = new Map<string, {
      sessions: Set<string>;
      pageviews: number;
      durations: number[];
      bounces: Set<string>;
    }>();

    pageViews.forEach(event => {
      const source = event.source || 'direct';
      if (!sourceStats.has(source)) {
        sourceStats.set(source, {
          sessions: new Set(),
          pageviews: 0,
          durations: [],
          bounces: new Set()
        });
      }
      
      const stats = sourceStats.get(source)!;
      stats.sessions.add(event.session_id);
      stats.pageviews++;
    });

    // Calculate session durations and bounces
    const sessionDurations = new Map<string, { source: string; duration: number; pageCount: number }>();
    pageViews.forEach(event => {
      const sessionId = event.session_id;
      const source = event.source || 'direct';
      
      if (!sessionDurations.has(sessionId)) {
        sessionDurations.set(sessionId, { source, duration: 0, pageCount: 0 });
      }
      sessionDurations.get(sessionId)!.pageCount++;
    });

    // Calculate bounces (single page sessions)
    sessionDurations.forEach((session, sessionId) => {
      if (session.pageCount === 1) {
        const stats = sourceStats.get(session.source);
        if (stats) stats.bounces.add(sessionId);
      }
    });

    const sources = Array.from(sourceStats.entries()).map(([source, stats]) => ({
      source,
      sessions: stats.sessions.size,
      users: stats.sessions.size, // approximation
      pageviews: stats.pageviews,
      avgSessionDuration: 120, // placeholder - would calculate from timestamps
      bounceRate: stats.sessions.size > 0 ? (stats.bounces.size / stats.sessions.size) * 100 : 0
    })).sort((a, b) => b.sessions - a.sessions);

    // Process mediums
    const mediumStats = new Map<string, { sessions: Set<string>; signups: number }>();
    pageViews.forEach(event => {
      const medium = event.medium || 'none';
      if (!mediumStats.has(medium)) {
        mediumStats.set(medium, { sessions: new Set(), signups: 0 });
      }
      mediumStats.get(medium)!.sessions.add(event.session_id);
    });

    signups.forEach(event => {
      const medium = event.medium || 'none';
      if (mediumStats.has(medium)) {
        mediumStats.get(medium)!.signups++;
      }
    });

    const mediums = Array.from(mediumStats.entries()).map(([medium, stats]) => ({
      medium,
      sessions: stats.sessions.size,
      users: stats.sessions.size,
      conversionRate: stats.sessions.size > 0 ? (stats.signups / stats.sessions.size) * 100 : 0
    })).sort((a, b) => b.sessions - a.sessions);

    // Process campaigns
    const campaignStats = new Map<string, { source: string; sessions: Set<string>; signups: number }>();
    pageViews.forEach(event => {
      if (event.campaign) {
        const key = `${event.campaign}|${event.source || 'direct'}`;
        if (!campaignStats.has(key)) {
          campaignStats.set(key, { 
            source: event.source || 'direct', 
            sessions: new Set(), 
            signups: 0 
          });
        }
        campaignStats.get(key)!.sessions.add(event.session_id);
      }
    });

    signups.forEach(event => {
      if (event.campaign) {
        const key = `${event.campaign}|${event.source || 'direct'}`;
        if (campaignStats.has(key)) {
          campaignStats.get(key)!.signups++;
        }
      }
    });

    const campaigns = Array.from(campaignStats.entries()).map(([key, stats]) => {
      const [campaign] = key.split('|');
      return {
        campaign,
        source: stats.source,
        sessions: stats.sessions.size,
        signups: stats.signups,
        conversionRate: stats.sessions.size > 0 ? (stats.signups / stats.sessions.size) * 100 : 0
      };
    }).sort((a, b) => b.sessions - a.sessions);

    // Process geo data
    const geoStats = new Map<string, Set<string>>();
    pageViews.forEach(event => {
      const country = event.country || 'Unknown';
      if (!geoStats.has(country)) {
        geoStats.set(country, new Set());
      }
      geoStats.get(country)!.add(event.session_id);
    });

    const geo = Array.from(geoStats.entries()).map(([country, sessions]) => ({
      country,
      sessions: sessions.size,
      users: sessions.size,
      percentage: totalSessions > 0 ? (sessions.size / totalSessions) * 100 : 0
    })).sort((a, b) => b.sessions - a.sessions);

    // Process device data
    const deviceStats = new Map<string, { sessions: Set<string>; lcpValues: number[] }>();
    pageViews.forEach(event => {
      const device = event.device || 'unknown';
      if (!deviceStats.has(device)) {
        deviceStats.set(device, { sessions: new Set(), lcpValues: [] });
      }
      deviceStats.get(device)!.sessions.add(event.session_id);
    });

    // Add LCP data
    events?.filter(e => e.event === 'cwv_metric' && e.meta?.metric === 'lcp')
      .forEach(event => {
        const device = event.device || 'unknown';
        if (deviceStats.has(device)) {
          deviceStats.get(device)!.lcpValues.push(event.meta?.value || 0);
        }
      });

    const devices = Array.from(deviceStats.entries()).map(([device, stats]) => {
      const avgLcp = stats.lcpValues.length > 0 
        ? stats.lcpValues.reduce((sum, val) => sum + val, 0) / stats.lcpValues.length 
        : 0;
      
      return {
        device,
        sessions: stats.sessions.size,
        users: stats.sessions.size,
        percentage: totalSessions > 0 ? (stats.sessions.size / totalSessions) * 100 : 0,
        avgLcp: Math.round(avgLcp)
      };
    }).sort((a, b) => b.sessions - a.sessions);

    const metrics: AcquisitionMetrics = {
      sources,
      mediums,
      campaigns,
      geo,
      devices
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
    console.error('Acquisition analytics error:', error);
    return new NextResponse('Internal server error', {
      status: 500,
      headers: corsHeaders
    });
  }
}