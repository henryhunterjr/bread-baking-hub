import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
  user_id?: string;
  session_id?: string;
  page_url: string;
  user_agent?: string;
  referrer?: string;
  timestamp?: string;
}

interface ConversionEvent {
  conversion_type: string; // 'affiliate_click', 'download', 'newsletter_signup', 'recipe_save', 'purchase'
  conversion_value?: number;
  product_id?: string;
  revenue?: number;
  currency?: string;
}

interface GoalEvent {
  goal_type: string; // 'engagement', 'conversion', 'retention'
  goal_name: string;
  goal_value?: number;
  metadata?: Record<string, any>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      events, 
      conversions, 
      goals,
      user_id,
      session_id 
    } = await req.json();

    console.log('Processing analytics batch:', { 
      events: events?.length || 0, 
      conversions: conversions?.length || 0,
      goals: goals?.length || 0,
      user_id,
      session_id 
    });

    const results = {
      events_processed: 0,
      conversions_processed: 0,
      goals_processed: 0,
      errors: []
    };

    // Process analytics events
    if (events && Array.isArray(events)) {
      for (const event of events) {
        try {
          const analyticsEvent: AnalyticsEvent = {
            event_type: event.event_type,
            event_data: event.event_data || {},
            user_id: user_id || event.user_id,
            session_id: session_id || event.session_id || crypto.randomUUID(),
            page_url: event.page_url || '',
            user_agent: event.user_agent,
            referrer: event.referrer,
            timestamp: new Date().toISOString()
          };

          const { error } = await supabase
            .from('analytics_events')
            .insert(analyticsEvent);

          if (error) {
            console.error('Error inserting analytics event:', error);
            results.errors.push({ type: 'event', error: error.message });
          } else {
            results.events_processed++;
          }
        } catch (error) {
          console.error('Error processing event:', error);
          results.errors.push({ type: 'event', error: error.message });
        }
      }
    }

    // Process conversion events
    if (conversions && Array.isArray(conversions)) {
      for (const conversion of conversions) {
        try {
          const conversionEvent = {
            user_id: user_id || conversion.user_id,
            session_id: session_id || conversion.session_id || crypto.randomUUID(),
            conversion_type: conversion.conversion_type,
            conversion_value: conversion.conversion_value || 0,
            product_id: conversion.product_id,
            revenue: conversion.revenue || 0,
            currency: conversion.currency || 'USD',
            page_url: conversion.page_url || '',
            referrer: conversion.referrer,
            created_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('conversion_events')
            .insert(conversionEvent);

          if (error) {
            console.error('Error inserting conversion event:', error);
            results.errors.push({ type: 'conversion', error: error.message });
          } else {
            results.conversions_processed++;
          }
        } catch (error) {
          console.error('Error processing conversion:', error);
          results.errors.push({ type: 'conversion', error: error.message });
        }
      }
    }

    // Process goal events
    if (goals && Array.isArray(goals)) {
      for (const goal of goals) {
        try {
          const goalEvent = {
            user_id: user_id || goal.user_id,
            session_id: session_id || goal.session_id || crypto.randomUUID(),
            goal_type: goal.goal_type,
            goal_name: goal.goal_name,
            goal_value: goal.goal_value || 1,
            metadata: goal.metadata || {},
            created_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('goal_events')
            .insert(goalEvent);

          if (error) {
            console.error('Error inserting goal event:', error);
            results.errors.push({ type: 'goal', error: error.message });
          } else {
            results.goals_processed++;
          }
        } catch (error) {
          console.error('Error processing goal:', error);
          results.errors.push({ type: 'goal', error: error.message });
        }
      }
    }

    console.log('Analytics processing complete:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Analytics processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});