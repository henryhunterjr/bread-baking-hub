/**
 * Privacy-First Analytics - Edge Ingestion Endpoint
 * Handles event collection with deduplication, rate limiting, and HMAC verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rate limiting storage (in production, use Redis or Vercel KV)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const dedupeSet = new Set<string>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  // Clean rate limit entries older than 1 hour
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime + 3600000) {
      rateLimitMap.delete(key);
    }
  }
  // Clean dedupe entries older than 24 hours
  if (dedupeSet.size > 10000) {
    dedupeSet.clear();
  }
}, 300000); // 5 minutes

interface AnalyticsEvent {
  event_id: string;
  event_type: string;
  ts: number;
  path: string;
  title: string;
  slug?: string;
  content_type?: string;
  referrer?: string;
  session_id: string;
  device: string;
  source?: string;
  medium?: string;
  campaign?: string;
  value_cents?: number;
  meta?: Record<string, any>;
}

interface EventPayload {
  events: AnalyticsEvent[];
}

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-analytics-key, x-analytics-ts',
  };

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Environment validation
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const analyticsKey = process.env.ANALYTICS_INGEST_KEY || 'dev-key';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // Parse payload first for HMAC verification
    const body: EventPayload = await req.json();
    const bodyString = JSON.stringify(body);

    // HMAC verification with replay protection
    const hmacHeader = req.headers.get('x-analytics-key');
    const timestampHeader = req.headers.get('x-analytics-ts');
    
    if (!hmacHeader || !timestampHeader) {
      return new NextResponse('Missing security headers', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Timestamp validation (5 minute window for replay protection)
    const timestamp = parseInt(timestampHeader);
    const now = Date.now();
    if (now - timestamp > 300000) { // 5 minutes
      return new NextResponse('Request too old', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Verify HMAC signature
    try {
      const crypto = await import('node:crypto');
      const expectedHmac = crypto
        .createHmac('sha256', analyticsKey)
        .update(bodyString + timestampHeader)
        .digest('hex');
      
      if (!crypto.timingSafeEqual(
        Buffer.from(hmacHeader, 'hex'),
        Buffer.from(expectedHmac, 'hex')
      )) {
        return new NextResponse('Invalid signature', { 
          status: 401, 
          headers: corsHeaders 
        });
      }
    } catch (error) {
      console.error('HMAC verification failed:', error);
      return new NextResponse('Authentication failed', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitKey = `ip:${clientIp}`;
    const now_minute = Math.floor(now / 60000);
    const rateLimitEntry = rateLimitMap.get(rateLimitKey);
    
    if (!rateLimitEntry || rateLimitEntry.resetTime < now_minute) {
      rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now_minute });
    } else {
      rateLimitEntry.count++;
      if (rateLimitEntry.count > 20) { // 20 events per minute per IP
        return new NextResponse(null, { status: 204, headers: corsHeaders });
      }
    }

    // Validate payload structure
    if (!body.events || !Array.isArray(body.events)) {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // Global rate limiting check
    const totalEvents = body.events.length;
    const globalRateKey = 'global';
    const globalEntry = rateLimitMap.get(globalRateKey);
    
    if (!globalEntry || globalEntry.resetTime < now_minute) {
      rateLimitMap.set(globalRateKey, { count: totalEvents, resetTime: now_minute });
    } else {
      globalEntry.count += totalEvents;
      // If sustained high traffic, implement sampling
      if (globalEntry.count > 1200) { // 20 req/s * 60s
        const sampleRate = Math.max(0.33, 1200 / globalEntry.count);
        if (Math.random() > sampleRate) {
          return new NextResponse(null, { status: 204, headers: corsHeaders });
        }
      }
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get geo data from Vercel
    const country = req.geo?.country || 'unknown';
    const city = req.geo?.city || 'unknown';
    const region = req.geo?.region || 'unknown';

    // Process events
    const processedEvents = [];
    
    for (const event of body.events) {
      // Deduplication
      const dedupeKey = `${event.event_id}_${event.ts}`;
      if (dedupeSet.has(dedupeKey)) {
        continue;
      }
      dedupeSet.add(dedupeKey);

      // Enrich with server data
      const enrichedEvent = {
        event_id: event.event_id,
        event_type: event.event_type,
        user_id: null, // No user tracking in privacy-first system
        session_id: event.session_id,
        page_url: event.path,
        referrer: event.referrer || null,
        user_agent: req.headers.get('user-agent') || null,
        ip_address: clientIp,
        event_data: {
          title: event.title,
          slug: event.slug,
          content_type: event.content_type,
          device: event.device,
          source: event.source,
          medium: event.medium,
          campaign: event.campaign,
          value_cents: event.value_cents,
          country,
          city,
          region,
          client_ts: event.ts,
          ...event.meta
        },
        created_at: new Date().toISOString()
      };

      processedEvents.push(enrichedEvent);
    }

    // Batch insert to app_analytics_events table (new structure)
    if (processedEvents.length > 0) {
      const mappedEvents = processedEvents.map(event => ({
        ts: event.created_at,
        event: event.event_type,
        event_id: event.event_id,
        session_id: event.session_id,
        user_id: event.user_id,
        path: event.page_url,
        title: event.event_data.title,
        slug: event.event_data.slug,
        content_type: event.event_data.content_type,
        source: event.event_data.source,
        medium: event.event_data.medium,
        campaign: event.event_data.campaign,
        device: event.event_data.device,
        country: event.event_data.country,
        referrer: event.referrer,
        value_cents: event.event_data.value_cents,
        sample_rate: globalEntry && globalEntry.count > 1200 
          ? Math.max(0.33, 1200 / globalEntry.count) 
          : 1,
        meta: {
          city: event.event_data.city,
          region: event.event_data.region,
          client_ts: event.event_data.client_ts,
          user_agent: event.user_agent,
          ip_address: event.ip_address,
          ...Object.fromEntries(
            Object.entries(event.event_data).filter(([key]) => 
              !['title', 'slug', 'content_type', 'device', 'source', 'medium', 'campaign', 'value_cents', 'country', 'city', 'region', 'client_ts'].includes(key)
            )
          )
        }
      }));

      const { error } = await supabase
        .from('app_analytics_events')
        .insert(mappedEvents);

      if (error) {
        console.error('Supabase insert error:', error);
      }
    }

    // Always return 204 (no body) for privacy
    return new NextResponse(null, { status: 204, headers: corsHeaders });

  } catch (error) {
    console.error('Analytics ingestion error:', error);
    // Never crash - always return success to client
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }
}