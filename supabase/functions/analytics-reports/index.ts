import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricsQuery {
  metric_type: 'pageviews' | 'conversions' | 'goals' | 'performance' | 'user_behavior';
  start_date: string;
  end_date: string;
  filters?: Record<string, any>;
  groupBy?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { metric_type, start_date, end_date, filters, groupBy } = await req.json();

    console.log('Generating analytics report:', { metric_type, start_date, end_date, filters });

    let data = [];
    let summary = {};

    switch (metric_type) {
      case 'pageviews':
        // Get pageview analytics
        const { data: pageviews } = await supabase
          .from('analytics_events')
          .select('event_data, created_at, page_url')
          .eq('event_type', 'page_view')
          .gte('created_at', start_date)
          .lte('created_at', end_date)
          .order('created_at', { ascending: false });

        if (pageviews) {
          // Group by page or date based on groupBy parameter
          const grouped = pageviews.reduce((acc, view) => {
            const key = groupBy?.includes('page') ? view.page_url : 
                       groupBy?.includes('date') ? view.created_at.split('T')[0] : 'total';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          data = Object.entries(grouped).map(([key, count]) => ({ key, count }));
          summary = {
            total_pageviews: pageviews.length,
            unique_pages: new Set(pageviews.map(p => p.page_url)).size
          };
        }
        break;

      case 'conversions':
        // Get conversion analytics
        const { data: conversions } = await supabase
          .from('conversion_events')
          .select('*')
          .gte('created_at', start_date)
          .lte('created_at', end_date)
          .order('created_at', { ascending: false });

        if (conversions) {
          const grouped = conversions.reduce((acc, conv) => {
            const key = groupBy?.includes('type') ? conv.conversion_type :
                       groupBy?.includes('date') ? conv.created_at.split('T')[0] : 'total';
            if (!acc[key]) {
              acc[key] = { count: 0, revenue: 0 };
            }
            acc[key].count++;
            acc[key].revenue += conv.revenue || 0;
            return acc;
          }, {});

          data = Object.entries(grouped).map(([key, value]: [string, any]) => ({ 
            key, 
            count: value.count, 
            revenue: value.revenue 
          }));
          
          summary = {
            total_conversions: conversions.length,
            total_revenue: conversions.reduce((sum, c) => sum + (c.revenue || 0), 0),
            conversion_types: new Set(conversions.map(c => c.conversion_type)).size
          };
        }
        break;

      case 'goals':
        // Get goal completion analytics
        const { data: goals } = await supabase
          .from('goal_events')
          .select('*')
          .gte('created_at', start_date)
          .lte('created_at', end_date)
          .order('created_at', { ascending: false });

        if (goals) {
          const grouped = goals.reduce((acc, goal) => {
            const key = groupBy?.includes('goal') ? goal.goal_name :
                       groupBy?.includes('type') ? goal.goal_type :
                       groupBy?.includes('date') ? goal.created_at.split('T')[0] : 'total';
            if (!acc[key]) {
              acc[key] = { count: 0, value: 0 };
            }
            acc[key].count++;
            acc[key].value += goal.goal_value || 0;
            return acc;
          }, {});

          data = Object.entries(grouped).map(([key, value]: [string, any]) => ({ 
            key, 
            count: value.count, 
            value: value.value 
          }));
          
          summary = {
            total_goals: goals.length,
            unique_goals: new Set(goals.map(g => g.goal_name)).size,
            avg_goal_value: goals.reduce((sum, g) => sum + (g.goal_value || 0), 0) / goals.length
          };
        }
        break;

      case 'performance':
        // Get Core Web Vitals and performance metrics
        const { data: performance } = await supabase
          .from('analytics_events')
          .select('event_data, created_at, page_url')
          .eq('event_type', 'performance_metric')
          .gte('created_at', start_date)
          .lte('created_at', end_date)
          .order('created_at', { ascending: false });

        if (performance) {
          const metrics = performance.map(p => p.event_data);
          summary = {
            avg_lcp: metrics.reduce((sum, m) => sum + (m.lcp || 0), 0) / metrics.length,
            avg_fid: metrics.reduce((sum, m) => sum + (m.fid || 0), 0) / metrics.length,
            avg_cls: metrics.reduce((sum, m) => sum + (m.cls || 0), 0) / metrics.length,
            total_measurements: metrics.length
          };
          data = metrics;
        }
        break;

      case 'user_behavior':
        // Get user behavior patterns
        const { data: behaviors } = await supabase
          .from('analytics_events')
          .select('event_type, event_data, user_id, session_id, created_at')
          .gte('created_at', start_date)
          .lte('created_at', end_date)
          .order('created_at', { ascending: false });

        if (behaviors) {
          const sessions = behaviors.reduce((acc, behavior) => {
            if (!acc[behavior.session_id]) {
              acc[behavior.session_id] = {
                events: [],
                user_id: behavior.user_id,
                start_time: behavior.created_at,
                end_time: behavior.created_at
              };
            }
            acc[behavior.session_id].events.push(behavior);
            if (new Date(behavior.created_at) > new Date(acc[behavior.session_id].end_time)) {
              acc[behavior.session_id].end_time = behavior.created_at;
            }
            return acc;
          }, {});

          const sessionStats = Object.values(sessions).map((session: any) => ({
            session_id: session.session_id,
            user_id: session.user_id,
            duration: (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000,
            event_count: session.events.length,
            bounce: session.events.length === 1
          }));

          data = sessionStats;
          summary = {
            total_sessions: sessionStats.length,
            avg_session_duration: sessionStats.reduce((sum, s) => sum + s.duration, 0) / sessionStats.length,
            bounce_rate: sessionStats.filter(s => s.bounce).length / sessionStats.length,
            avg_events_per_session: sessionStats.reduce((sum, s) => sum + s.event_count, 0) / sessionStats.length
          };
        }
        break;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data,
        summary,
        metric_type,
        period: { start_date, end_date }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Analytics report error:', error);
    
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