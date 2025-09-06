import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface SecurityEvent {
  event_type: string
  user_id?: string
  ip_address?: string
  user_agent?: string
  event_data?: Record<string, any>
}

Deno.serve(async (req) => {
  console.log('🔒 Security audit function called:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Check environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables in security-audit');
    return createErrorResponse('Server configuration error', 500);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    if (req.method === 'POST') {
      const { event_type, user_id, event_data } = await req.json()
      
      // Get client IP and user agent - handle comma-separated IPs
      const forwardedFor = req.headers.get('x-forwarded-for')
      const realIp = req.headers.get('x-real-ip')
      
      // Take the first IP from comma-separated list if multiple IPs exist
      let ip_address = 'unknown'
      if (forwardedFor) {
        ip_address = forwardedFor.split(',')[0].trim()
      } else if (realIp) {
        ip_address = realIp.split(',')[0].trim()
      }
      const user_agent = req.headers.get('user-agent') || 'unknown'
      
      // Log security event
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          event_type,
          user_id,
          ip_address,
          user_agent,
          event_data: event_data || {}
        })
      
      if (error) {
        console.error('Security audit log error:', error)
        return createErrorResponse('Failed to log security event', 500)
      }
      
      return createSuccessResponse({ message: 'Security event logged' })
    }
    
    // GET - Retrieve security events (admin only)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return createErrorResponse('Unauthorized', 401)
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return createErrorResponse('Unauthorized', 401)
    }
    
    // Check if user has admin role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
    
    if (!roles || roles.length === 0) {
      return createErrorResponse('Forbidden', 403)
    }
    
    // Get security events
    const { data: events, error } = await supabase
      .from('security_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      return createErrorResponse('Failed to fetch security events', 500)
    }
    
    return createSuccessResponse(events)
    
  } catch (error) {
    console.error('Security audit error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})