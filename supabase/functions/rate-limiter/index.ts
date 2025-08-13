import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, createErrorResponse, createSuccessResponse } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface RateLimitConfig {
  endpoint: string
  maxRequests: number
  windowMinutes: number
}

// Rate limit configurations
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'auth': { endpoint: 'auth', maxRequests: 5, windowMinutes: 15 },
  'contact': { endpoint: 'contact', maxRequests: 3, windowMinutes: 60 },
  'newsletter': { endpoint: 'newsletter', maxRequests: 1, windowMinutes: 60 },
  'upload': { endpoint: 'upload', maxRequests: 10, windowMinutes: 15 },
  'api': { endpoint: 'api', maxRequests: 100, windowMinutes: 15 }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { endpoint, identifier } = await req.json()
    
    const config = RATE_LIMITS[endpoint]
    if (!config) {
      return createErrorResponse('Invalid endpoint', 400)
    }
    
    const windowStart = new Date()
    windowStart.setMinutes(windowStart.getMinutes() - config.windowMinutes)
    
    // Check current request count in the time window
    const { data: existingLogs, error: fetchError } = await supabase
      .from('rate_limit_log')
      .select('request_count')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
    
    if (fetchError) {
      console.error('Rate limit fetch error:', fetchError)
      return createErrorResponse('Rate limit check failed', 500)
    }
    
    const totalRequests = existingLogs?.reduce((sum, log) => sum + log.request_count, 0) || 0
    
    if (totalRequests >= config.maxRequests) {
      // Log rate limit violation
      await supabase.from('security_audit_log').insert({
        event_type: 'rate_limit_exceeded',
        ip_address: identifier,
        event_data: { 
          endpoint, 
          requests: totalRequests, 
          limit: config.maxRequests,
          window_minutes: config.windowMinutes
        }
      })
      
      return createErrorResponse('Rate limit exceeded', 429)
    }
    
    // Log this request
    const { error: insertError } = await supabase
      .from('rate_limit_log')
      .insert({
        identifier,
        endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      })
    
    if (insertError) {
      console.error('Rate limit log error:', insertError)
    }
    
    return createSuccessResponse({ 
      allowed: true, 
      remaining: config.maxRequests - totalRequests - 1 
    })
    
  } catch (error) {
    console.error('Rate limiter error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})